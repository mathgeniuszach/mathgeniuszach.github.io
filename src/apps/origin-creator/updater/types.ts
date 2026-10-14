export type JsonObject = Record<string, any>;

export type FileMap = Map<string, string | Uint8Array>;

export type LogLevel = "INFO" | "WARNING" | "ERROR";

export interface Trace {

    file?: string;

    fields: string;

    namespace?: string;

    dataFolder?: string;
}

export interface LogEntry {
    level: LogLevel;
    file: string;
    fields: string;
    message: string;
}

export interface Ctx {
    log(level: LogLevel, trace: Trace, message: string): void;
}

export interface FieldType {
    is_array: boolean;
    type: string;
}
export interface FieldDef {
    name: string;
    type: FieldType[];
}
export type ShapeTable = Record<string, FieldDef[]>;

export interface UpdateOptions {

    onLog?: (entry: LogEntry) => void;
}

export interface UpdateResult {

    files: FileMap;

    root: string;
    logs: LogEntry[];
    counts: Record<LogLevel, number>;

    valid: boolean;
}
