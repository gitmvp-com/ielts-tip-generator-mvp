# IELTS Tip Generator MVP

A simplified version of the AI chat assistant with a neural interface UI. This MVP focuses on the core chat functionality with memory management.

![Neural Interface](https://img.shields.io/badge/AI-Neural_Interface-00FFFF?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=for-the-badge)
![Vue](https://img.shields.io/badge/Vue-3-green?style=for-the-badge)

## Features

✅ **AI Chat Interface** - Interactive conversation with OpenAI  
✅ **Short-term Memory** - Maintains recent conversation context  
✅ **Long-term Memory** - Summarizes and stores conversation history  
✅ **Neural UI** - Beautiful 3D animated background with glassmorphism design  
✅ **Real-time Updates** - Live memory visualization  

## Tech Stack

- **Backend**: Node.js + TypeScript
- **AI**: OpenAI API (GPT models)
- **Frontend**: Vue 3 + Vanta.js (3D effects)
- **Styling**: TailwindCSS
- **Build**: Parcel

## Differences from Original

This MVP simplifies the original project by:

- ❌ **No Chromia Blockchain** - Uses in-memory storage instead
- ❌ **No Complex Database** - Simple JavaScript objects for memory
- ❌ **No Authentication** - Direct access
- ✅ **OpenAI API** - Instead of xAI (more accessible)
- ✅ **Simplified Architecture** - Easier to understand and modify

## Prerequisites

- Node.js (v18 or higher)
- npm or bun
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/gitmvp-com/ielts-tip-generator-mvp.git
cd ielts-tip-generator-mvp
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.sample .env
```

4. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=sk-your-api-key-here
```

## Usage

### Start the Agent (Backend)

```bash
npm run dev
# or
bun run dev
```

On first run, you'll be prompted to:
1. Enter an agent name (e.g., "IELTS Helper")
2. Enter an agent goal (e.g., "Help users prepare for IELTS exam")

The terminal will display a session URL like:
```
http://localhost:1234/?sessionId=abc-123-xyz
```

### Start the UI (Frontend)

In a separate terminal:

```bash
npm run ui
# or
bun run ui
```

Open the provided URL in your browser.

## How It Works

### Memory System

1. **Short-term Memory**: Stores the last 5 conversation messages
2. **Long-term Memory**: AI-generated summary of the entire conversation
3. **Activity Logs**: Records all AI interactions with timestamps

### Chat Commands

In the terminal chat:

- Type normally to chat with the AI
- `!history` - View memory contents
- `!exit` or `!quit` - End the conversation

### Architecture

```
┌─────────────────┐
│   Terminal UI   │  ← User interaction
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Agent (main.ts)│  ← Chat logic
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Memory Storage  │  ← In-memory data
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   OpenAI API    │  ← AI responses
└─────────────────┘

┌─────────────────┐
│   Web UI (Vue)  │  ← Real-time visualization
└─────────────────┘
```

## Project Structure

```
ielts-tip-generator-mvp/
├── agent/
│   ├── main.ts           # Main chat agent logic
│   ├── memory.ts         # Memory management
│   └── config.ts         # Configuration
├── ui/
│   ├── index.html        # UI entry point
│   ├── index.js          # Vue application
│   └── index.css         # Tailwind styles
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## Customization

### Change AI Model

Edit `agent/config.ts`:
```typescript
export const MODEL = "gpt-4-turbo-preview"; // or gpt-3.5-turbo
```

### Adjust Memory Limits

Edit `agent/memory.ts`:
```typescript
const MAX_SHORT_TERM_MEMORIES = 5; // Change this value
```

### Modify Agent Personality

Edit the system prompt in `agent/main.ts`

## Troubleshooting

### "Module not found" errors
Run `npm install` or `bun install` again

### UI doesn't connect
Make sure both `npm run dev` and `npm run ui` are running

### OpenAI errors
Check your API key in `.env` and ensure you have credits

## Contributing

This is an MVP. Feel free to fork and extend with:
- Persistent storage (SQLite, PostgreSQL)
- User authentication
- Multiple conversation sessions
- Voice input/output
- More advanced memory algorithms

## License

ISC

## Original Project

Based on: [filiksyos/IELTS-Tip-Generator](https://github.com/filiksyos/IELTS-Tip-Generator)
