import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { memoryStore } from "./memory.js";
import { MODEL, SYSTEM_PROMPT, LONG_TERM_MEMORY_UPDATE_PROMPT } from "./config.js";
import readline from "readline";
import chalk from "chalk";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  console.log(chalk.cyan("🧠 AI Chat Agent with Memory\n"));

  // 1. Create Agent
  const tempRl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    console.log(chalk.yellow("Setting up agent..."));
    const question = (query: string): Promise<string> =>
      new Promise((resolve) => tempRl.question(query, resolve));
    
    const agentName = await question(chalk.yellow("Enter agent name: "));
    const goal = await question(chalk.yellow("Enter agent goal: "));
    
    memoryStore.setAgent(agentName, goal);
    console.log(chalk.green(`✓ Agent "${agentName}" created!\n`));
    tempRl.close();
  } catch (error) {
    console.log(chalk.red("Agent creation failed."));
    tempRl.close();
    return;
  }

  // 2. Generate or load Session ID
  let sessionId = process.env.SESSION_ID;
  if (!sessionId) {
    sessionId = uuidv4();
    fs.appendFileSync(".env", `\nSESSION_ID=${sessionId}`);
  }
  
  memoryStore.createSession(sessionId);
  
  console.log(chalk.cyan(`Session ID: ${sessionId}`));
  console.log(chalk.cyan(`UI URL: http://localhost:1234?sessionId=${sessionId}\n`));
  console.log(chalk.gray("Commands: !history, !exit, !quit\n"));

  const agent = memoryStore.getAgent()!;

  // 3. Start Conversation
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green("You: "),
  });

  rl.prompt();

  for await (const line of rl) {
    const userInput = line.trim();

    // 4. Handle Commands
    if (userInput.startsWith("!")) {
      const command = userInput.slice(1).trim().toLowerCase();
      
      if (command === "exit" || command === "quit") {
        console.log(chalk.yellow("Conversation ended."));
        break;
      } else if (command === "history") {
        const longTermMemory = memoryStore.getLongTermMemory(sessionId);
        const shortTermMemories = memoryStore.getShortTermMemory(sessionId);

        console.log(chalk.yellow("\nLong Term Memory:"));
        console.log(chalk.white(longTermMemory || "(empty)"));

        console.log(chalk.yellow("\nShort Term Memories:"));
        shortTermMemories.forEach(({ role, content }) => {
          const roleLabel = role === "user" ? chalk.green("You") : chalk.cyan("Assistant");
          console.log(`${roleLabel}: ${content}`);
        });
      } else {
        console.log(chalk.red(`Unknown command: ${command}`));
      }
      
      rl.prompt();
      continue;
    }

    // 5. Build context for AI
    const longTermMemory = memoryStore.getLongTermMemory(sessionId);
    const shortTermMemories = memoryStore.getShortTermMemory(sessionId);

    const messages: any[] = [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}${agent.name ? `\n\nAssistant Name: ${agent.name}` : ""}${agent.goal ? `\n\nAgent Goal: ${agent.goal}` : ""}${longTermMemory ? `\n\nLong Term Memory: ${longTermMemory}` : ""}`,
      },
      ...shortTermMemories.map(({ role, content }) => ({ role, content })),
      {
        role: "user",
        content: userInput,
      },
    ];

    try {
      // 6. Get AI response
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: messages,
      });

      const assistantMessage = completion.choices[0].message.content!;
      console.log(chalk.cyan(`${agent.name}: ${assistantMessage}`));

      // 7. Update memories
      memoryStore.addShortTermMemory(sessionId, "user", userInput);
      memoryStore.addShortTermMemory(sessionId, "assistant", assistantMessage);
      memoryStore.addLog(sessionId, MODEL, userInput, assistantMessage);

      // 8. Update long-term memory
      await updateLongTermMemory(sessionId, assistantMessage);
    } catch (error: any) {
      console.log(chalk.red(`Error: ${error.message}`));
    }

    rl.prompt();
  }

  rl.close();
}

async function updateLongTermMemory(sessionId: string, recentMessage: string) {
  const currentMemory = memoryStore.getLongTermMemory(sessionId);
  
  const prompt = LONG_TERM_MEMORY_UPDATE_PROMPT
    .replace("{current_memory}", currentMemory || "No existing memory")
    .replace("{content}", recentMessage);

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const updatedMemory = completion.choices[0].message.content!;
    memoryStore.setLongTermMemory(sessionId, updatedMemory);
  } catch (error) {
    // Silent fail for memory update
  }
}

main();