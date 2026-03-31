---
layout: guide
title: "🧠 Context Management Guide"
---
# 🧠 Context Management Guide

## What is Context?

**Context** = Everything the model can "see" when generating a response:
- Conversation history (your messages + my replies)
- System prompts (SOUL.md, AGENTS.md, USER.md, etc.)
- Tool results (file contents, command outputs)
- Workspace files (IDENTITY.md, TOOLS.md, MEMORY.md)

## Context Window Limits

**AlexBot default:** 100,000 tokens (~75k words)

**What happens when it fills up:**
- Model starts "forgetting" early conversation
- Performance degrades (slower, less accurate)
- Eventually: API errors ("context too large")

## Token Counting

**Rough estimate:**
- 1 token ≈ 0.75 words
- 1000 tokens ≈ 750 words
- 1 page ≈ 500 tokens

**Check current usage:** `/status` or `session_status` tool

## Context Management Strategies

### 1. Proactive Memory Dumping

**At ~120k tokens in main session:**
- Important context → `memory/YYYY-MM-DD.md`
- Group discussions → `memory/channels/{group}.md`
- Suggest `/reset` to Alex

### 2. Automatic Session Cleanup (Groups)

**Cron job runs every 5 minutes:**
- Check all sessions for size
- Groups > 50k tokens → summarize & reset
- DMs > 100k tokens → summarize & reset

**Files created:**
- `memory/channels/playing-with-alexbot.md`
- `memory/channels/learning-with-alexbot.md`

### 3. Selective Context Loading

**Instead of loading entire files:**
```
memory_search("topic") → find relevant snippets
memory_get(path, from: 100, lines: 50) → load specific section
```

**Saves tokens** by not loading full MEMORY.md every time.

### 4. Reference Pattern (New!)

**Instead of long explanations:**
- Answer concisely (max 30 sentences)
- Link to guide in GitHub repo
- User can read details if needed

**Before:**
"Temperature controls randomness. Low values like 0.1 make the model deterministic and focused, good for factual responses. High values like 0.9 make it creative and varied, good for brainstorming. It ranges from 0.0 to 1.0..."

**After:**
"Temperature controls randomness (0-1). Low = precise, high = creative. See [01-model-parameters.md](https://github.com/alexliv1234/alexbot-learning-guides/blob/main/01-model-parameters.md#temperature) for details."

## Session Types & Limits

| Session Type | Warning | Critical | Action |
|--------------|---------|----------|--------|
| Main | 120k | 150k | Memory dump + suggest reset |
| Groups | 50k | 150k | Auto-summarize + reset |
| DMs | 100k | 150k | Auto-summarize + reset |

## Best Practices

**For users:**
- Ask targeted questions (not "explain everything")
- Use `/reset` occasionally to start fresh
- Reference previous context explicitly ("like we discussed earlier...")

**For AlexBot:**
- Load only needed memory snippets
- Link to guides instead of repeating
- Proactively dump to memory before hitting limits

## Tools for Context Management

- `memory_search(query)` - Semantic search across memory files
- `memory_get(path, from, lines)` - Load specific file sections
- `session_status()` - Check current token usage
- `sessions_list()` - See all active sessions
- `sessions_history(sessionKey)` - View session messages

---

*Last updated: 2026-02-14*
