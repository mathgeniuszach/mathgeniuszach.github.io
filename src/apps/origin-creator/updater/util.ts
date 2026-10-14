import type { JsonObject, LogEntry, Trace } from "./types";

export function isObject(v: unknown): v is JsonObject {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function has(obj: JsonObject, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

export function renameKey(obj: JsonObject, oldKey: string, newKey: string): JsonObject {
    if (has(obj, oldKey)) {
        const value = obj[oldKey];
        delete obj[oldKey];
        obj[newKey] = value;
    }
    return obj;
}

export function getType(data: JsonObject): string | null {
    const type = data.type;
    if (typeof type !== "string") return null;
    return type.startsWith("apoli:") ? "origins:" + type.slice("apoli:".length) : type;
}

export function basename(path: string): string {
    return path.slice(path.lastIndexOf("/") + 1);
}

export function entityGroupToTag(group: unknown): string | null {
    if (typeof group !== "string") return null;
    for (const name of ["undead", "aquatic", "arthropod", "illager"]) {
        if (group.endsWith(name)) return "minecraft:" + name;
    }
    return null;
}

export function formatLogEntry(e: LogEntry): string {
    const where = e.fields !== "" ? `File: ${e.file} in ${e.fields}: ` : `File: ${e.file}: `;
    return `[${e.level}] ${where}${e.message}`;
}

export function childTrace(trace: Trace, suffix: string): Trace {
    return { ...trace, fields: trace.fields + suffix };
}
