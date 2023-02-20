# Testing

## Adding tests

### Unit & Integration tests

Depending on the package, the test match might be setup differently, however generally, you can create new tests next to the file you are testing in the format `component.test.ts(x)`.

### Testing React Components

Here's an example how a test for a react component might look like:

```tsx
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('loads and displays greeting', async () => {
  render(<Fetch url="/greeting" />)

  fireEvent.click(screen.getByText('Load Greeting'))

  await waitFor(() => screen.getByRole('heading'))

  expect(screen.getByRole('heading')).toHaveTextContent('hello there')
  expect(screen.getByRole('button')).toHaveAttribute('disabled')
})
```

### End to end tests

End to end tests are contained in the `tests/e2e` folder. Here, all tests have access to a global `page` variable that can be used to access puppeteer. Further, there are multiple servers running providing access to different packages:

- `__SERVER_BASE_URL__`
- `__CLIENT_BASE_URL__`
- `__STORYBOOK_URL__`

(These are also global variables, these contain the url to access these)

## Running tests

We have multiple scripts for the most common scenarios:

- `test`: This runs unit & integration tests and lints and type-checks \* the codebase
- `test:light`: This runs unit & integration tests
- `test:full`: This runs the full test suite
- `test:changes`: This runs tests for files changed since the last commit

Some lesser-used scripts:

- `test:extras`: This lints and type-checks the codebase
- `lint`: This lints the codebase
- `test:types`: This type-checks

## Adding tests to new packages

When adding tests to a new package, you have to create a new `jest.config.js` inside of it, add the package to our global `jest.config.js` and optionally add the package to the `test:light` script in the root `package.json`.

```js
// jest.config.js
const base = require('./../../tests/jest.config.base')
const prefix = '<rootDir>/packages/your-new-package'

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  ...base,
  testMatch: [prefix + '/**/*.test.*.[jt]s?(x)'],
}
```
