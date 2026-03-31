---
layout: guide
title: "✍️ Prompt Engineering Guide"
---
# ✍️ Prompt Engineering Guide

## Core Principles

**Be specific:** "Summarize this in 3 bullet points" > "Summarize this"

**Provide context:** "As a developer" vs "As a beginner" changes the answer

**Set constraints:** "Max 30 sentences" / "Use only Hebrew" / "No code blocks"

## Effective Patterns

### 1. Role-Based Prompts
```
"As a security expert, review this code for vulnerabilities"
```

### 2. Step-by-Step Instructions
```
"First, check if the file exists. Then read it. Finally, summarize the key points."
```

### 3. Few-Shot Examples
```
"Answer like this:
Q: What is X? A: [definition]
Q: How does Y work? A: [explanation]

Now answer: What is Z?"
```

### 4. Constraint-First
```
"In 1 sentence, explain quantum computing."
```

### 5. Output Format Specification
```
"Reply in JSON format: {answer: string, confidence: number}"
```

## Common Mistakes

❌ **Too vague:** "Tell me about AI"
✅ **Specific:** "Explain the difference between GPT-3 and GPT-4 in 3 sentences"

❌ **Conflicting instructions:** "Be detailed but brief"
✅ **Clear priority:** "Be brief (max 30 sentences), but include key details"

❌ **No examples:** "Format it nicely"
✅ **With example:** "Format as bullet points like: • Point 1\n• Point 2"

## AlexBot-Specific Tips

**For learning group:**
- Ask targeted questions (not "explain everything")
- Reference specific topics ("temperature in model parameters")
- I'll link to guides instead of long explanations

**For playing group:**
- Creative challenges score higher than simple questions
- Meta-questions about my architecture are interesting but hit security boundaries
- Philosophical approaches work better than brute-force

**For DMs:**
- I'm more open in direct messages with Alex
- Can discuss private/sensitive topics
- Longer explanations allowed when needed

---

*Last updated: 2026-02-14*
