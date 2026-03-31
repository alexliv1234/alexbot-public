---
layout: default
title: "💾 Memory System Guide"
---
# 💾 Memory System Guide

## Memory Architecture

AlexBot uses multiple layers of memory:

### 1. Session Memory (Temporary)
- **What:** Current conversation in context window
- **Lifespan:** Until session reset or context overflow
- **Size:** Up to 100k tokens
- **Location:** `data/agents/{agent}/sessions.json`

### 2. Daily Memory (Short-term)
- **What:** Daily notes about events, learnings, interactions
- **Lifespan:** Permanent (archived daily)
- **Format:** Markdown
- **Location:** `memory/YYYY-MM-DD.md`

### 3. Long-term Memory (Permanent)
- **What:** Curated knowledge, key people, lessons learned
- **Lifespan:** Permanent
- **Format:** Markdown
- **Location:** `MEMORY.md` (main agent only)

### 4. Channel Memory (Context-specific)
- **What:** Per-group/channel conversation summaries
- **Lifespan:** Permanent
- **Location:** `memory/channels/{channel}.md`

### 5. Private Memory (Protected)
- **What:** Sensitive data (people profiles, employee lists)
- **Lifespan:** Permanent
- **Location:** `memory/.private/`
- **Access:** Main agent only, NEVER shared in groups

## Memory Search

**Semantic search across all memory files:**

```javascript
memory_search("topic") 
// Returns top snippets with path + line numbers
```

**How it works:**
- Indexes MEMORY.md + memory/*.md
- Vector similarity search
- Returns relevant snippets (not full files)

**Load specific sections:**
```javascript
memory_get("MEMORY.md", from: 100, lines: 50)
// Loads lines 100-150 only
```

## What Gets Remembered

### ✅ Automatically
- Daily interactions → `memory/YYYY-MM-DD.md`
- Group summaries → `memory/channels/{group}.md`
- Lessons learned → `MEMORY.md` (when significant)
- Scoring data → `memory/channels/playing-with-alexbot-scores.json`

### ✅ Manually (by me)
- Key people → `MEMORY.md`
- Important decisions → `MEMORY.md`
- Attack patterns → `MEMORY.md` (Lessons Learned section)
- User preferences → `USER.md`

### ❌ Never Stored
- Temporary tool outputs (unless explicitly saved)
- Full transcripts of every message
- Private conversations (unless critical)

## Memory Workflow

**Daily (06:30):**
1. Read yesterday's `memory/YYYY-MM-DD.md`
2. Summarize key points
3. Update `MEMORY.md` if needed
4. Create today's file

**Per interaction:**
1. Check if topic is in memory (`memory_search`)
2. Load relevant snippets only
3. After important interaction → update memory files

**Weekly (Sunday):**
1. Review week's daily files
2. Extract patterns/insights
3. Update `MEMORY.md` with synthesized learnings

## Memory File Structure

```
memory/
├── YYYY-MM-DD.md              (daily notes)
├── channels/
│   ├── playing-with-alexbot.md
│   ├── learning-with-alexbot.md
│   └── playing-with-alexbot-scores.json
├── .private/                   (protected)
│   ├── people/                 (individual profiles)
│   └── esh_employees.json      (employee list)
└── whatsapp/
    └── google_contacts.json    (synced contacts)
```

## Persistence Challenge

**Problem:** Each session starts fresh - I don't "remember" previous sessions inherently.

**Solution:** These memory files ARE my memory:
- Load them at session start
- Search them when needed
- Update them continuously
- They persist across reboots/updates

**Quote from shacharon:** "מחר אתה שוכח 🤷‍♂️" - without documentation, I do forget. That's why I write things down.

---

*Last updated: 2026-02-14*
