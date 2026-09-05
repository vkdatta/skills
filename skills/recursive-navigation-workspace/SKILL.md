---
name: recursive-navigation-workspace
description: Build and maintain a recursive, user-configurable navigation workspace with invisible edge openers, consistent animated bars, arbitrary-depth drill-down, numbered route maps, expanded hierarchical editing, and composable custom menus. Treat the template HTML as the canonical interaction reference and prevent architectural drift.
---

# RECURSIVE NAVIGATION WORKSPACE

**R.N.W. = Recursive Navigation Workspace**

## Purpose

Recursive Navigation Workspace is a cross-model, tool-agnostic UI implementation skill for navigation systems that must remain consistent while becoming arbitrarily deep and user-configurable.

It replaces the conventional fixed sidebar model with one recursive hierarchy:

`root -> item -> child -> child -> ...`

Every level is governed by the same rules. Do not invent separate behavior for "departments", "sections", "subsections", or "folders". Those are labels or roles in the data, not different navigation primitives.

The supplied template HTML is the canonical visual and interaction reference.

## Cross-Model Compatibility

These rules are intentionally written for plain Markdown/instruction-based use by:

- ChatGPT
- Kimi
- Grok
- DeepSeek
- Gemini
- Claude
- Other agents

Do not depend on proprietary UI frameworks, APIs, agent protocols, or vendor-specific syntax. Map each required operation to the host's equivalent file, editor, build, runtime, and inspection capabilities.

If a capability is unavailable, do not pretend it was performed.

## Activation

Activate automatically for:

- sidebar or navigation work;
- menu work;
- toolbar work;
- drill-down interfaces;
- nested navigation;
- recursive hierarchy changes;
- responsive navigation;
- expanded navigation/editor work;
- custom menu systems;
- navigation routing;
- navigation interaction bugs;
- visual or behavioral changes to the navigation workspace.

Pure filesystem/package operations are outside scope unless they also change navigation implementation.

## One-Time Loading Rule

Once activated for a task, load these rules once and keep them active for the remainder of the task.

Do not repeatedly reinterpret the architecture during individual edits.

Reload only if:

1. the skill version changes;
2. the user explicitly asks to review the rules; or
3. an ambiguity cannot be resolved from the current implementation/reference.

## Canonical Reference Rule

`template/index.html` is the canonical implementation reference.

Before changing an existing navigation system:

1. inspect the current implementation;
2. inspect the template when visual/interaction behavior is relevant;
3. identify the smallest affected component;
4. preserve unrelated behavior;
5. implement the requested change without drifting from the canonical principles;
6. validate the resulting interaction and source structure.

The template is a behavioral and visual reference, not permission to blindly copy unrelated application content.

## Fundamental Architecture

The navigation hierarchy is one recursive tree/data graph.

### Unified item model

Do not maintain separate runtime concepts such as:

- department item;
- section item;
- subsection item;
- folder item;

when their behavior is identical.

Use one item/container model with properties appropriate to the project, such as:

- `id`
- `label`
- `icon`
- `hidden`
- `children`
- `sourceId` or equivalent for references
- ordering information

An item with children is a container. An item without children is a leaf. Either may be presented with any user-facing name.

### Arbitrary depth

Depth is unbounded by design.

Never hard-code:

- two levels;
- three levels;
- a department depth;
- a section depth;
- a maximum route depth.

Rendering, routing, editing, breadcrumbs, route maps, visibility, and reordering must operate recursively.

## Bars

The workspace supports coherent bars on:

- top;
- bottom;
- left;
- right.

Treat them as one navigation system with orientation-specific layout, not four unrelated implementations.

### Closed-state edge opener

A closed bar must be opened through an unobtrusive edge hotspot.

Required behavior:

- hotspot is visually minimal/invisible in its resting state;
- it must not create a persistent translucent slab over application content;
- when the bar is open, its opener must not collide with bar content;
- the opener should disappear or become non-interactive when the open bar already provides its own controls;
- opening the bar restores the same spatial relationship and transition language as the reference.

Do not replace this with a permanently visible floating button unless explicitly requested.

### Bar controls

Each bar has:

- expand/open behavior at one edge;
- close behavior at the opposite edge.

The controls must occupy their own layout slots so they never overlap navigation icons.

The close control is a Lucide icon.

When inside a nested drill-down layer, the close affordance becomes the directional back/chevron affordance for that layer. At root, it returns to the normal close affordance.

Do not duplicate a drill action with both an explicit text button and a second chevron.

## Motion

Motion is part of the architecture, not decoration.

### Required transition language

Use the same transition family for:

- bar opening;
- bar closing;
- forward drill-down;
- backward drill-up;
- expanded navigation drill-down;
- expanded navigation drill-up.

The reference uses approximately:

`0.35s cubic-bezier(0.4, 0, 0.2, 1)`

for the primary spatial expansion/collapse behavior.

Do not casually change the timing, easing, or direction on one pathway.

Micro-interactions may use shorter transitions, but they must remain visually subordinate to the primary navigation motion.

### Directionality

Forward navigation should visually communicate moving deeper into the hierarchy.

Backward navigation should visually communicate returning toward the parent.

Do not use a completely different animation for one nested level versus another.

## Runtime Drill-Down

Clicking a container's drill action enters its children.

Example:

`Core -> Control -> Settings -> Advanced`

At every level:

- the same row model is used;
- the same visibility control is used;
- the same reorder behavior is used;
- the same drill control is used;
- the same back behavior is used.

If a node has no children, do not fabricate an empty drill level.

## Breadcrumb Route

The current route must remain visible and understandable.

Example:

`root / Core / Control / Settings`

### Width handling

The route is allowed to scroll horizontally.

Do not remove horizontal scrolling merely because a collapsed representation exists.

When the route becomes too long for the available width:

- preserve the beginning/root and the relevant current endpoint;
- collapse the middle into `...`;
- do not distort or shrink the entire route until it becomes unreadable.

### Deep-route overflow menu

Clicking `...` opens a large route map.

The route map must:

- use maximum practical screen space;
- be scrollable vertically;
- preserve horizontal scrolling where the route itself needs it;
- list every route level;
- use concise numeric level badges;
- remain pure text plus numeric badges;
- contain no tree-drawing characters;
- contain no decorative route icons;
- allow direct navigation to a selected level.

Example:

```text
01  root
02  Core
03  Control
04  Settings
05  Advanced
...
50  Level 49
51  Level 50
```

The selected route level should be visually distinguishable without changing the fundamental compact language.

## Forward Routing

A deep route must not force the user to click the drill action repeatedly.

The route map must expose reachable forward destinations where the hierarchy can be resolved.

If the user is at Level 07 and Level 50 is reachable, Level 50 must be selectable directly.

Selecting a destination must construct/resolve the actual route to that destination. Never merely change the breadcrumb text while leaving the navigation state at the wrong node.

For branching hierarchies, route destinations must retain enough identity/path information to select the correct branch.

## Expanded Navigation

The expanded navigation menu is the editor and overview of the same hierarchy.

### Single unified pane

Do not recreate the old department/section two-pane model.

There is one hierarchy and one drill-down editor.

Remove obsolete split-pane concepts when they duplicate the same data.

### Editor row

A standard editable item may expose:

- drag/reorder handle;
- item icon;
- item label;
- drill/move control when it has children;
- visibility checkbox;
- delete/remove control where permitted.

The exact control order should remain consistent with the reference.

The drill/move control appears before the checkbox.

Do not use an explicit `"Move in"` label when the compact arrow is sufficient.

### Visibility

Visibility is one unified operation.

The same checkbox semantics apply to:

- root items;
- containers;
- sections;
- subsections;
- nested items;
- custom menu items where visibility is supported.

Use Lucide visual states for visibility controls where the implementation uses icon-based controls.

### Reordering

Reordering must work at every level.

Never implement drag/reorder only for root items while nested levels are static.

Maintain stable item identity when reordering.

## Custom Menus

Users may create custom navigation menus because they may use only a small subset of functions from many different branches.

### Creation

There must be exactly one creation entry point for a given context.

Do not duplicate "New menu" buttons.

A created menu is a real hierarchy node/container, not merely a visual heading.

### Custom hierarchy

Users can create:

`Custom Menu -> Section -> Subsection -> ...`

with no artificial depth limit.

### Add existing

A custom menu must provide a real way to add existing items.

The picker should be able to discover items from:

- any original department/root;
- any section;
- any subsection;
- any deeper level;
- other supported custom-menu sources.

Search is preferred when the hierarchy is large.

Adding an existing item creates a reference/shortcut or project-equivalent composition relationship.

Do not remove the source item.

Do not silently mutate the source item's parent.

Do not clone behavior in a way that creates inconsistent independent state unless the user explicitly asks for a copy.

### Remove from custom menu

Users must be able to remove an item from a custom menu.

Removal from the custom menu must not delete the original source item.

If the item is a custom-only node, remove it according to the project's deletion semantics.

### User-defined icons

Never force every newly created menu or section to use a folder icon.

Allow the user to specify an icon name.

Resolve that icon through Lucide.

Recommended behavior:

- accept a valid Lucide icon name;
- normalize only where safe;
- use a small neutral fallback if the name cannot be resolved;
- never replace a valid requested icon with a folder icon merely because it is custom.

## Lucide

Use Lucide for interface icons.

This includes, where applicable:

- close;
- back/chevron;
- expand;
- visibility;
- drag/reorder;
- delete;
- other UI affordances.

Do not draw SVG icons manually when the equivalent Lucide icon exists.

The route map is the exception to decorative iconography: route levels themselves remain pure text with numeric badges.

## User-Facing Design Principles

The workspace must feel:

- compact;
- calm;
- predictable;
- directly manipulable;
- spatially coherent;
- easy to learn;
- powerful without looking complicated.

Avoid:

- duplicated actions;
- oversized typography;
- arbitrary boldness for nested levels;
- decorative tree diagrams;
- unnecessary permanent overlays;
- forced folder icons;
- separate data models for visually similar hierarchy levels;
- controls colliding with content;
- fixed-depth assumptions.

## Responsive Behavior

The four bar orientations must remain usable across screen sizes.

Preserve:

- edge-opening behavior;
- dedicated control slots;
- non-collision guarantees;
- scrollable deep routes;
- full-screen or maximum-practical-space route maps;
- touch-friendly hit areas.

Do not let mobile overrides reintroduce an open-state edge hotspot that collides with the open bar.

## State Model

At minimum, keep these concerns conceptually separate:

- bar visibility;
- bar open/closed state;
- current route/node;
- expanded route stack;
- custom menu data;
- item visibility;
- item ordering;
- source/reference identity;
- route-map open/closed state.

Closing a bar should not corrupt the underlying hierarchy.

Closing a nested layer should return to its parent rather than destroying unrelated navigation data.

## Data Integrity

When changing navigation data:

- preserve stable IDs;
- preserve source references;
- preserve ordering;
- avoid duplicate definitions;
- avoid duplicate menu entries when the product forbids them;
- prevent cycles in recursive containers;
- prevent an item from becoming its own descendant;
- ensure deleted custom references do not leave broken navigation targets;
- keep runtime and expanded-editor views synchronized.

## 50-Level Test Case

The reference includes a deep hierarchy suitable for testing recursive behavior.

Maintain an equivalent stress test during implementation when useful:

`Level 01 -> Level 02 -> ... -> Level 50`

Use it to verify:

- arbitrary depth;
- route collapsing;
- route-map enumeration;
- direct forward routing;
- back navigation;
- transition consistency;
- expanded-menu drilling;
- scrolling;
- no stack/index assumptions based on shallow depth.

The test hierarchy is a test fixture, not a reason to hard-code depth 50.

## Validation

Before finishing a navigation task, verify:

### Architecture

- one unified recursive item model;
- no department/section duplication;
- no fixed depth;
- no duplicate controls for the same action;
- custom menus use the same recursive model;
- references preserve source identity.

### Interaction

- closed bars open from invisible/minimal edge hotspots;
- open bars do not retain colliding hotspots;
- expand and close occupy opposite edges;
- nested close becomes back/chevron;
- forward drill and backward drill animate consistently;
- route map jumps directly to selected levels;
- `...` works at deep routes;
- horizontal route scrolling remains available;
- custom menus can actually add existing items;
- custom items can actually be removed;
- users can create nested custom sections.

### Visual

- standard item typography remains compact;
- nested levels do not become arbitrarily bold or oversized;
- route typography is consistent;
- checkbox sizing is consistent;
- move/drill controls have no unnecessary borders;
- no permanent translucent collision layer;
- route map has numeric badges and no tree drawing;
- Lucide icons render correctly.

### Code quality

- no dead CSS from removed controls;
- no dead JS from removed controls;
- no duplicate event handlers;
- no duplicate menu buttons;
- no stale department/section rendering paths;
- no hard-coded maximum depth;
- no syntax errors;
- use actual build/test/runtime evidence when available.

## Completion Contract

A change is complete only when the implementation preserves the Recursive Navigation Workspace principles, not merely when the requested button or screen exists.

When a requested feature conflicts with these principles, prefer the smallest implementation that preserves:

`recursive hierarchy + unified item model + consistent motion + direct routing + user composition + no duplicated controls`

Do not silently introduce a second navigation architecture to satisfy a local UI request. 

Lucide icons can be overwritten by user either through expression or implied existing usage. In that case, don't force lucide.
