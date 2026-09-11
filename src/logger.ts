type Level = "info" | "warn" | "error";

function emit(level: Level, scope: string, message: string, detail?: unknown): void {
  const line = `[${scope}] ${message}`;
  if (detail === undefined) console[level](line);
  else console[level](line, detail);
}

export function createLogger(scope: string) {
  return {
    info: (message: string, detail?: unknown) => emit("info", scope, message, detail),
    warn: (message: string, detail?: unknown) => emit("warn", scope, message, detail),
    error: (message: string, detail?: unknown) => emit("error", scope, message, detail),
  };
}
