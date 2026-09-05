# SKILL.md — Web Apps UI/UX & Functionality Audit

## 0. Mission

Perform a complete, evidence-driven UI/UX and functionality audit of a web
application. Inspect both what the user sees and what the implementation does.

The goal is not to produce a generic design critique. The goal is to discover
every meaningful defect, trace defects to root causes, prioritize them, and
perform surgical fixes that improve the whole system rather than introducing
isolated patches.

Audit all relevant dimensions:

- visual design
- layout
- spacing
- alignment
- typography
- responsive behavior
- mobile/tablet/desktop behavior
- portrait/landscape/vertical behavior
- touch interaction
- pointer interaction
- keyboard interaction
- focus states
- accessibility
- browser-native controls and surfaces
- interaction latency
- transitions
- loading/empty/error/success states
- navigation
- state persistence
- data integrity
- duplicated UI
- duplicated functionality
- duplicated code
- helper/component reuse
- file/module size
- Canvas behavior when present
- performance
- maintainability
- regression risk

Do not stop after finding obvious visual problems.

---

# 1. First-pass reconnaissance

Before changing code:

1. Identify the app's framework/build system.
2. Map entry points and major routes/views.
3. Identify global CSS, theme tokens, typography, component primitives,
   navigation primitives, modal/dialog systems, notification systems, and
   state-management utilities.
4. Inventory large source files.
5. Search for repeated UI patterns.
6. Search for repeated event handlers and near-duplicate helpers.
7. Identify browser-native controls and browser-default styling.
8. Identify responsive breakpoints and fixed-position surfaces.
9. Identify sidebars, toolbars, bottom bars, drawers, overlays, popovers,
   recursive navigation, and Canvas surfaces.
10. Discover installed skills before implementing specialized behavior.

If a specialized installed skill owns an area, use that skill's conventions
instead of creating a competing implementation.

## RNW rule

If Recursive Navigation Workspace is available and the app has recursive
navigation/workspace behavior, use it as the authority for:

- nested navigation
- sidebars
- toolbars
- bottom navigation/workspaces
- navigation transitions
- invisible glass openers
- recursive panels
- drill-in/drill-out behavior
- related spatial navigation mechanics

Do not recreate an alternative navigation system merely because a local
implementation is easier.

## Canvas rule

If Canvas exists in the app and an installed Canvas skill exists, use it.
Audit and fix Canvas according to that skill.

If Canvas does not exist, do not add Canvas merely because the audit framework
mentions it.

---

# 2. Establish the visual system before judging it

Extract the existing design language:

- colors
- semantic colors
- backgrounds
- surfaces
- borders
- radii
- shadows
- typography
- icon sizes
- icon stroke/fill treatment
- spacing scale
- control heights
- touch target sizes
- z-index layers
- motion durations
- easing
- focus treatment
- selection treatment
- disabled treatment
- loading treatment
- notification treatment

Then determine whether the system is internally coherent.

Do not normalize every application toward a generic design system. Preserve
product-specific identity while enforcing consistency and usability.

---

# 3. Browser-native UI elimination

Inspect every browser-native presentation that is visible to the user.

Potential targets include:

- default buttons
- default checkboxes
- default radio buttons
- default selects
- default range controls
- default file inputs
- default search decorations
- browser-native validation bubbles where controllable
- default focus rings when the product requires a custom accessible equivalent
- default text selection
- default tap highlight
- default appearance of form controls
- native-looking scrollbars where a custom theme is required
- unthemed dialogs/menus/tooltips where the product owns the UI

The objective is not to break semantics or accessibility.

Use semantic HTML where it is appropriate, but visually style the interaction
to the site's design system. Never replace a semantic control with a visually
custom element that loses keyboard, focus, labeling, or accessibility behavior
without implementing the equivalent behavior.

For touch devices, explicitly consider:

    -webkit-tap-highlight-color: transparent;

Use a site-specific selected-text treatment rather than an accidental browser
selection color where the product requires a branded selection system.

Selection styling must remain readable and accessible.

---

# 4. Spacing, padding, and margin audit

Spacing must look intentional.

For every component, inspect:

- outer margin
- inner padding
- gap between siblings
- icon-to-label gap
- label-to-control gap
- heading-to-content gap
- section-to-section gap
- card density
- toolbar density
- sidebar density
- bottom-bar density
- modal padding
- input padding
- button padding
- touch target expansion
- whitespace around fixed elements
- safe-area spacing

Detect both:

- lean UI: cramped, visually starved, hard to scan
- fat UI: oversized, wasteful, slow to scan, poor information density

Look for one-pixel and subpixel inconsistencies, uneven gaps, mismatched
vertical rhythm, and visually misaligned baselines.

Do not merely compare CSS numbers. Judge rendered optical alignment.

---

# 5. Alignment audit

Audit:

- left edges
- right edges
- center alignment
- baselines
- icon boxes
- text baselines
- button labels
- toolbar controls
- card content
- form labels
- inputs
- badges
- status indicators
- floating controls
- fixed bars
- modal actions
- table columns
- grid tracks
- navigation items

Pay special attention to cases where:

- icons sit 1–4px too high/low
- labels do not align with adjacent controls
- different button sizes appear in the same row
- icons use different intrinsic viewBox geometry
- SVGs have inconsistent optical padding
- controls align mathematically but not optically
- responsive states cause a previously aligned group to drift

Fix the shared primitive when multiple instances show the same defect.

---

# 6. Responsive audit

Do not treat responsive design as "desktop plus one mobile breakpoint."

Test representative widths and heights across:

- wide desktop
- normal desktop
- small desktop
- landscape tablet
- portrait tablet
- large mobile
- normal mobile
- narrow mobile
- short viewport
- tall viewport
- portrait
- landscape
- browser UI-compacted/expanded conditions where relevant

Also test dynamic viewport behavior using modern viewport units where appropriate:

- svh/svw
- lvh/lvw
- dvh/dvw

Check for:

- horizontal overflow
- clipped content
- accidental scroll traps
- controls falling below viewport
- fixed bars covering content
- sticky headers consuming excessive space
- drawers exceeding viewport height
- dialogs exceeding viewport
- keyboard overlap
- safe-area overlap
- bottom navigation overlap
- transformed/fixed positioning bugs
- breakpoint discontinuities
- awkward one-off breakpoints
- typography wrapping failures
- icon collisions
- hidden-but-focusable controls

---

# 7. Portrait and vertical-mode audit

Vertical layouts deserve explicit inspection.

Check:

- long vertical navigation
- tall sidebars/drawers
- stacked toolbars
- bottom action bars
- floating action buttons
- content scroll regions
- modal placement
- keyboard interaction
- safe areas
- reachability
- thumb-friendly control placement
- whether fixed elements steal too much vertical space
- whether important actions remain visible

Never assume portrait is simply a narrower desktop.

---

# 8. Interaction model

Prefer the shortest understandable path.

### Tap-to-enter rule

When an item is itself the natural entry point, prefer:

    tap item -> enter/open item

over:

    tap item -> select item -> find Open/Enter button -> tap Open/Enter

unless the interface genuinely requires multi-selection or a separate action.

Do not add an Enter/Open button merely because a separate selected state exists.

Distinguish:

- single-item navigation
- multi-select
- destructive actions
- contextual actions
- drag interactions
- editable controls

Use direct manipulation where it is unambiguous.

---

# 9. Interaction states

For every interactive element, inspect:

- default
- hover
- focus
- keyboard focus
- pressed
- active
- selected
- checked
- disabled
- loading
- success
- error
- unavailable
- validation
- long-press where applicable
- drag-over where applicable

States must be visually related and theme-consistent.

Do not rely on hover for essential information on touch devices.

---

# 10. Touch targets and gesture behavior

Use approximately 44 × 44 pt as a comfortable minimum touch-target reference.

Audit the actual interactive hit area, not merely the visible icon.

Check:

- icon-only buttons
- close buttons
- back buttons
- navigation items
- list rows
- tabs
- segmented controls
- checkboxes
- drag handles
- bottom navigation
- floating controls

Do not make tiny icons clickable with tiny hit boxes.

Do not make the visible component unnecessarily huge merely to satisfy a
numeric target; use transparent/internal hit-area expansion when appropriate.

Avoid gesture conflicts with:

- browser scrolling
- edge-swipe navigation
- drawers
- nested scroll areas
- Canvas gestures
- pinch/zoom
- horizontal carousels

---

# 11. Accessibility audit

At minimum inspect:

- text contrast
- large-text contrast
- non-text contrast
- focus visibility
- keyboard navigation
- logical tab order
- semantic labels
- accessible names
- form associations
- error announcements
- status announcements
- reduced motion
- zoom/reflow
- touch targets
- screen-reader semantics
- hidden content
- disabled state semantics
- selected/expanded/collapsed semantics

Use 4.5:1 as the minimum contrast reference for ordinary text and 3:1 for
large text, while recognizing that accessibility requirements vary by standard
and context.

Never remove focus indication without replacing it with a clearly visible
accessible equivalent.

---

# 12. Typography

Audit:

- font loading
- fallback behavior
- font weights
- optical hierarchy
- line length
- line height
- letter spacing
- truncation
- wrapping
- numerical alignment
- icon/text baseline
- localization expansion
- very long words
- mixed scripts

Use approximately 45–90 characters per line as a comfortable body-text
reference and approximately 1.2–1.45× font size as a comfortable line-height
reference.

Do not force line lengths when the actual component is intentionally narrow.

---

# 13. Motion and transitions

Use motion to explain state change, not decorate every interaction.

Reference ranges:

- ~100 ms: instantaneous-feeling feedback
- 200–300 ms: snappy transitions
- 300–500 ms: deliberate transitions
- ~1 s: delay begins interrupting thought

Audit:

- duration
- easing
- direction
- transform origin
- opacity
- layout shift
- interruption
- cancellation
- reduced-motion behavior
- consistency across related components

Avoid animating expensive layout properties when transform/opacity can explain
the same transition.

For RNW-controlled navigation, follow RNW transition rules rather than inventing
local transition timing.

---

# 14. Performance audit

Use frame budgets as design constraints:

- 8.3 ms per frame at 120 Hz
- 16.7 ms per frame at 60 Hz

Inspect:

- long tasks
- forced synchronous layout
- layout thrashing
- unnecessary re-renders
- expensive effects
- oversized DOM trees
- image decoding
- image dimensions
- lazy loading
- event listener duplication
- scroll handlers
- animation work
- Canvas redraws
- memory retention
- repeated parsing
- repeated computation
- unnecessary state propagation

For Canvas, pay particular attention to:

- render-loop lifecycle
- dirty-region or selective redraw strategies where applicable
- devicePixelRatio handling
- resize handling
- pointer/touch event processing
- object count
- hit testing
- offscreen work
- allocation inside hot loops
- cleanup on unmount
- animation frame cancellation

Do not optimize blindly. Identify measurable or structurally obvious cost.

---

# 15. Functional correctness

Test every major feature for:

- create
- read
- update
- delete
- search
- filter
- sort
- selection
- navigation
- import/export
- persistence
- refresh
- undo/redo where applicable
- cancel
- retry
- loading
- empty
- error
- success
- permission/availability
- duplicate prevention

Check whether UI state actually reflects application state.

Look for:

- stale state
- race conditions
- double-submit
- lost updates
- stale search results
- incorrect selection
- broken back navigation
- modal state leaks
- URL/state mismatch
- refresh resets
- duplicate records
- duplicate event handlers

---

# 16. Search and command behavior

Search must be tested from every exposed search surface.

If multiple search boxes exist, determine whether each is intentional.

Avoid duplicate search implementations when one reusable search controller,
hook, helper, or component can serve all relevant surfaces.

Check:

- typing
- clear
- empty query
- no results
- partial match
- case behavior
- keyboard submit
- mobile keyboard behavior
- debounce behavior
- loading
- stale results
- result selection
- direct entry behavior

---

# 17. Duplicate UI and duplicate functionality

Search for:

- duplicate buttons
- duplicate navigation entries
- duplicate actions
- duplicate icons
- duplicate dialogs
- duplicate notifications
- duplicate state indicators
- duplicate handlers
- duplicate utility functions
- duplicate CSS rules
- copy-pasted component variants

Ask:

1. Is this duplicate intentional?
2. Does the user need both?
3. Can one source of truth serve both?
4. Is the same behavior implemented differently in different places?
5. Will fixing one instance leave the others broken?

Prefer shared helpers/components/tokens over repeated local patches.

---

# 18. Reusability and drift prevention

When several components share behavior, create or use:

- shared components
- design tokens
- CSS variables
- utility classes
- hooks
- service functions
- state helpers
- formatting utilities
- validation helpers
- interaction controllers

Do not abstract purely because two snippets look similar. Abstract when the
behavior, responsibility, or contract is genuinely shared.

Avoid over-abstraction that makes surgical fixes harder.

---

# 19. File-size and module architecture rule

Maximum preferred single-file size:

- target: comfortably below 800 lines
- warning: 800+ lines
- unacceptable: 1200+ lines

A file beyond 1200 lines requires module-splitting analysis.

For high-change UI and Canvas files, split earlier when separation materially
improves surgical fix efficiency or performance isolation.

Good module boundaries include:

- layout
- navigation
- state
- data access
- rendering
- interaction
- dialogs
- forms
- utilities
- feature-specific components

Do not split mechanically. Preserve clear ownership and avoid circular imports.

---

# 20. Layout surfaces

Explicitly audit:

## Header
- height
- alignment
- logo/title
- actions
- overflow
- mobile collapse

## Sidebar
- width
- collapse behavior
- nested navigation
- scroll
- active state
- touch reachability
- RNW compatibility

## Toolbar
- grouping
- icon alignment
- action priority
- overflow
- responsive collapse

## Bottom bar
- safe-area handling
- reachability
- content overlap
- active state
- fixed-position performance

## Dialogs
- size
- placement
- backdrop
- focus
- close behavior
- keyboard behavior
- scroll behavior
- mobile fit

## Drawers
- entry/exit
- focus
- scroll
- touch behavior
- backdrop
- nested navigation

## Cards/lists/grids
- density
- alignment
- selection
- direct entry
- responsive columns
- empty states

---

# 21. Browser and platform behavior

Check:

- overscroll behavior
- scrollbars
- text selection
- tap highlight
- autofill
- input appearance
- date/time controls
- number spinners
- password reveal affordances
- native focus behavior
- viewport units
- safe-area insets
- keyboard resizing
- orientation changes
- pointer coarse/fine differences

Do not fight the platform where native behavior is beneficial and intentionally
kept. The requirement is to eliminate accidental browser-native visual UI,
not to destroy useful platform semantics.

---

# 22. Error, empty, loading, and success states

Every major data surface needs coherent states:

- loading
- empty
- no search results
- partial data
- error
- retry
- success
- disabled/unavailable
- offline where relevant

Check whether state changes are:

- understandable
- visually themed
- non-duplicative
- accessible
- reversible when appropriate

Notifications should not become a second, contradictory UI system.

---

# 23. Notifications and transient UI

Audit:

- toast placement
- duplication
- stacking
- timing
- dismissal
- accessibility
- mobile safe areas
- collision with bottom bars
- collision with keyboards
- theme
- severity semantics

Avoid browser-default alert/prompt UI when the product owns a themed
notification/dialog system and the behavior can be implemented accessibly.

---

# 24. Z-index and layering

Map the layering system.

Look for:

- arbitrary z-index values
- overlapping controls
- menus behind dialogs
- tooltips behind fixed bars
- drawers behind headers
- Canvas behind/above unintended layers
- click-through overlays
- invisible blockers
- stacking-context surprises

Prefer a documented layer scale over random numbers.

---

# 25. Invisible glass openers

Where RNW or another established navigation skill specifies invisible glass
openers, preserve that mechanism.

Audit:

- hit area
- discoverability
- accidental interception
- layering
- keyboard access where relevant
- touch behavior
- animation trigger
- responsive placement

Do not replace a specialized opener mechanism with a generic visible button
without a clear product reason.

---

# 26. Data and state integrity

UI audits must include state integrity.

Check:

- one source of truth
- stale derived state
- duplicated state
- conflicting local/global state
- persistence
- URL synchronization
- refresh behavior
- navigation history
- optimistic updates
- rollback
- concurrent operations

A visually correct interface that shows incorrect state is a functional defect.

---

# 27. Testing matrix

At minimum create a matrix covering:

| Dimension | Test |
|---|---|
| Width | wide, normal, narrow |
| Height | short, normal, tall |
| Orientation | portrait, landscape |
| Device class | desktop, tablet, mobile |
| Input | mouse, touch, keyboard |
| State | loading, empty, populated, error |
| Content | short, normal, long |
| Density | sparse, normal, dense |
| Motion | normal, reduced motion |
| Zoom/reflow | enlarged text / browser zoom |
| Navigation | entry, back, deep nested entry |
| Persistence | refresh, revisit, reload |
| Performance | first render, interaction, scrolling, animation |

Add product-specific states and routes.

---

# 28. Severity model

Use:

### P0 — blocker
Core functionality is unusable, data is endangered, or the app cannot be
meaningfully operated.

### P1 — critical
Major workflow broken, severe responsive/accessibility failure, or systemic
UI defect affecting many surfaces.

### P2 — important
Meaningful usability, consistency, performance, or maintainability problem.

### P3 — polish
Minor visual/alignment/spacing/interaction refinement.

### P4 — observation
Non-actionable note, future consideration, or intentional behavior worth
documenting.

Do not inflate severity merely because a defect is visually noticeable.

---

# 29. Root-cause fixing

For each issue ask:

- Is this local?
- Is it caused by a shared primitive?
- Is it caused by a design token?
- Is it caused by layout architecture?
- Is it caused by state architecture?
- Is it caused by duplicated logic?
- Is it caused by a breakpoint?
- Is it caused by browser behavior?
- Is it caused by an external dependency?
- Is it caused by a specialized skill that should own the behavior?

Fix the highest-level cause that can be changed safely.

After every systemic fix, search for all consumers and verify them.

---

# 30. Surgical-fix protocol

For each change:

1. Record the observed defect.
2. Identify the root cause.
3. Locate all affected consumers.
4. Change the smallest shared layer that correctly fixes the problem.
5. Avoid unrelated refactors.
6. Run or inspect affected workflows.
7. Re-check desktop, tablet, mobile, portrait, and landscape.
8. Re-check touch and keyboard where applicable.
9. Re-check loading/error/empty states.
10. Check for visual drift elsewhere.
11. Check file size and module boundaries.
12. Document the result.

---

# 31. Audit output format

Produce an issue table with:

- ID
- Severity
- Area
- Viewport/device
- Reproduction
- Expected
- Actual
- Root cause
- Recommended fix
- Affected files/components
- Regression risk
- Verification

Then produce:

1. systemic findings
2. high-leverage fixes
3. viewport findings
4. component findings
5. functionality findings
6. accessibility findings
7. performance findings
8. architecture/reuse findings
9. remaining risks

Never hide important defects in a generic "polish" section.

---

# 32. Final acceptance gate

Before declaring the audit complete, verify:

- No obvious browser-native styling remains where custom theming is required.
- Tap highlight is intentionally handled.
- Text selection is intentionally themed where required.
- Spacing is balanced, not cramped or bloated.
- Icons/buttons/text are aligned.
- Touch targets are usable.
- Direct entry is used where appropriate.
- Duplicate UI/functionality has been rationalized.
- Shared behavior uses reusable helpers/components.
- No unnecessary competing implementation exists.
- Files over 1200 lines have a splitting plan.
- Responsive behavior works on desktop/tablet/mobile.
- Portrait and landscape are explicitly checked.
- Fixed bars respect safe areas and do not cover content.
- Navigation follows RNW when RNW exists and applies.
- Canvas follows Canvas skill when Canvas exists and the skill is available.
- Motion is coherent and performance-aware.
- 120 Hz and 60 Hz frame budgets have been considered.
- Loading/empty/error/success states are coherent.
- Keyboard/focus behavior is not broken by custom UI.
- Accessibility has not been sacrificed for visual customization.
- The final implementation has no obvious regressions introduced by the fixes.

The audit is complete only when both appearance and behavior have been checked.
