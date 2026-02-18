# Logic Composer

A Visual Condition Builder built with React and TypeScript that allows users to construct nested logical expressions using groups and rules.

This project focuses on clean state modeling, immutable updates, recursive rendering, and correctness — not visual styling.

---

## Tech Stack

- React (Functional Components)
- TypeScript
- Vite
- Yarn
- No external state libraries
- No form libraries

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/suvamAdhikary/logic-composer.git
cd logic-composer
```

### 2. Install dependencies

```bash
yarn
```

### 3. Run development server

```bash
yarn dev
```

The app will be available at:

```
http://localhost:5173
```

---

## Build for Production

```bash
yarn build
```

Production files will be generated in the `dist/` directory.

To preview the production build locally:

```bash
yarn preview
```

---

## Architecture Overview

### Single Source of Truth

The entire condition tree is stored in the root component (`App.tsx`) as a single `GroupNode`.

All updates:
- Flow through pure helper functions
- Are immutable
- Rebuild only necessary branches
- Never mutate state directly

---

### Domain Modeling

The condition structure is modeled using discriminated unions:

- `GroupNode`
- `RuleNode`
- `ConditionNode`

Groups:
- Contain a logical operator (`AND` / `OR`)
- Contain children (rules or groups)
- Can be nested without depth limits

Rules:
- Contain a field
- Contain an operator
- Contain a value

---

### Tree Utilities

Pure functions handle all updates:

- `updateNodeById`
- `insertChild`
- `deleteNodeById`
- `createRule`
- `createGroup`

All operations:
- Are recursive
- Return new objects
- Guarantee immutability
- Preserve root structure

---

## Functional Requirements Coverage

### Condition Groups

- Logical operator toggle (`AND` / `OR`)
- Add Rule
- Add Group (nested)
- Delete Group (except root)
- Unlimited nesting depth

### Rules

- Field selector (Price, Category, Rating)
- Operator selector (`>`, `<`, `=`, `!=`, `>=`, `<=`, `contains`)
- Text value input

### Validation

- Rule value cannot be empty
- Export disabled if invalid rules exist

### JSON Preview

- Live JSON representation of the condition tree
- Copy-to-clipboard functionality

### Deletion Safety

Handles safely:
- Deleting rules
- Deleting nested groups
- Deleting last remaining items
- Root group cannot be deleted

The UI remains stable under all deletion scenarios.

---

## Edge Cases Considered

- Deep nesting of groups
- Deleting a group containing multiple nested levels
- Deleting the last child of a group
- Updating operators at any depth
- Validation across the entire recursive tree
- Maintaining consistent tree structure after every operation

---

## Assumptions

- The condition tree is rooted in a default `GroupNode` to ensure a consistent logical structure.
- Rules cannot exist without a parent group.
- The root group cannot be deleted.
- Rule values are treated as strings for simplicity.
- Operators are shared across all fields as specified.
- No persistence is implemented (state is in-memory only).

---

## Out of Scope (As Per Assignment)

- Drag & drop
- Local storage / persistence
- Backend integration
- Advanced validation
- Complex styling or animations
- Keyboard shortcuts

Focus was placed on correctness, immutability, architecture, and maintainability.

---

## Project Structure

```
src/
 ├── app/
 │    └── App.tsx
 │
 ├── components/
 │    └── condition/
 │         ├── ConditionBuilder.tsx
 │         ├── Group.tsx
 │         ├── Rule.tsx
 │         └── JsonPreview.tsx
 │
 ├── domain/
 │    ├── types.ts
 │    └── treeUtils.ts
 │
 ├── shared/
 │    └── uid.ts
 │
 ├── main.tsx
 └── index.css
```

---

## Deployment

For Netlify:
- Build command: `yarn build`
- Publish directory: `dist`

For GitHub Pages:
- Configure `base` in `vite.config.ts` if deploying under a repository path.

---

## Conclusion

This implementation prioritizes:

- Correctness
- Clean state modeling
- Immutable logic
- Maintainability
- Type safety
- Proper React patterns

Visual design was intentionally kept minimal to align with assignment focus.
