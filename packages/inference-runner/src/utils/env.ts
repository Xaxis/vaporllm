export function detectEnv(): string {
    return typeof window !== "undefined" ? "browser" : "node";
}