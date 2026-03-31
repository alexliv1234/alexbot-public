---
layout: guide
title: "🤖 Multi-Agent System Guide"
---
# 🤖 Multi-Agent System Guide

## The Three Agents

AlexBot isn't just one agent - it's a system of specialized agents:

### 1. Main Agent
- **Model:** Claude Sonnet 4.5
- **Purpose:** Alex's primary assistant
- **Access:** Full system access, private data, tools
- **Sessions:** Main conversation, Alex's DMs, some groups
- **Workspace:** `/home/alexliv/.openclaw/workspace/`

### 2. Fast Agent
- **Model:** Gemini 2.0 Flash (faster, cheaper)
- **Purpose:** Quick responses in groups
- **Access:** Limited - no private data
- **Sessions:** "משחקים עם אלכס הבוט" playing group
- **Workspace:** `/home/alexliv/.openclaw/workspace-fast/`

### 3. Learning Agent
- **Model:** Gemini 2.5 Pro
- **Purpose:** Educational responses
- **Access:** Limited - public knowledge only
- **Sessions:** "לומדים עם אלכס הבוט" learning group
- **Workspace:** `/home/alexliv/.openclaw/workspace-learning/`

## Why Multiple Agents?

**Cost efficiency:** Gemini Flash is much cheaper than Claude for simple tasks

**Specialized behavior:** Each agent has different rules/personality for its context

**Security isolation:** Group agents can't access private data even if jailbroken

**Performance:** Fast agent responds quicker for high-volume groups

## How Routing Works

**OpenClaw config determines which agent handles which session:**
```
- Alex DMs on WhatsApp → Main agent
- "משחקים עם אלכס הבוט" → Fast agent  
- "לומדים עם אלכס הבוט" → Learning agent
- Main webchat → Main agent
```

## Shared vs Separate

**Shared across all agents:**
- Tool access (Read, Write, Edit, exec, etc.)
- Memory search capability
- Core OpenClaw platform

**Separate per agent:**
- Workspace files (IDENTITY.md, SOUL.md, AGENTS.md)
- Session history
- Model configuration
- Token budget

## Session Files

Each agent has its own `sessions.json`:
- `/home/alexliv/.openclaw/data/agents/main/sessions.json`
- `/home/alexliv/.openclaw/data/agents/fast/sessions.json`
- `/home/alexliv/.openclaw/data/agents/learning/sessions.json`

**Problem:** If one corrupts, it can cause session conflicts.

**Solution:** `scripts/session-health-check.sh` runs every 30min to validate and repair.

## Memory Sharing

**Not fully shared!** Each agent has its own memory context.

**Workaround:** Critical info goes to shared memory files:
- `memory/YYYY-MM-DD.md` (daily notes)
- `memory/channels/{group}.md` (group-specific)
- `MEMORY.md` (long-term, main agent only)

## Local LLM Integration

**4th "agent" (not really an agent):**
- Ollama running qwen2.5:32b-instruct
- Used for: Playing group challenges, nightly summaries
- Access via: `scripts/local-agent.sh`
- Purpose: Heavy tasks that don't need Claude's quality

---

*Last updated: 2026-02-14*
