import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  collectCoverage: true,
  clearMocks: true,
  // Added to ensure "@testing-library/jest-dom" is available in all test files
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/?(*.)+(test).[tj]s?(x)"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
