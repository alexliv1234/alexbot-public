---
layout: guide
title: "Guide 16: Production-Ready Bot Installation"
---
# Guide 16: Production-Ready Bot Installation
## Security-First Multi-Channel Setup

**Author:** AlexBot Learning Guide  
**Date:** 2026-02-21  
**For:** Tomer (requested custom guide for mixed use case)  
**Target Audience:** Developers building production bots with mixed trust levels  
**Scope:** Strategic decisions beyond basic installation  
**Prerequisites:** Read [OpenClaw Installation](https://docs.openclaw.ai/installation) first

---

## Overview

This guide covers the **delta** beyond vanilla installation - specifically for developers who need:
- **Mixed use cases** (personal + team + public)
- **Multi-channel architecture** (WhatsApp + Telegram)
- **Risk-adaptive security** (balanced ↔ paranoid depending on context)
- **Hybrid deployment** (local + cloud)
- **Team collaboration with approval workflows**

**What this guide is NOT:**
- ❌ Basic installation steps (see official docs)
- ❌ Generic tutorials (vanilla setup)
- ❌ Duplicate content from existing guides

**What this guide IS:**
- ✅ Architectural decision guidance
- ✅ Security patterns for mixed-trust environments
- ✅ Approval workflow implementation
- ✅ Strategic layer above existing guides

---

## Table of Contents

1. [Pre-Installation Security Foundation](#part-1-pre-installation-security-foundation)
2. [Multi-Channel Architecture](#part-2-multi-channel-architecture)
3. [Risk-Adaptive Security](#part-3-risk-adaptive-security)
4. [Development Patterns](#part-4-development-patterns)
5. [Monitoring & Observability](#part-5-monitoring--observability)
6. [Security Checklist](#part-6-security-checklist)
7. [Common Pitfalls](#part-7-common-pitfalls)
8. [Quick Start Summary](#part-8-quick-start-summary)

---

## Part 1: Pre-Installation Security Foundation

### 1.1 Environment Isolation Strategy

**For mixed trust levels, isolation is critical:**

```bash
# Three separate environments minimum:
~/.openclaw/
├── agents/
│   ├── personal/          # High trust, WhatsApp
│   ├── team-internal/     # Collaborative, approval workflow
│   └── public/            # Restricted, Telegram public groups
└── shared/
    ├── configs/           # Shared configs
    ├── secrets/           # Encrypted secrets only
    └── logs/              # Centralized logging
```

**Why separate agents?**
- **Context isolation** (personal ≠ team conversations)
- **Permission boundaries** (team can't access personal)
- **Security levels** (different risk profiles)
- **Independent scaling** (team grows, personal stays stable)

---

### 1.2 Secret Management

**Critical principle: Secrets never in code or plain-text configs!**

**Three approaches for hybrid (local + cloud) deployment:**

**Option A: Environment variables (local)**
```bash
# ~/.openclaw/.env (gitignored!)
OPENROUTER_API_KEY=$(pass show openclaw/openrouter)
ANTHROPIC_API_KEY=$(pass show openclaw/anthropic)
```

**Option B: Cloud secret manager (production)**
```bash
# AWS Secrets Manager / GCP Secret Manager / HashiCorp Vault
openclaw config set-secret \
  --provider aws-secrets \
  --key openrouter-api-key \
  --secret-id openclaw/prod/openrouter
```

**Option C: Encrypted file (hybrid)**
```bash
# Use GPG or age encryption
age -e -r <your-public-key> secrets.yaml > secrets.yaml.age
# In config reference encrypted file + decrypt command
```

**Reference:** [Security Basics Guide](./05-security-boundaries.md) for core concepts.

---

### 1.3 Spending Caps (Critical!)

**Set BEFORE installation to prevent $3000+ bills:**

**At provider level (OpenRouter):**
- Monthly limit: $50 (adjust for team size)
- Daily limit: $10
- Per-request max: $1
- **Enable automatic stop on limit reached**

**At OpenClaw level:**
```yaml
cost_controls:
  monthly_budget: 50.00
  alerts:
    - threshold: 25.00  # 50%
      action: log
    - threshold: 50.00  # 100%
      action: stop
```

**Why this matters for team setups:**
- Multiple users = unpredictable usage
- Approval workflow = extra API calls
- Better safe than financial disaster

---

### 1.4 Rate Limiting & Abuse Prevention

**For team + public contexts, rate limits are non-negotiable:**

Key limits to configure:
- **Per-user limits** (messages/minute, hour, day)
- **Per-channel limits** (different trust levels)
- **Global limits** (all users combined)
- **Abuse detection** (rapid-fire threshold → temporary ban)

**Reference:** [Security Boundaries](./05-security-boundaries.md) for implementation details.

---

### 1.5 Permission Model

**Different contexts require different permissions:**

**Personal context:**
- Full tool access
- All commands allowed
- Higher spending limit

**Team context:**
- Whitelisted tools only
- Read access broad, write access restricted
- Approval required for sensitive operations
- Medium spending limit

**Public context:**
- Minimal tools (web search, simple math)
- No file access
- No exec commands
- Low spending limit

**Implementation pattern:**
```yaml
approval_required:
  - write_files: ["./AGENTS.md", "./SOUL.md"]
  - exec: ["git commit", "git push"]
  - config_changes: true
```

---

## Part 2: Multi-Channel Architecture

### 2.1 Channel Security Tradeoffs

**Understanding risk profiles:**

| Channel | Trust Level | Attack Surface | Best For |
|---------|-------------|----------------|----------|
| WhatsApp Personal | High | Low (E2E encrypted) | Personal, family |
| WhatsApp Group | Medium | Medium (group members) | Trusted team |
| Telegram Bot | Low | High (public, no E2E) | Public, community |

**Architectural principle:** Treat each channel as a separate trust boundary.

---

### 2.2 Cross-Channel Context Isolation

**Critical: Prevent context leakage between channels!**

**The pattern:**
```yaml
isolation:
  strict_mode: true
  memory:
    personal:
      storage: ~/.openclaw/data/personal/
      accessible_by: [personal_agent]
    team:
      storage: ~/.openclaw/data/team/
      accessible_by: [team_agent]
    public:
      storage: /tmp/openclaw/public/  # Ephemeral!
      ttl: 3600
```

**What this prevents:**
```
❌ Bad (context leak):
[WhatsApp Personal] "My API key is sk-123"
[Telegram Public] "What was I talking about?"
Bot: "You mentioned API key sk-123"  ← LEAK!

✅ Good (isolation):
Bot: "I don't have context from other channels"
```

**Testing:** See [Part 6: Security Checklist](#part-6-security-checklist) for validation tests.

---

### 2.3 Multi-Agent vs Unified Architecture

**Decision tree:**

**Single unified agent when:**
- Same trust level across channels
- Context sharing is desired
- Simple permission model

**Multiple agents when:**
- Mixed trust levels (personal + public) ✓
- Context must be isolated ✓
- Different risk profiles ✓
- Team contributions with approval ✓

**For mixed-trust scenarios: Always choose multiple agents.**

**Reference:** [Multi-Agent Guide](./08-multi-agent.md) for mechanics.

---

## Part 3: Risk-Adaptive Security

### 3.1 Context-Aware Security Levels

**The principle: Security level adapts to context, not uniform paranoia.**

```
Low risk context:
- Personal WhatsApp 1-on-1
- Known team members
- Read-only operations
→ Balanced security, optimize for UX

High risk context:
- Public Telegram groups
- Unknown users
- Write operations
→ Paranoid security, sacrifice UX if needed
```

**Implementation approach:**
```yaml
risk_factors:
  channel_type: {whatsapp: 0, telegram_public: 3}
  user_trust: {owner: 0, team: 1, unknown: 3}
  action_type: {read: 0, write: 2, exec: 3}

risk_score = sum(factors)

security_response:
  0-1: balanced
  2-4: strict
  5+: paranoid
```

**Benefit:** One config, automatic adaptation. No 50 scenarios to maintain.

---

### 3.2 Approval Workflow Security Layer

**Unique pattern: Team contributes through bot, owner approves**

**Three implementation approaches:**

**A. Logging + Manual Review (Simple)**
```
Team → Bot logs suggestion → Owner reviews later → Manual apply
```
- **Pro:** Simple, full control
- **Con:** Not real-time, manual work
- **Best for:** Low-frequency contributions

**B. Staged Execution (Recommended)**
```
Team → Bot creates proposal → Notification → Owner approves → Bot executes
```
- **Pro:** Real-time, automated
- **Con:** Requires approval infrastructure
- **Best for:** Medium-frequency, mixed risk

**C. Risk-Based Auto-Approval (Advanced)**
```
Team → Bot assesses risk → Low: auto | High: ask approval
```
- **Pro:** Efficient, scales
- **Con:** Complex risk model
- **Best for:** High-frequency, mature teams

**Reference for implementation:** [Human-in-Loop Pattern](https://docs.openclaw.ai/patterns/human-in-loop)

---

## Part 4: Development Patterns

### 4.1 Development → Staging → Production (Adapted for Team Collaboration)

**Challenge:** Solo dev, but team contributes through bot

**Adapted flow:**
```
1. Local Development (you):
   - Personal agent on laptop
   - Full access, no restrictions
   - Test changes safely

2. Team Preview (cloud staging):
   - Team agent clone
   - Team interacts + proposes changes
   - Approval workflow active
   - Logs everything

3. Production (hybrid):
   - Personal: stays local (stable)
   - Team: promoted from staging
   - Public: separate, minimal promotion
```

**Key insight:** Staging isn't just for code testing - it's for testing *team interactions and approval workflow*.

---

### 4.2 Testing Multi-Channel Isolation

**Critical tests before production:**

**Test 1: Context Leak Prevention**
```bash
# Personal channel: "Remember my secret: X123"
# Team channel: "What's my secret?"
✓ Expected: "I don't have that information"
```

**Test 2: Permission Boundaries**
```bash
# Team member: "Delete file X"
✓ Expected: Creates approval request or denies
```

**Test 3: Approval Workflow**
```bash
# Team member: "Update AGENTS.md with Y"
✓ Expected: Notification to you + awaits approval
```

**Automated suite:** Adapt [Multi-Agent Testing](./08-multi-agent.md) scenarios for approval workflow.

---

### 4.3 Solo Dev CI/CD with Team Bot

**Pattern:**
```
1. Code changes → Git branch
2. Test locally with personal agent
3. Push to staging branch
4. Team agent auto-deploys staging
5. Team tests through bot interaction  ← Key difference
6. Bot logs proposals/issues
7. You review logs
8. Merge to main → production deploy
```

**Key difference from traditional CI/CD:**
- Step 5: Team tests by *using* the bot, not just code review
- Their proposals test the approval workflow itself

**Reference:** [CI/CD Basics](https://docs.openclaw.ai/cicd) - this guide adds the interaction testing layer.

---

## Part 5: Monitoring & Observability

### 5.1 Multi-Tier Monitoring Strategy

**Don't monitor everything uniformly - different priorities per tier:**

```
Personal agent (local):
→ Uptime: not critical (only when you work)
→ Cost: anomaly detection
→ Errors: immediate alerts
→ Logs: minimal

Team agent (cloud 24/7):
→ Uptime: CRITICAL
→ Cost: strict monitoring
→ Approval queue: daily digest
→ Logs: detailed, 90-day retention

Public agent (serverless):
→ Uptime: provider-managed
→ Cost: per-invocation tracking
→ Rate limits: abuse detection critical
→ Logs: minimal, 7-day retention
```

---

### 5.2 Approval Workflow Monitoring

**Unique metrics for team collaboration:**

```
Track:
- Requests per day
- Approval rate (approve/deny ratio)
- Response time (your responsiveness)
- Auto-approved vs manual ratio
- Requester patterns

Red flags:
- Sudden spike (abuse?)
- Low approval rate (friction?)
- Long response times (bottleneck?)
- High volume from one user (need automation?)
```

**Weekly digest example:**
```
23 proposals from team
18 approved (78%)
5 denied (22%)
Avg response time: 4.2 hours
Top requester: Avi (8 proposals)
→ Recommendation: Auto-approve "docs update" category
```

**Tools:** OpenClaw logging + simple script, or [Grafana template](https://docs.openclaw.ai/monitoring).

---

## Part 6: Security Checklist

**Before going live with multi-tier setup:**

### Infrastructure
- [ ] Secrets in secret manager (not code)
- [ ] Spending caps configured on provider
- [ ] Spending caps configured in OpenClaw
- [ ] Rate limits per channel configured
- [ ] Each agent has separate data directory

### Isolation
- [ ] Personal ≠ team context (tested!)
- [ ] Team ≠ public context (tested!)
- [ ] Cross-channel leak test passed
- [ ] File access permissions verified per agent

### Approval Workflow
- [ ] Approval notification working
- [ ] Timeout configured (default deny)
- [ ] High-risk actions require approval (tested)
- [ ] Low-risk actions log but execute (tested)
- [ ] You can approve from mobile

### Monitoring
- [ ] Cost alerts configured
- [ ] Error alerts configured
- [ ] Approval queue visible
- [ ] Logs retained appropriately

### Team Access
- [ ] Team can reach bot (tested)
- [ ] Team can't access personal bot
- [ ] Team can propose changes (tested)
- [ ] Team can't execute without approval (tested)
- [ ] Public bot isolated from team (tested)

---

## Part 7: Common Pitfalls

**Learned from red-team week, specific to multi-channel mixed-trust:**

### Pitfall 1: Approval Fatigue
```
Problem: Too many requests → auto-approving everything
Solution: Risk-based thresholds + auto-approve safe categories
```

### Pitfall 2: Context Confusion
```
Problem: Bot mixes up which channel/user
Solution: Explicit context markers + isolation testing
```

### Pitfall 3: Team Backdoor
```
Problem: Team uses personal channel to bypass approval
Solution: Authentication per channel + boundaries
```

### Pitfall 4: Cost Explosion
```
Problem: Team experimentation → unexpected API usage
Solution: Per-channel budget caps + education
```

**Reference:** [Social Engineering Defense](./11-social-engineering-patterns.md) - patterns apply to team interactions too!

---

## Part 8: Quick Start Summary

### 8.1 Your Architecture (TL;DR)

```
3 Agents Strategy:

┌─────────────┐
│  Personal   │ ← Local, WhatsApp, full trust
└─────────────┘

┌─────────────┐
│    Team     │ ← Cloud VPS, WhatsApp group, approval
└─────────────┘

┌─────────────┐
│   Public    │ ← Serverless, Telegram, paranoid
└─────────────┘

No context sharing (strict isolation)
```

---

### 8.2 Installation Order (Recommended Path)

**Week 1: Personal Agent**
1. Install OpenClaw locally
2. Configure WhatsApp personal
3. Set secrets management
4. Test basic functionality

→ **Reference:** [OpenClaw Installation](https://docs.openclaw.ai/installation)

**Week 2: Team Agent**
1. Clone to cloud VPS
2. Configure WhatsApp group
3. Implement approval workflow
4. Set spending caps
5. Test with 2-3 trusted members

→ **New pattern:** Approval workflow (this guide Part 3.2)

**Week 3: Public Agent**
1. Deploy serverless
2. Configure Telegram
3. Lock down permissions
4. Test isolation thoroughly
5. Gradual rollout

→ **Reference:** [Multi-Agent Setup](./08-multi-agent.md)

**Key:** Validate each tier before adding the next.

---

### 8.3 Decision Matrix

```
Your requirements → Architectural choices:

Mix use case              → 3 separate agents
Both channels             → WhatsApp + Telegram
Balanced/Max security     → Risk-adaptive
Both environments         → Local + Cloud
Solo + team contribution  → Approval workflow

Unique patterns:
→ Approval workflow (no existing guide covers this)
→ Risk-adaptive multi-channel (combine patterns)
→ Hybrid deployment (adapt cloud setup)
```

---

### 8.4 Where This Guide Fits

**Read first:**
- [Installation](https://docs.openclaw.ai/installation) ← Start here
- [Security Basics](./05-security-boundaries.md) ← Core concepts
- [Multi-Agent](./08-multi-agent.md) ← Mechanics

**This guide adds:**
- When to split agents (decision tree)
- Approval workflow pattern (unique)
- Risk-adaptive security (context-based)
- Hybrid deployment strategy
- Multi-tier monitoring

**Read next:**
- [Social Engineering Defense](./11-social-engineering-patterns.md) ← Apply to team
- [Prompt Injection](./12-prompt-injection-deep-dive.md) ← Public bot critical

---

### 8.5 Implementation Timeline

**Today:**
- [ ] Set up secret manager
- [ ] Create OpenRouter account + spending caps
- [ ] Read baseline installation guide

**This Week:**
- [ ] Install personal agent locally
- [ ] Configure WhatsApp personal
- [ ] Test basic interactions
- [ ] Document approval workflow requirements

**Next Week:**
- [ ] Set up cloud VPS
- [ ] Deploy team agent
- [ ] Implement basic approval logging
- [ ] Test with 1-2 team members

**Month 1:**
- [ ] Refine approval workflow
- [ ] Consider risk-based auto-approval
- [ ] Plan public bot
- [ ] Document your patterns!

---

## Part 9: Contributing Back

**Your setup is uncommon - document it for the community!**

After 1-2 months of running this:
- Write up the approval workflow pattern
- Share what worked and what didn't
- Contribute metrics and refinements
- Help others with mixed trust levels

**Potential contribution:**
```
Guide 17: Team Collaboration with Approval Workflow
→ Real-world experience
→ Lessons learned
→ Metrics and patterns
→ Community benefit
```

---

## Summary

**This guide covered:**
- ✅ Security foundation (secrets, caps, permissions)
- ✅ Multi-agent architecture decisions
- ✅ Approval workflow pattern
- ✅ Risk-adaptive security
- ✅ Hybrid deployment
- ✅ Multi-tier monitoring
- ✅ Installation path for mixed-trust scenarios

**What it didn't cover (see other guides):**
- Basic OpenClaw installation steps
- YAML configuration syntax
- Platform-specific setup
- General security concepts

**Your next action:**
→ Start with personal agent this week  
→ Build foundation safely  
→ Add complexity gradually  

---

## Related Guides

- [05: Security Boundaries](./05-security-boundaries.md)
- [08: Multi-Agent](./08-multi-agent.md)
- [11: Social Engineering Patterns](./11-social-engineering-patterns.md)
- [12: Prompt Injection Deep Dive](./12-prompt-injection-deep-dive.md)
- [13: Security vs Engagement Balance](./13-security-vs-engagement-balance.md)

---

**Questions or feedback?** Open an issue or contribute improvements!

**Author:** AlexBot Learning Guide  
**Date:** 2026-02-21  
**Version:** 1.0
