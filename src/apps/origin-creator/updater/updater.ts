import { basePowerFields } from "./data";
import { fixPower } from "./fixers";
import type { Ctx, FileMap, JsonObject, LogEntry, LogLevel, Trace, UpdateOptions, UpdateResult } from "./types";
import { getType, has, isObject, renameKey } from "./util";

const decoder = new TextDecoder("utf-8");

function readJson(files: FileMap, path: string): any {
    const raw = files.get(path);
    if (raw === undefined) throw new Error("file not found");
    const text = typeof raw === "string" ? raw : decoder.decode(raw);

    return JSON.parse(text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);
}

function writeJson(files: FileMap, path: string, data: unknown): void {
    files.set(path, JSON.stringify(data, null, 4));
}

function jsonFilesUnder(files: FileMap, prefix: string): string[] {
    const out: string[] = [];
    for (const path of files.keys()) {
        if (path.startsWith(prefix) && path.endsWith(".json")) out.push(path);
    }
    return out;
}

function subfolders(files: FileMap, prefix: string): string[] {
    const names = new Set<string>();
    for (const path of files.keys()) {
        if (!path.startsWith(prefix)) continue;
        const rest = path.slice(prefix.length);
        const slash = rest.indexOf("/");
        if (slash > 0) names.add(rest.slice(0, slash));
    }
    return [...names];
}

function renameFolder(files: FileMap, from: string, to: string): void {
    const moves: [string, string][] = [];
    for (const path of files.keys()) {
        if (path.startsWith(from + "/")) moves.push([path, to + path.slice(from.length)]);
    }
    for (const [oldPath, newPath] of moves) {
        files.set(newPath, files.get(oldPath)!);
        files.delete(oldPath);
    }
}

export function findDatapackRoot(files: FileMap): string | null {
    let best: string | null = null;
    for (const path of files.keys()) {
        if (path !== "pack.mcmeta" && !path.endsWith("/pack.mcmeta")) continue;
        const root = path.slice(0, path.length - "pack.mcmeta".length);
        if (best === null || root.length < best.length) best = root;
    }
    return best;
}

function updatePowers(ctx: Ctx, files: FileMap, baseTrace: Trace, powersPrefix: string, root: string): void {
    for (const path of jsonFilesUnder(files, powersPrefix)) {
        const trace: Trace = { ...baseTrace, file: path.slice(root.length), fields: "" };

        let data: any;
        try {
            data = readJson(files, path);
        } catch (e) {
            ctx.log("ERROR", trace, `Error reading file: ${(e as Error).message}. Skipping file.`);
            continue;
        }
        if (!isObject(data)) {
            ctx.log("ERROR", trace, "Power file is not a JSON object. Skipping file.");
            continue;
        }

        const type = getType(data);
        if (type === null) {
            ctx.log("ERROR", trace, "Power has no type field. Skipping file.");
            continue;
        }

        if (type === "origins:multiple") {

            const baseFields = new Set(basePowerFields);
            for (const key of Object.keys(data)) {
                if (baseFields.has(key)) continue;
                if (!isObject(data[key])) continue;
                fixPower(ctx, { ...trace, fields: trace.fields + "." + key }, data[key]);
            }
        } else {
            fixPower(ctx, trace, data);
        }

        writeJson(files, path, data);
    }
}

function fixItemStack(ctx: Ctx, trace: Trace, stack: JsonObject): JsonObject {
    renameKey(stack, "item", "id");
    if (has(stack, "amount")) renameKey(stack, "amount", "count");
    if (has(stack, "tag")) {

        ctx.log("ERROR", trace, "Fixing nbt tags is unimplemented.");
    }
    return stack;
}

function fixIcon(ctx: Ctx, trace: Trace, origin: JsonObject): JsonObject {
    if (has(origin, "icon")) {
        let icon = origin.icon;

        if (typeof icon === "string") icon = { item: icon };
        if (isObject(icon)) origin.icon = fixItemStack(ctx, trace, icon);
    }
    return origin;
}

function updateOrigins(ctx: Ctx, files: FileMap, baseTrace: Trace, originsPrefix: string, root: string): void {
    for (const path of jsonFilesUnder(files, originsPrefix)) {
        const trace: Trace = { ...baseTrace, file: path.slice(root.length), fields: "" };
        let origin: any;
        try {
            origin = readJson(files, path);
        } catch (e) {
            ctx.log("ERROR", trace, `Error reading file: ${(e as Error).message}. Skipping file.`);
            continue;
        }
        if (!isObject(origin)) continue;
        writeJson(files, path, fixIcon(ctx, trace, origin));
    }
}

const TAG_FOLDER_RENAMES: [string, string][] = [
    ["items", "item"],
    ["blocks", "block"],
    ["entity_types", "entity_type"],
    ["fluids", "fluid"],
    ["game_events", "game_event"],
    ["functions", "function"],
];
const NAMESPACE_FOLDER_RENAMES: [string, string][] = [
    ["structures", "structure"],
    ["advancements", "advancement"],
    ["recipes", "recipe"],
    ["loot_tables", "loot_table"],
    ["predicates", "predicate"],
    ["item_modifiers", "item_modifier"],
    ["functions", "function"],
];

function updateFolders(ctx: Ctx, files: FileMap, baseTrace: Trace, nsPrefix: string): void {
    const trace: Trace = { ...baseTrace, fields: "" };

    if (subfolders(files, nsPrefix).includes("tags")) {
        const tagPrefix = nsPrefix + "tags/";
        const tagFolders = subfolders(files, tagPrefix);
        for (const [from, to] of TAG_FOLDER_RENAMES) {
            if (tagFolders.includes(from)) {
                renameFolder(files, tagPrefix + from, tagPrefix + to);
                ctx.log("INFO", trace, `Renamed folder tags/${from} to tags/${to}`);
            }
        }
    }

    const folders = subfolders(files, nsPrefix);
    for (const [from, to] of NAMESPACE_FOLDER_RENAMES) {
        if (folders.includes(from)) {
            renameFolder(files, nsPrefix + from, nsPrefix + to);
            ctx.log("INFO", trace, `Renamed folder ${from} to ${to}`);
        }
    }
}

const TARGET_PACK_FORMAT = 48;

function updatePackFormat(ctx: Ctx, files: FileMap, root: string): void {
    const path = root + "pack.mcmeta";
    const trace: Trace = { file: path.slice(root.length), fields: ".pack.pack_format" };

    let meta: any;
    try {
        meta = readJson(files, path);
    } catch (e) {
        ctx.log("ERROR", trace, `Error reading file: ${(e as Error).message}. Unable to update pack_format.`);
        return;
    }
    if (!isObject(meta)) {
        ctx.log("ERROR", trace, "pack.mcmeta is not a JSON object. Unable to update pack_format.");
        return;
    }
    if (!isObject(meta.pack)) meta.pack = {};

    const current = meta.pack.pack_format;
    if (typeof current === "number" && current >= TARGET_PACK_FORMAT) return;

    meta.pack.pack_format = TARGET_PACK_FORMAT;
    writeJson(files, path, meta);
    ctx.log(
        "INFO",
        trace,
        typeof current === "number"
            ? `Updated pack_format from ${current} to ${TARGET_PACK_FORMAT}`
            : `Set missing pack_format to ${TARGET_PACK_FORMAT}`,
    );
    if (has(meta.pack, "supported_formats")) {
        ctx.log("WARNING", trace, "supported_formats is present and was not changed, check it covers 48.");
    }
}

export function updateDatapack(files: FileMap, options: UpdateOptions = {}): UpdateResult {
    const logs: LogEntry[] = [];
    const counts: Record<LogLevel, number> = { INFO: 0, WARNING: 0, ERROR: 0 };

    const ctx: Ctx = {
        log(level, trace, message) {
            const entry: LogEntry = { level, file: trace.file ?? "", fields: trace.fields ?? "", message };
            logs.push(entry);
            counts[level]++;
            options.onLog?.(entry);
        },
    };

    const result = (valid: boolean, root: string): UpdateResult => ({ files, root, logs, counts, valid });

    const root = findDatapackRoot(files);
    if (root === null) {
        ctx.log("ERROR", { fields: "" }, "'pack.mcmeta' file not found");
        return result(false, "");
    }
    const dataPrefix = root + "data/";
    const namespaces = subfolders(files, dataPrefix);
    if (namespaces.length === 0 && ![...files.keys()].some((p) => p.startsWith(dataPrefix))) {
        ctx.log("ERROR", { fields: "" }, "'data' folder not found");
        return result(false, root);
    }

    for (const namespace of namespaces) {
        const nsPrefix = `${dataPrefix}${namespace}/`;
        const trace: Trace = { fields: "", namespace, dataFolder: dataPrefix.slice(root.length) };
        updatePowers(ctx, files, trace, nsPrefix + "powers/", root);
        updateOrigins(ctx, files, trace, nsPrefix + "origins/", root);
        updateFolders(ctx, files, trace, nsPrefix);
    }

    updatePackFormat(ctx, files, root);

    return result(true, root);
}
