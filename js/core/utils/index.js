export function findProcessModeFromCommand() {
    return process.argv.includes("development") ? "development" : "production";
}
