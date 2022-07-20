export function findProcessModeFromCommand(): "production" | "development" {
  return process.argv.includes("development") ? "development" : "production";
}

export function requireUncached(/** @type { string } */ module: string) {
  delete require.cache[require.resolve(module)];
  return require(module);
}
