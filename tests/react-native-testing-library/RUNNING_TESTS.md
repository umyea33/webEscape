# Running React Testing Library Tests

These tests use the same Jest runner as the rest of the project. All commands are run from the project root (`webEscape/`).

## Run all tests (entire project)

```bash
npm test
```

## Run only the view tests in this folder

```bash
npx jest tests/react-native-testing-library
```

## Run all tests in a specific file

```bash
npx jest tests/react-native-testing-library/Views/HomeScreen.test.tsx
```

## Run all tests in a specific `describe` block

Use the `-t` flag with the describe block name:

```bash
npx jest tests/react-native-testing-library/Views/HomeScreen.test.tsx -t "HomeScreen"
```

This runs every test inside `describe('HomeScreen', ...)` in that file.

## Run a single test

Use the `-t` flag with the exact test name (the string inside `it(...)` or `test(...)`):

```bash
npx jest tests/react-native-testing-library/Views/HomeScreen.test.tsx -t "displays the current level label"
```

You can also use a regex pattern to match partial names:

```bash
npx jest -t "level label"
```

This runs any test whose name matches `level label` across all files.

## Quick reference

| What                        | Command                                             |
| --------------------------- | --------------------------------------------------- |
| All tests                   | `npm test`                                          |
| All view tests              | `npx jest tests/react-native-testing-library`       |
| One file                    | `npx jest <path-to-file>`                           |
| One `describe` block        | `npx jest <path-to-file> -t "<describe name>"`      |
| One test                    | `npx jest <path-to-file> -t "<test name>"`          |
| Pattern match across files  | `npx jest -t "<pattern>"`                           |
