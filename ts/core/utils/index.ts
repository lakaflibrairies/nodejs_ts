export function findProcessModeFromCommand(): "production" | "development" {
  return process.argv.includes("development") ? "development" : "production";
}
