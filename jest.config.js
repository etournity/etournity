/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  verbose: false,
  rootDir: __dirname,
  projects: [
    {
      displayName: 'Server',
      testMatch: ['<rootDir>/packages/server/**/*.(test|spec).[jt]s?(x)'],
      testPathIgnorePatterns: ['dist', 'node_modules'],
    },
  ],
  testEnvironment: 'node',
}
