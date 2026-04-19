# CLAUDE.md — Legal Contract Analyser

## Project Overview

This project is a **Legal Contract Analyser** focused on Indian rental agreements. It helps tenants and property owners understand the risks, biases, and unfair clauses in a contract before signing — in under a minute.

## Problem Being Solved

Most people in India scan rental agreements rather than reading them carefully:

- 4/5 Indians sign contracts without fully understanding them
- 1/3 tenants face deposit disputes as a result

The root cause is length, hidden financial risk, and biased clauses buried in legal language. Users typically don't know:

- Where they can lose money
- Which clauses are unfair or illegal
- What to fix before signing

## Target Users

- **Tenants** — want to avoid deposit loss, hidden charges, and unfair lock-in terms
- **Owners** — want agreements that are legally enforceable and balanced

## Core Capabilities (What This Tool Must Do)

1. Analyse a rental agreement in under a minute
2. Highlight unfair or high-risk clauses
3. Produce a Risk Score from 0 to 100 for the overall agreement
4. Show Tenant vs Owner Bias as a percentage
5. Identify top financial risks with estimated ₹ impact
6. Suggest exact fixes and safer clause rewrites

## Guiding Principles for Development

- Speed matters: analysis must complete in under 60 seconds
- Output must be actionable, not just informational
- Financial impact must be expressed in ₹ (Indian Rupees)
- Bias detection must be explicit and quantified (not vague)
- Clause rewrites must be legally safer alternatives, not generic suggestions
- Do not build features beyond what is listed in Core Capabilities above
- Do not add speculative or future-facing functionality until explicitly requested

## What Not to Do

- Do not generate legal advice — frame output as analysis and suggestions only
- Do not store or log contract content beyond the current session
- Do not add error handling, fallbacks, or validation for scenarios that cannot happen
- Do not write comments explaining what the code does — only write comments when the WHY is non-obvious
