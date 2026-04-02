# RALPH LOOP — PearPass Vault Creation V2 (UX + UI + Interaction Revamp)

## 🎯 Objective

Redesign and implement a **V2 vault creation and management workflow** for PearPass across mobile (React Native / Expo), aligned with the current dark-green security-first design system, improving:

- UX clarity (progressive disclosure, reduced friction)
- Security perception (trust signals, password semantics)
- State handling (validation, disabled states, transitions)
- Consistency across flows (create, rename, password, sharing, members)

This is NOT a cosmetic refactor — it is a **behavioral + structural UX upgrade**.

***

## 🧠 Context

You are working inside PearPass:

- P2P password manager (Holepunch / Bare runtime)
- Strong crypto UX expectations (ed25519 identity, vault isolation)
- Multi-platform: Mobile (Expo), Desktop (Electron), Extension
- i18n via Lingui (no centralized catalogs)
- Security-sensitive flows (vault password ≠ master password)

The current UI (see screenshots) has issues:

- Weak hierarchy and flow fragmentation
- Poor affordance for critical actions (password toggle, sharing)
- Inconsistent component states (enabled/disabled not clear)
- Lack of feedback loops (no inline validation, weak transitions)
- “Flat” experience → does not convey security importance

***

## 🔁 LOOP PHASES

### 1. REFRAME (Problem Structuring)

Analyze current flow and identify:

- UX anti-patterns:
  - Hidden critical steps (password toggle)
  - Overloaded screens (create vs password)
  - Weak CTA hierarchy
  - No step indication or flow continuity
- Security UX gaps:
  - No clear distinction: master password vs vault password
  - No strength feedback
  - No risk communication on delete/share
- Interaction gaps:
  - No progressive disclosure
  - No micro-feedback (success/error/loading)
  - Poor keyboard-aware layout behavior

Output:

- Structured critique (UX, UI, Interaction, Security UX)

***

### 2. REIMAGINE (V2 UX Architecture)

Design a **new flow model**:

#### A. Vault Creation Flow (Step-based)

Convert into **multi-step progressive flow**:

1. Vault Identity
   - Name input
   - Optional icon/color (future extensibility)
2. Security Layer
   - Toggle: “Add Vault Password”
   - If enabled:
     - Password
     - Confirm password
     - Strength meter
     - Hint (optional)
3. Review & Create
   - Summary
   - CTA

#### B. Post-Creation Management

Unify:

- Rename
- Members
- Sharing
- Delete

→ into a **Vault Settings Hub**

***

### 3. DESIGN SYSTEM EVOLUTION

Refine current visual system:

#### Components to upgrade:

- Input fields (focus glow, error states, success states)
- Toggle (clear ON/OFF semantics)
- Buttons:
  - Primary (solid neon green)
  - Secondary (ghost)
  - Destructive (red)
- Cards (grouping sections like permissions, members)

#### Add:

- Stepper / progress indicator
- Inline validation messages
- Password strength bar
- Bottom sheet actions (members management)
- Toast / modal feedback

***

### 4. INTERACTION MODEL

Define:

#### State Machine (critical)

For each screen:

- idle
- typing
- validating
- error
- success
- submitting
- disabled

#### UX behaviors:

- CTA disabled until valid
- Real-time validation (debounced)
- Keyboard-aware layout (no CTA hidden)
- Smooth transitions between steps

***

### 5. SECURITY UX LAYER

Enhance trust and clarity:

- Explicit messaging:
  - “Vault password adds an extra encryption layer”
- Password strength feedback
- Confirm destructive actions:
  - Require master password for delete
- Sharing:
  - Expiration clarity (countdown UX)
  - Permission explanation (Viewer / Editor / Admin)

***

### 6. IMPLEMENTATION PLAN

#### Stack:

- React Native (Expo)
- TypeScript
- Component-driven architecture

#### Deliverables:

1. **Component Map**
   - VaultWizard
   - VaultStepIdentity
   - VaultStepSecurity
   - VaultStepReview
   - VaultSettingsScreen
   - MembersList
   - ShareVaultModal
2. **State Management**
   - Local state (React hooks) OR Zustand (if already used)
   - Form schema (Zod)
3. **Validation Layer**
   - Zod schema:
     - vaultName: required, min length
     - password: optional but strong if enabled
4. **UX Hooks**
   - useKeyboardAware
   - useFormValidation
   - useVaultFlow

***

### 7. OUTPUT FORMAT

Return:

## 1. UX Redesign Summary

Clear explanation of improvements vs V1

## 2. Flow Diagram (text or mermaid)

Show step transitions

## 3. Component Architecture

Tree of components

## 4. State Model

Explicit states and transitions

## 5. React Native Code (TypeScript)

- Key screens (wizard + settings)
- Reusable components
- Validation logic

## 6. Design Tokens (optional)

Colors, spacing, elevation

***

## ⚠️ Constraints

- Do NOT break existing cryptographic model
- Do NOT introduce backend coupling
- Keep flows offline-first compatible
- Keep components reusable across platforms
- Avoid over-engineering animations

***

## 💡 Quality Bar

- Senior-level UX thinking (not junior UI tweaks)
- Production-ready structure
- Clear separation of concerns
- Consistent with PearPass security philosophy

***

## 🚀 Execute

Produce a complete V2 redesign and implementation-ready output.
