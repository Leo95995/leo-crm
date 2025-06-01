/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  setupFilesAfterEnv: ["<rootDir>/tests/setup/setup.ts"], 
  testEnvironment: "node", 
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  testMatch: ["**/tests/test-suite/**/*.ts", "**/Tests/test-suite/**/*.tsx"], // 
  globals: {
    __DEV__: true,
  },
  moduleFileExtensions: ["ts", "tsx", "js", "json"], 
};
