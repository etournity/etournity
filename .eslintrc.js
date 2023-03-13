module.exports = {
  root: true,
  extends: [
    'plugin:@next/next/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:cypress/recommended',
    'xo-space/esnext',
    'xo-space/browser',
    'xo-react/space',
    'prettier',
    'prettier/babel',
    'prettier/react',
  ],
  env: {
    node: true,
    es6: true,
    browser: true,
    commonjs: true,
  },
  parser: 'babel-eslint',
  plugins: ['babel', 'react', 'eslint-plugin-prettier', 'unicorn'],
  rules: {
    'no-empty-function': 'off',
    'prettier/prettier': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    'unicorn/filename-case': [
      'error',
      {
        case: 'camelCase',
        ignore: ['.d.ts$'],
      },
    ],
    'jest/expect-expect': [
      'error',
      {
        assertFunctionNames: ['expect', 'cy.**.should', ' cy.**.expect'],
      },
    ],
    'no-warning-comments': 'off',
    '@next/next/no-html-link-for-pages': [
      'error',
      ['packages/client/pages', 'packages/admin/pages'],
    ],
    '@next/next/no-img-element': 'off',
  },
  overrides: [
    {
      files: ['tests/**/*.*', '**/tests/**', '**/*.test.*'],
      env: {
        browser: true,
        node: true,
        es2020: true,
        jest: true,
      },
      globals: {
        page: true,
        browser: true,
        context: true,
        jestPuppeteer: true,
        __SERVER_BASE_URL__: 'readonly',
        __CLIENT_BASE_URL__: 'readonly',
        __STORYBOOK_URL__: 'readonly',
      },
      extends: ['plugin:jest/recommended'],
    },
    {
      files: ['packages/client/**/*.*'],
      settings: {
        'import/resolver': {
          typescript: {
            project: 'packages/client/tsconfig.json',
          },
        },
      },
    },
    {
      files: ['packages/admin/**/*.*'],
      settings: {
        'import/resolver': {
          typescript: {
            project: 'packages/admin/tsconfig.json',
          },
        },
      },
    },
    {
      files: ['packages/server/**/*.*'],
      settings: {
        'import/resolver': {
          typescript: {
            project: 'packages/server/tsconfig.json',
          },
        },
      },
    },
    {
      files: ['packages/shared/**/*.*'],
      settings: {
        'import/resolver': {
          typescript: {
            project: 'packages/shared/tsconfig.json',
          },
        },
      },
    },
    {
      files: ['tests/cypress/**/*.*'],
      settings: {
        'import/resolver': {
          typescript: {
            project: 'tests/cypress/tsconfig.json',
          },
        },
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'xo-space/esnext',
        'xo-react/space',
        'xo-typescript/space',
        'prettier',
        'prettier/@typescript-eslint',
        'prettier/react',
      ],
      plugins: [
        '@typescript-eslint',
        'babel',
        'react',
        'eslint-plugin-prettier',
      ],
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        'react/prop-types': 'off',
        'react/require-default-props': 'off',
        'react/no-array-index-key': 'off',
        'arrow-body-style': ['error', 'as-needed'],
        '@typescript-eslint/promise-function-async': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        complexity: ['error', { max: 50 }],
        '@typescript-eslint/restrict-plus-operands': 'off',
        'max-params': ['warn', 5],
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-restricted-imports': [
          'error',
          {
            patterns: ['@mui/*/*/*', '!@mui/material/test-utils/*'],
          },
        ],
      },
    },
    {
      files: ['**/api/**'],
      rules: {
        'no-empty': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      version: 'detect',
    },
  },
}
