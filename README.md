# Logic Composer

[![CI](https://github.com/suvamAdhikary/logic-composer/actions/workflows/ci.yml/badge.svg)](https://github.com/suvamAdhikary/logic-composer/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A Visual Condition Builder built with React and TypeScript that allows users to construct nested logical expressions using groups and rules.

This implementation focuses on clean state modeling, immutable updates, recursive rendering, and correctness — not visual styling.

---

## Live Demo

🔗 [https://logic-composer-gamma.vercel.app/](https://logic-composer-gamma.vercel.app/)

![Demo](./demo.gif)
*Placeholder for demo GIF - capture your workflow and replace demo.gif*

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

### 4. Run tests

```bash
yarn test
```

Run tests in watch mode, or use:

```bash
yarn test:run      # Run tests once
yarn test:ui       # Run tests with UI
yarn test:coverage # Run tests with coverage report
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

## Testing

This project uses **Vitest** as the testing framework with comprehensive test coverage for:

- **Tree utility functions** (`treeUtils.ts`): Tests for all immutable tree operations including `updateNodeById`, `insertChild`, and `deleteNodeById`
- **Recursive evaluation logic**: Deep nesting scenarios and edge cases
- **Type definitions**: Validation of discriminated unions and type safety
- **ID generation**: UUID uniqueness and format validation

All core domain logic is thoroughly tested to ensure correctness and reliability.

Run `yarn test:coverage` to generate a detailed coverage report.

---

## Deployment

This project is deployed on **Vercel**.

Build configuration:
- Framework: Vite
- Build command: `yarn build`
- Output directory: `dist`

The application is fully client-side and requires no backend services.

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

- The condition tree is rooted in a default `GroupNode` to ensure consistent logical structure.
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

## Conclusion

This implementation prioritizes:

- Correctness
- Clean state modeling
- Immutable logic
- Maintainability
- Type safety
- Proper React patterns

Visual design was intentionally kept minimal to align with assignment focus.
