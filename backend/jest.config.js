const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  type: "module",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  transform: {
    ...tsJestTransformCfg,
  },
  transformIgnorePatterns: [
    "node_modules/(?!(node-pg-migrate|glob)/)"
  ],
  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ["ts", "js", "json"]
};