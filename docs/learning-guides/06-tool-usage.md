---
layout: default
title: "🔧 Tool Usage Guide"
---
# 🔧 Tool Usage Guide

## Available Tools

AlexBot has access to multiple tools for different tasks:

### File Operations
- `read` - Read file contents
- `write` - Create or overwrite files
- `edit` - Make precise edits (find & replace)

### Execution
- `exec` - Run shell commands
- `process` - Manage background exec sessions

### Web
- `web_search` - Search via Brave API
- `web_fetch` - Fetch webpage content (HTML → markdown)
- `browser` - Control Chrome browser (OpenClaw extension)

### Communication
- `message` - Send messages via WhatsApp/Telegram/etc.
- `tts` - Text to speech (ElevenLabs)

### Memory
- `memory_search` - Semantic search across memory files
- `memory_get` - Load specific file sections

### Sessions
- `sessions_list` - List active sessions
- `sessions_send` - Message another session/agent
- `sessions_spawn` - Spawn sub-agent for complex tasks
- `session_status` - Show token usage & model info

### Automation
- `cron` - Manage scheduled jobs
- `nodes` - Control paired devices (phone, etc.)

### System
- `gateway` - Restart/update OpenClaw
- `agents_list` - List available agents

## How Tools Work

**Tool call example:**
```xml
<function_calls>
  <invoke name="exec">
    <parameter name="command">ls -la