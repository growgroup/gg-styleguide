---
name: implement-design
description: Translate Figma designs into production-ready code with 1:1 visual fidelity. Use when implementing UI from Figma URLs or selected Figma nodes. Run figma-mcp-core first, then apply this skill for stack-specific implementation and validation.
metadata:
  mcp-server: figma, figma-desktop, user-figma
---

# Implement Design

## Overview

This skill focuses on implementation and validation after Figma context has already been collected.
Use `.cursor/skills/figma-mcp-core/SKILL.md` for retrieval operations, then use this skill to
translate the design into production code that matches project conventions.

## Prerequisites

- Figma MCP server is connected and accessible.
- `figma-mcp-core` has already produced:
  - target `fileKey` / `nodeId`
  - required child node map (if the node was split)
  - screenshot for visual comparison
  - asset policy to follow
- The project has established conventions or a component library (preferred).

## Role Boundary

- `figma-mcp-core`: node selection, URL parsing, `get_design_context`, `get_metadata`,
  `get_screenshot`, retrieval troubleshooting, base asset decision.
- `implement-design` (this skill): structure translation, code implementation, design-system
  integration, visual parity, and final validation.

## Required Workflow

**Follow these steps in order. Do not skip steps.**

### Step 1: Confirm Implementation Scope

- Confirm which screen/component is in scope.
- Decide whether to extend an existing component or create a new one.
- Fix target files and ownership boundaries before writing code.

### Step 2: Translate to Project Conventions

Translate the Figma representation into this project's framework, styles, and conventions.

**Key principles:**

- Treat Figma MCP output (often React + Tailwind-like structure) as a design reference, not final code style.
- Replace utility-style output with project conventions and reusable primitives.
- Reuse existing components (buttons, inputs, typography, icon wrappers) instead of duplicating functionality.
- Use the project's color system, typography scale, and spacing tokens consistently.
- Respect existing routing, state management, and data-fetch patterns.

### Step 3: Achieve 1:1 Visual Parity

Strive for pixel-level parity with the Figma screenshot.

**Guidelines:**

- Prioritize Figma fidelity for spacing, alignment, typography, and color.
- Avoid hardcoded values and prefer tokens where possible.
- When project tokens and Figma specs conflict, prefer project tokens and adjust minimally to preserve visual intent.
- Follow accessibility requirements (focus visibility, contrast, semantics).
- Add component documentation as needed.

### Step 4: Validate Against Figma

Before completion, validate the implemented UI against the screenshot.

**Validation checklist:**

- [ ] Layout matches (spacing, alignment, sizing)
- [ ] Typography matches (font, size, weight, line height)
- [ ] Colors match exactly
- [ ] Interactive states work as designed (hover, active, disabled)
- [ ] Responsive behavior follows constraints
- [ ] Assets render correctly under the selected asset policy
- [ ] Accessibility standards are met

## Implementation Rules

### Component Organization

- Place UI components in the project's designated component directories.
- Follow the project's component naming conventions.
- Avoid inline styles unless truly necessary for dynamic values.

### Design System Integration

- Always use components from the project's design system when possible.
- Map Figma design tokens to project design tokens.
- When a matching component exists, extend it rather than creating a parallel implementation.
- Document any new variants or components added.

### Code Quality

- Avoid hardcoded values; extract to constants or design tokens.
- Keep components composable and reusable.
- Add TypeScript types for component props where TypeScript is used.
- Include JSDoc comments for exported components when project conventions require it.
- Keep changes minimal and focused on the requested scope.

## Examples

### Example 1: Implementing a Button Component

User says: "Implement this Figma button component."

**Actions:**

1. Run `figma-mcp-core` for the target URL/selection and collect context + screenshot.
2. Check whether the project already has a button component to extend.
3. If yes, add a variant; if no, create a new component following project conventions.
4. Map Figma colors/spacing to project tokens.
5. Validate against screenshot for padding, radius, typography, and interaction states.

**Result:** Button component matches the Figma design and fits the project system.

### Example 2: Building a Dashboard Layout

User says: "Build this dashboard screen from Figma."

**Actions:**

1. Run `figma-mcp-core` and confirm section-level node map and screenshot.
2. Identify major sections (header, sidebar, content area, cards).
3. Build layout using existing layout primitives.
4. Implement each section with reusable components where possible.
5. Validate responsive behavior and section spacing against screenshot.

**Result:** Dashboard layout matches the design with consistent project architecture.

## Best Practices

### Always Start with Context

Never implement from assumptions. Always start from context produced by `figma-mcp-core`.

### Incremental Validation

Validate frequently during implementation, not only at the end.

### Document Deviations

If deviation is necessary (accessibility or technical constraint), document why.

### Reuse Over Recreation

Check for existing components before creating new ones.

### Design System First

When uncertain, prefer existing design-system patterns over literal one-off translation.

## Common Issues and Solutions

### Issue: Design doesn't match after implementation

**Cause:** Visual discrepancies in spacing, color, or typography.
**Solution:** Compare side-by-side with the screenshot and fix by category (layout, type, color, state).

### Issue: Assets not loading

**Cause:** Asset references do not match the selected policy.
**Solution:** Re-check the asset policy from `figma-mcp-core` and update asset paths/usages accordingly.

### Issue: Design token values differ from Figma

**Cause:** Project tokens differ from raw Figma values.
**Solution:** Prefer project tokens for consistency, then adjust sizing/spacing minimally to preserve visual parity.

## Understanding Design Implementation

The implementation workflow provides a reliable path from design to code:

- For designers: confidence that implementation matches visual intent.
- For developers: a repeatable process with less guesswork.
- For teams: consistent output aligned with the codebase and design system.

## Additional Resources

- [Figma MCP Server Documentation](https://developers.figma.com/docs/figma-mcp-server/)
- [Figma MCP Server Tools and Prompts](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)
- [Figma Variables and Design Tokens](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
