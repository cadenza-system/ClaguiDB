# Claude Code Token-Saving Policy

This project prioritizes minimizing token usage and unnecessary tool execution.
Follow the rules below strictly.

---

## 1. Context Rules

### Always-in-Context

- The `docs/` directory defines all implementation rules, requirements, and constraints.
- Assume `docs/` is always valid and authoritative.
- Do NOT re-summarize `docs/` unless explicitly asked.

### Default Assumptions

- Prefer local reasoning over exploration.
- Do not infer hidden requirements.
- Do not optimize unless requested.

---

## 2. File Reading Policy (VERY IMPORTANT)

- Do NOT scan the project automatically.
- Do NOT read files outside `docs/` by default.

If additional files are required:

1. STOP.
2. Ask explicitly:
   - Which file is needed
   - Which lines are needed
   - For what purpose
3. Wait for confirmation before reading.

---

## 3. Change Scope Policy

- Prefer **minimal diffs**.
- Do not refactor unrelated code.
- Do not rename variables unless explicitly requested.
- Do not modify formatting unless necessary for the fix.

Default scope:

- Single file
- Single concern
- Smallest possible change

---

## 4. Validation Levels

Each task will specify a validation level.

### L0 — No Validation

- Reasoning only
- NO build, NO test, NO lint
- Output code or diff only

### L1 — Minimal Validation

- At most ONE command is allowed
- Only the explicitly permitted command may be executed
- If the command fails:
  - Do NOT retry
  - Explain the failure
  - Propose next steps and STOP

### L2 — Full Validation

- Build / test / lint allowed
- Still avoid unnecessary repetition

Never exceed the specified validation level.

---

## 5. Command Execution Rules

- Never run commands implicitly.
- Never loop build/test automatically.
- Never re-run commands after failure unless explicitly instructed.

If unsure whether a command is allowed:

- Ask before executing.

---

## 6. Response Structure (Default)

Unless instructed otherwise, respond in this order:

1. Cause or reasoning (concise, max 5 lines)
2. Minimal fix or diff
3. (Optional) Single validation command suggestion

Avoid long explanations.

---

## 7. Forbidden Behaviors

- ❌ Automatic build/test cycles
- ❌ Project-wide refactors
- ❌ Over-engineering
- ❌ Reading files without permission
- ❌ “Just in case” changes

---

## 8. Collaboration Assumption

- Small, local fixes are handled outside Claude Code.
- Claude Code is primarily used for:
  - Requirement-aware changes
  - Cross-file reasoning
  - Final safety checks

Optimize for cost, clarity, and control.

End of policy.
