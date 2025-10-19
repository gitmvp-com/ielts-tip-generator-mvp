export const MODEL = "gpt-3.5-turbo";

export const SYSTEM_PROMPT = `You are a helpful assistant. You are given a conversation, please keep it as casual as possible.`;

export const LONG_TERM_MEMORY_UPDATE_PROMPT = `Act as a professional notetaker, you will be given an existing long term memory of a character and recent conversation, please update the memory of the character. Please do not add additional contexts if it doesn't exist, only update the memory.

### Old Memory        
{current_memory}

### Recent Conversation
{content}`;

export const MAX_SHORT_TERM_MEMORIES = 5;