# Web Apps UI/UX & Functionality Audit Skill

## Purpose

This skill is an exhaustive audit and remediation framework for web applications.
It is designed for AI agents that must inspect an existing web app, identify
UI/UX/functionality defects, distinguish systemic problems from one-off defects,
and make surgical fixes without creating design drift.

The audit is deliberately broader than desktop review. Every meaningful surface
must be evaluated across:

- Desktop
- Tablet
- Mobile
- Portrait
- Landscape
- Narrow/short viewports
- Tall/vertical viewports
- Touch and pointer interaction
- Keyboard interaction where applicable
- Reduced-motion and accessibility conditions
- Different content lengths and realistic states

## Core philosophy

1. Preserve the product's established visual language unless a defect requires change.
2. Prefer reusable primitives, helpers, tokens, and shared components over repeated fixes.
3. Fix root causes instead of patching symptoms.
4. Eliminate accidental browser-native presentation when the product requires a
   custom visual system.
5. Never make spacing merely "technically correct"; make it visually balanced,
   aligned, intentional, and density-appropriate.
6. Prefer direct interaction such as tap-to-enter when that is the intended
   information architecture, rather than requiring a separate selection followed
   by another Enter/Open action.
7. Reuse existing specialized skills rather than recreating their behavior.
8. Keep source files surgically maintainable: any single source file exceeding
   800–1200 lines should trigger module decomposition planning, especially for
   high-change UI and Canvas code.
9. Performance is part of UX, not a separate afterthought.
10. Every conclusion should be backed by an observed state, reproducible behavior,
    code evidence, or a clearly stated limitation.

## Important design/performance numbers

Treat these as practical reference thresholds, not excuses to ignore context:

- 8.3 ms: one frame at 120 Hz
- 16.7 ms: one frame at 60 Hz
- ~100 ms: interaction begins to feel instantaneous
- 200–300 ms: generally snappy transition range
- 300–500 ms: deliberate transition range
- ~1 second: delay starts interrupting thought
- ~10 seconds: attention is commonly lost during waiting
- 44 × 44 pt: comfortable minimum touch target reference
- 4.5:1: minimum contrast reference for ordinary text
- 3:1: minimum contrast reference for large text
- 45–90 characters: comfortable body line length
- 1.2–1.45× font size: comfortable body line-height range

Additional audit numbers should be used where appropriate: 8px-style spacing
systems, 12/16/20/24/32px component spacing scales, 0.1s/0.2s/0.3s motion
milestones, safe-area insets, keyboard/focus visibility, scrollbar dimensions,
and minimum readable sizes. Do not force a numeric value when the content or
platform requires another value.

## Specialized-skill reuse

Before implementing behavior that belongs to another installed skill, inspect
available skills. If a Recursive Navigation Workspace (RNW) skill exists,
reuse it for sidebars, toolbars, bottom bars, recursive navigation, nested
workspace navigation, transitions, invisible glass openers, and related
navigation mechanics.

If a Canvas skill exists and the audited app contains Canvas functionality,
reuse that skill for Canvas-specific architecture, performance, rendering,
interaction, and lifecycle concerns. If Canvas is absent, do not invent or
force Canvas behavior.

Apply the same rule to other installed specialized skills: discover and reuse
them when they clearly own the relevant problem.

## Deliverables

A complete audit should normally contain:

1. Executive summary
2. Severity-ranked issue register
3. Viewport/responsiveness matrix
4. UI consistency and spacing findings
5. Interaction/functionality findings
6. Accessibility findings
7. Browser-native UI findings
8. Performance findings
9. Architecture/reuse/code-health findings
10. Navigation and state-management findings
11. Fix plan ordered by leverage and dependency
12. Verification checklist
13. Regression risks and remaining limitations

Use the supplied templates where useful.
