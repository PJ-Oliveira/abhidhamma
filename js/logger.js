function emit(level, scope, message, detail) {
    const line = `[${scope}] ${message}`;
    if (detail === undefined)
        console[level](line);
    else
        console[level](line, detail);
}
export function createLogger(scope) {
    return {
        info: (message, detail) => emit("info", scope, message, detail),
        warn: (message, detail) => emit("warn", scope, message, detail),
        error: (message, detail) => emit("error", scope, message, detail),
    };
}
//# sourceMappingURL=logger.js.map