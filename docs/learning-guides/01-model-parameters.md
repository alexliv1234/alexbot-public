---
layout: guide
title: "🎛️ Model Parameters Guide"
---
# 🎛️ Model Parameters Guide

## Temperature

**What it is:** Controls randomness in model responses (0.0 to 1.0)

**Scale:**
- **0.0-0.3**: Deterministic, focused, precise (good for code, facts)
- **0.4-0.7**: Balanced creativity and consistency (default range)
- **0.8-1.0**: Creative, varied, less predictable (good for brainstorming)

**Example:**
- Temperature 0.1: "The capital of France is Paris."
- Temperature 0.9: "Ah, France! The capital would be Paris, that beautiful city of lights and romance."

## Max Tokens

**What it is:** Maximum length of the response

**Typical values:**
- 150 tokens ≈ 1 paragraph
- 500 tokens ≈ 1 page
- 2000 tokens ≈ multiple pages

**Note:** Tokens ≠ words. ~1.3 tokens per word on average.

## Top-P (Nucleus Sampling)

**What it is:** Alternative to temperature - considers only top X% probability tokens

**Values:**
- 1.0 = consider all tokens (default)
- 0.9 = consider top 90% probability mass
- 0.5 = only most likely tokens

**Tip:** Use temperature OR top-p, not both aggressively.

## Context Window

**What it is:** How much conversation history the model can "see"

**AlexBot default:** 100k tokens (~75k words)

**When it fills up:**
- Main session: Proactive memory dump at ~120k
- Groups: Auto-reset when > 50k tokens (for DMs: 100k)

## Stop Sequences

**What it is:** Strings that tell the model to stop generating

**Example:** If stop sequence is "---", model stops when it reaches that.

**AlexBot usage:** NO_REPLY, HEARTBEAT_OK are special stop-like signals.

---

*Last updated: 2026-02-14*
