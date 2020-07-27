module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(css|scss)$": "<rootDir>/src/client/__mocks__/styleMock.ts",
  },
};
