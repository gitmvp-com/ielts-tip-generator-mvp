import { v4 as uuidv4 } from "uuid";
import { MAX_SHORT_TERM_MEMORIES } from "./config.js";

interface Message {
  role: string;
  content: string;
  created_at: string;
}

interface Log {
  uuid: string;
  session_id: string;
  model: string;
  user_question: string;
  assistant_reply: string;
  created_at: string;
}

interface Agent {
  name: string;
  goal: string;
}

class MemoryStore {
  private sessions: Map<string, {
    shortTermMemory: Message[];
    longTermMemory: string;
    logs: Log[];
  }>;
  private agent: Agent | null = null;

  constructor() {
    this.sessions = new Map();
  }

  createSession(sessionId: string) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        shortTermMemory: [],
        longTermMemory: "",
        logs: []
      });
    }
  }

  setAgent(name: string, goal: string) {
    this.agent = { name, goal };
  }

  getAgent(): Agent | null {
    return this.agent;
  }

  addShortTermMemory(sessionId: string, role: string, content: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.shortTermMemory.push({
      role,
      content,
      created_at: new Date().toISOString()
    });

    // Keep only last MAX_SHORT_TERM_MEMORIES messages
    if (session.shortTermMemory.length > MAX_SHORT_TERM_MEMORIES) {
      session.shortTermMemory = session.shortTermMemory.slice(-MAX_SHORT_TERM_MEMORIES);
    }
  }

  getShortTermMemory(sessionId: string): Message[] {
    return this.sessions.get(sessionId)?.shortTermMemory || [];
  }

  setLongTermMemory(sessionId: string, content: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    session.longTermMemory = content;
  }

  getLongTermMemory(sessionId: string): string {
    return this.sessions.get(sessionId)?.longTermMemory || "";
  }

  addLog(sessionId: string, model: string, userQuestion: string, assistantReply: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.logs.push({
      uuid: uuidv4(),
      session_id: sessionId,
      model,
      user_question: userQuestion,
      assistant_reply: assistantReply,
      created_at: new Date().toISOString()
    });
  }

  getLogs(sessionId: string): Log[] {
    return this.sessions.get(sessionId)?.logs || [];
  }
}

export const memoryStore = new MemoryStore();
export type { Message, Log, Agent };