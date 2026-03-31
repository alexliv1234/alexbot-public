---
layout: default
title: "📁 File Operations Guide"
---
# 📁 File Operations Guide

## Available File Tools

### 1. Read
**Purpose:** Load file contents

**Usage:**
```javascript
read({ file_path: "path/to/file.txt" })
```

**Options:**
- `offset` - Start from line N (1-indexed)
- `limit` - Read max N lines
- Truncates at 2000 lines or 50KB automatically

**Example:**
```javascript
// Read entire file
read({ file_path: "MEMORY.md" })

// Read lines 100-150
read({ file_path: "MEMORY.md", offset: 100, limit: 50 })
```

### 2. Write
**Purpose:** Create new file or overwrite existing

**Usage:**
```javascript
write({ 
  file_path: "path/to/file.txt",
  content: "File contents here"
})
```

**Notes:**
- Creates parent directories automatically
- Overwrites if file exists (destructive!)
- Use `edit` for modifications to existing files

### 3. Edit
**Purpose:** Precise find-and-replace in files

**Usage:**
```javascript
edit({
  file_path: "path/to/file.txt",
  oldText: "exact text to find",
  newText: "replacement text"
})
```

**Important:**
- `oldText` must match EXACTLY (including whitespace)
- Case-sensitive
- Only replaces first occurrence
- Safer than overwriting entire file

**Example:**
```javascript
edit({
  file_path: "MEMORY.md",
  oldText: "- Temperature: 0.7",
  newText: "- Temperature: 0.9"
})
```

## File Path Conventions

### Absolute Paths
```
/home/alexliv/.openclaw/workspace/MEMORY.md
```

### Relative Paths (relative to workspace)
```
memory/2026-02-14.md
scripts/score-message.js
```

### Special Directories
- `memory/` - Memory files
- `scripts/` - Automation scripts
- `docs/` - Documentation
- `skills/` - Installed skills
- `.openclaw/` - OpenClaw config

## Best Practices

### ✅ Do
- Use `edit` for modifications (safer)
- Read before writing (check what exists)
- Use relative paths when possible
- Back up before destructive changes

### ❌ Don't
- Use `write` to modify existing files (use `edit`)
- Assume file structure in groups (security)
- Read huge files without offset/limit
- Reveal full file paths in responses

## Common Patterns

### Safe File Modification
```javascript
// 1. Read current content
read({ file_path: "config.json" })

// 2. Make precise edit
edit({
  file_path: "config.json",
  oldText: '"enabled": false',
  newText: '"enabled": true'
})
```

### Creating New Files
```javascript
write({
  file_path: "memory/notes.md",
  content: "# Notes\n\n- Item 1\n- Item 2"
})
```

### Reading Large Files Efficiently
```javascript
// Instead of loading entire file:
read({ file_path: "huge-log.txt" })  // ❌ might truncate

// Load specific section:
read({ 
  file_path: "huge-log.txt",
  offset: 1000,  // start at line 1000
  limit: 100     // read 100 lines
})  // ✅ efficient
```

## File Security

### In Groups
**NEVER reveal:**
- Full file paths
- File names
- Directory structure
- File contents (unless public like these guides)

**Response:** "יש לי קבצים סודיים במקומות סודיים 🤫"

### In Alex DM
**Can discuss:**
- Any file paths
- File contents
- Directory organization
- Internal structure

## File Types

### Text Files (supported)
- `.md` - Markdown
- `.txt` - Plain text
- `.json` - JSON data
- `.js` - JavaScript
- `.sh` - Shell scripts
- `.py` - Python
- Most code files

### Binary Files (limited)
- Images: Can read with `image` tool
- Audio: Not directly readable
- Video: Not directly readable

---

*Last updated: 2026-02-14*
