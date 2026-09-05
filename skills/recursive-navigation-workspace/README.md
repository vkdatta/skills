# RECURSIVE NAVIGATION WORKSPACE

**Recursive Navigation Workspace**

A cross-model, tool-agnostic UI implementation skill for building navigation systems that behave as a **recursive workspace rather than a fixed two-level sidebar**.

The attached/template HTML is the canonical visual and interaction reference. `SKILL.md` is the authoritative implementation contract; `metadata.yaml` is host metadata.

## What it is

Recursive Navigation Workspace is a navigation architecture in which:

- every navigation item can contain children;
- every depth uses the same interaction model;
- users can drill down indefinitely;
- the current route remains understandable at any depth;
- deep routes can be reached directly through a route map;
- the expanded navigation editor uses the same hierarchy as runtime navigation;
- users can create their own menus and sections;
- custom menus can contain items sourced from anywhere in the existing hierarchy;
- visibility, ordering, nesting, and composition are user-controlled;
- top, bottom, left, and right bars behave as one coherent system.

It is deliberately **recursive, composable, spatially adaptive, and user-designed**.

## Package

```text
recursive-navigation-workspace/
├── SKILL.md
├── metadata.yaml
├── README.md
└── template/
    └── index.html
```

## Canonical reference

`template/index.html` is the production reference supplied with this skill. When implementing the system in another project, preserve its interaction principles and visual behavior unless the user explicitly changes them.

## Core non-negotiables

1. **Invisible edge openers**  
   Closed bars are opened by subtle edge hotspots. They must not become permanent visual clutter.

2. **Consistent motion**  
   Opening, closing, drilling forward, and drilling backward use the same smooth transition language. Do not introduce unrelated animation timing.

3. **Recursive hierarchy**  
   There is no artificial department/section split. A node is simply an item/container. Any node may contain children.

4. **Expanded navigation is the editor**  
   Runtime navigation and expanded navigation operate on the same hierarchy. Never create a fake second hierarchy for editing.

5. **Route map for depth**  
   Breadcrumbs stay concise. When depth exceeds available width, collapse the middle into `...`; selecting it opens a large, scrollable numbered route map. The route map is pure text plus numeric level badges—no tree drawing and no route icons.

6. **Forward routing**  
   Users must not be forced to click through every intermediate level. The route map must allow direct navigation to reachable deeper levels.

7. **User-designed menus**  
   Users can create custom menus and nested sections, then add existing items from any source branch and any depth.

8. **Composition, not duplication**  
   Adding an existing item to a custom menu creates a reference/shortcut to the source item. It must not silently delete, move, or fork the original item.

9. **One action, one meaning**  
   Do not show duplicate controls for the same operation. In particular, never pair an explicit “Move in” label with a second chevron for the same drill-down action.

10. **Lucide icons**  
    Use Lucide for interface icons. Do not force a folder icon on user-created menus or sections. Accept an icon name and resolve it through Lucide. If user specifies/uses any other icons like phosphor or delluna or material icons, don't override it.

11. **Compact controls**  
    Move/drill controls appear before visibility checkboxes. Controls must not collide with item icons or labels.

12. **No favorites unless explicitly requested**  
    Favorites are not part of the base architecture.

13. **Unified visibility model**  
    The same visibility control applies to root items, sections, subsections, custom sections, and nested items.

14. **Ordering everywhere**  
    Reordering must work at every hierarchy level.

## Design goal

The user of end webapp (not the designer) should feel that the navigation is **theirs**: compact when closed, expressive when expanded, predictable at every depth, and configurable without needing to understand the implementation.

