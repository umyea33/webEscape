# Running Jest Tests

All commands are run from the project root (`webEscape/`).

## Run all tests (entire project)

```bash
npm test
```

## Run all tests in a specific file

```bash
npx jest tests/jest/Models/Node.test.ts
```

## Run all tests in a specific `describe` block

Use the `-t` flag with the describe block name:

```bash
npx jest tests/jest/Models/Node.test.ts -t "Node"
```

This runs every test inside `describe('Node', ...)` in that file.

## Run a single test

Use the `-t` flag with the exact test name (the string inside `it(...)` or `test(...)`):

```bash
npx jest tests/jest/Models/Node.test.ts -t "decreases in-degree but never below 0"
```

You can also use a regex pattern to match partial names:

```bash
npx jest -t "in-degree"
```

This runs any test whose name matches `in-degree` across all files.

## Quick reference

| What                        | Command                                             |
| --------------------------- | --------------------------------------------------- |
| All tests                   | `npm test`                                          |
| One file                    | `npx jest <path-to-file>`                           |
| One `describe` block        | `npx jest <path-to-file> -t "<describe name>"`      |
| One test                    | `npx jest <path-to-file> -t "<test name>"`          |
| Pattern match across files  | `npx jest -t "<pattern>"`                           |
