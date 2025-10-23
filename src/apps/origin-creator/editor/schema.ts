import { load as loadYaml, JSON_SCHEMA} from 'js-yaml';

import { JSONED, updateOptionHTML, updateOptionValues } from "./global";
import { fetchZip, JSZipFolder } from "../params";
import { PROJECT } from '../projects';

// Primitives
type SString = {
    type: "string"
    default?: string
    allow?: string
    name?: boolean // Special attribute that makes this update the name of the slot and header
    nonempty?: boolean // If this is set and the field becomes empty, sets to default.
    ext?: boolean // Whether or not this should actually be a textarea instead of an input,
    large?: boolean // If ext only
}
type SNumber = {
    type: "number" | "float"
    default?: number
    min?: number
    max?: number
}
type SInteger = {
    type: "integer" | "int"
    default?: number
    min?: number
    max?: number
}
type SBoolean = {
    type: "boolean" | "bool"
    default?: boolean
}
type SConst = {
    type: "const"
    const: string | number | boolean
}
type SImage = {
    type: "image"
    width?: number
    height?: number
}

// Non-primitives
type SLink = {
    type?: "link"
    link: string
    id?: string // For linking to an external schema
}
export type SEnum = {
    type?: "enum"
    enum: (string | number | boolean | null)[]
    more?: {[key: string]: {[field: string]: ISchema}}
    ns?: string
    norepr?: boolean
    default?: number
    unspec?: boolean
    convert?: {[key: string]: string}
    talias?: {[more: string]: {[field: string]: string}} // Precalculated
}
type SOr = {
    type?: "or"
    panel?: boolean // Panel override
    or: ISchema[]
    shared?: {[key: string]: ISchema} // A list of properties shared by all "object" types in "or". Shared properties come before other properties.
    default?: number
    unspec?: boolean | string
}

// Object based
export type SList = {
    type: "list"
    vals: ISchema
    show?: boolean
    large?: boolean // If textlist only
    // default?: any[]
}
type STuple = {
    type: "tuple"
    vals: ISchema[]
}
type SObject = {
    type: "object"
    props?: {[field: string]: ISchema}
    extra?: SExtra
    allow?: string
    show?: boolean
    panel?: boolean // Panel override
    ikeys?: Set<string>
    more?: Set<string>
    talias?: {[field: string]: string} // Precalculated
}

// General
export type SGeneral = {
    title?: string
    desc?: string
    href?: string
    gap?: boolean | "before" | "after" | "both"
    hooks?: string[]
    aliases?: string[]
}

// Group them all up
export type ISchema = SGeneral & (
    SString | SNumber | SInteger | SBoolean | SConst | SImage |
    SLink | SEnum | SOr |
    SList | STuple | SObject
    // | SExtends
)

export type SExtra = ISchema & {
    allowkey?: string
}

export type EditorSchema = {
    regex?: string
    type?: string
    link?: string
}

export type PresetSchema = {
    name: string
    items: string[]
    optional: string[],
    identifiers?: string[]
}
export type ItemsSchema = {
    root: string
    roots: string[]
    presets: {[key: string]: PresetSchema}
    icons: {[key: string]: string}
    // sort: {[key: string]: number}
    aliases: {[key: string]: string}
}

export type MSchema = {
    editors: EditorSchema[]
    links: {[key: string]: ISchema}
    temp: {[key: string]: any}
    options: {[key: string]: boolean | null}
    items: ItemsSchema
}

export const DEFAULT_ITEMS: ItemsSchema = {
    root: "data",
    roots: ["data", "assets"],
    presets: {},
    icons: {},
    // sort: {},
    aliases: {}
};

export const DEFAULT_MSCHEMA: MSchema = {
    editors: [],
    links: {},
    temp: {},
    options: {},
    items: JSON.parse(JSON.stringify(DEFAULT_ITEMS))
};

class JSONLocation {
    parent: {[k: string]: any} | null = null;
    index: string = "";
    where: number = 0;

    rawPath: string = "";
    parentPath: string = "";
    rawIndex: string = "";

    errMessage: string = "";
    
    constructor(version: number, path: string) {
        if (!(version in JSONED.mschemas)) {
            this.errMessage = `Cannot locate path "${path}" in version ${version}; version does not exist`;
            return;
        }
        if (typeof path != "string") {
            this.errMessage = `Cannot locate non-string path in version ${version}`;
            return;
        }
        if (path[0] != "/") {
            this.errMessage = `Cannot locate path "${path}" in version ${version}; path must begin with "/"`;
            return;
        }

        const rawParts = path.match(/\/(?:[^/\\+-]|\\.|[+-](?!$)|\\$)*|[+-]/g);
        if (!rawParts) {
            this.errMessage = `Cannot locate path "${path}" in version ${version}; path has invalid format`;
            return;
        }
        
        // Locate where the path points
        let where = 0;
        switch (rawParts[rawParts.length-1]) {
            case "+":
                rawParts.pop();
                where = 1;
                break;
            case "-":
                rawParts.pop();
                where = -1;
                break;
        }

        // Resolve escape sequences
        const parts = rawParts.map(k => k.substring(1).replace(/\\(.)/g, (m, c) => ({
            "b": "\b",
            "f": "\f",
            "n": "\n",
            "r": "\r",
            "t": "\t",
            "v": "\v",
        }[c] || c)));

        // Search for parent
        let schema: any = JSONED.mschemas[version];
        if (typeof schema == "number") {
            this.errMessage = `Cannot locate path "${path}" in version ${version}; version is linked to version ${schema}`;
            return;
        }
        let index = parts[0];
        // if (Array.isArray(schema)) {
        //     const pindex = parseInt(index);
        //     if (isNaN(pindex)) {
        //         this.errMessage = `Cannot index into array at root with non-number`;
        //         return;
        //     }
        //     index = String(pindex);
        // }
        for (let i = 1; i < parts.length; ++i) {
            if (typeof schema != "object") {
                const iParentPath = i-1 == 0 ? "root" : `path "/${rawParts.slice(0, i).join("/")}"`;
                this.errMessage = `Cannot locate path "${path}" in version ${version}; ${iParentPath} is not an array or dictionary`;
                return;
            }
            if (!(index in schema)) {
                const iParentPath = i-1 == 0 ? "root" : `path "/${rawParts.slice(0, i).join("/")}"`;
                this.errMessage = `Cannot locate path "${path}" in version ${version}; index "${rawParts[i-1].substring(1)}" not in ${iParentPath}`;
                return;
            }
            schema = schema[index];
            index = parts[i];
            if (Array.isArray(schema)) {
                const pindex = parseInt(index);
                if (isNaN(pindex)) {
                    const iParentPath = i == 0 ? "root" : `path "/${rawParts.slice(0, i+1).join("/")}"`;
                    this.errMessage = `Cannot index into array at "${iParentPath}" with non-number "${rawParts[i].substring(1)}"`;
                    return;
                }
                index = String(pindex);
            }
        }

        // Printable versions of the parent path or index
        const parentPath = parts.length <= 1 ? "root" : `path "/${rawParts.slice(0, -1).join("/")}"`;
        const rawIndex = rawParts[rawParts.length-1].substring(1);

        if (typeof schema != "object") {
            this.errMessage = `Cannot locate path "${path}" in version ${version}; ${parentPath} is not an array or dictionary`;
            return;
        }

        // Paths ending in "+" or "-" must have a valid key in parent
        if (where != 0 && !(index in schema)) {
            this.errMessage = `Cannot locate path "${path}" in version ${version}; index "${rawIndex}" not in ${parentPath}`;
            return;
        }

        // Return final location
        this.parent = schema;
        this.index = index;
        this.where = where;

        this.rawPath = path;
        this.parentPath = parentPath;
        this.rawIndex = rawIndex;
    }

    valid(): boolean {
        return this.parent != null;
    }

    hasValue(): boolean {
        if (!this.parent) return false;

        if (Array.isArray(this.parent) && isNaN(parseInt(this.index))) return false;
        if (this.where != 0) return false;

        return this.index in this.parent;
    }

    value(): any {
        if (!this.valid() || !this.parent || this.where != 0) return undefined;
        if (Array.isArray(this.parent)) {
            return this.parent[parseInt(this.index)];
        } else {
            return this.parent[this.index];
        }
    }

    set(value: any, key?: string): boolean {
        if (!this.valid() || !this.parent) return false;

        if (Array.isArray(this.parent)) {
            // Array indexes must be numbers
            let i = parseInt(this.index);
            if (isNaN(i)) {
                this.errMessage = `Cannot set non-number index "${this.rawIndex}" from array at ${this.parentPath}`;
                return false;
            }
            if (i < 0) i += this.parent.length;

            if (this.where == 0) {
                // Array index must exist
                if (i < 0 || i > this.parent.length) {
                    this.errMessage = `Cannot set`;
                    return false;
                }
                this.parent[i] = value;
            } else {
                const offset = this.where < 0 ? 0 : 1;
                this.parent.splice(i+offset, 0, value);
            }
        } else {
            if (this.where == 0) {
                // Setting a dictionary key does not update it's insertion order, which is good
                this.parent[this.index] = value;
            } else {
                // When setting a dictionary key with non-zero where, a key is required
                if (typeof key != "string" && typeof key != "number") {
                    this.errMessage = `Cannot set path "${this.rawPath}" without a "key" field`;
                    return false;
                }

                // Setting a dictionary key at a specific location is harder, as the object needs to be "reflowed"
                const reflow = {};
                const entries = Object.entries(this.parent);
                const i = Object.keys(this.parent).indexOf(this.index);

                // Add keys before index
                for (let s = 0; s < i; ++s) {
                    reflow[entries[s][0]] = entries[s][1];
                }
                
                // Add new key and index
                if (this.where < 0) reflow[key] = value;
                reflow[entries[i][0]] = entries[i][1];
                if (this.where > 0) reflow[key] = value;

                // Add keys after index
                for (let s = i+1; s < entries.length; ++s) {
                    reflow[entries[s][0]] = entries[s][1];
                }

                // Use reflowed object
                this.parent[this.index] = reflow;
            }
        }
        return true;
    }

    delete(): boolean {
        if (!this.valid() || !this.parent) return false;
        if (this.where != 0 || !(this.index in this.parent)) {
            this.errMessage = `Cannot delete path "${this.rawPath}" as it is not set`;
            return false;
        }
        if (Array.isArray(this.parent)) {
            const i = parseInt(this.index);
            if (isNaN(i)) {
                this.errMessage = `Cannot remove non-number index "${this.rawIndex}" from array at ${this.parentPath}`;
                return false;
            }
            this.parent.splice(i, 1);
        } else {
            delete this.parent[this.index];
        }
        return true;
    }

    merge(value: any): boolean {
        if (!this.valid()) return false;
        const dst = this.where == 0 ? this.value() : this.parent;
        if (!dst) {
            this.errMessage = `Cannot merge into "${this.rawPath}"; it has no value`;
            return false;
        }
        if (typeof dst != "object") {
            this.errMessage = `Cannot merge into "${this.rawPath}"; it is not a dictionary or array`;
            return false;
        }
        if (typeof value != "object") {
            this.errMessage = `Cannot merge non-dictionary and non-array value into "${this.rawPath}"`;
            return false;
        }

        if (Array.isArray(dst)) {
            if (!Array.isArray(value)) {
                this.errMessage = `Cannot merge dictionary into array at "${this.rawPath}"`;
                return false;
            }
            // Merge two arrays. Made easy with splice!
            if (this.where == 0) {
                dst.push(...value);
            } else {
                const i = parseInt(this.index);
                if (isNaN(i)) {
                    this.errMessage = `Cannot merge near non-number index "${this.rawIndex}" from array at ${this.parentPath}`;
                    return false;
                }
                const offset = this.where < 0 ? 0 : 1;
                dst.splice(i+offset, 0, ...value);
            }
        } else {
            if (Array.isArray(value)) {
                this.errMessage = `Cannot merge array into dictionary at "${this.rawPath}"`;
                return false;
            }

            // First check for conflicts
            const conflicts = Object.keys(value).filter(k => k in dst);
            if (conflicts.length > 0) {
                this.errMessage = `Cannot merge into "${this.rawPath}", conflicting keys "${conflicts.join('","')}"`;
                return false;
            }

            // Merge two dictionaries. Not so easy.
            if (this.where == 0) {
                for (const [k, v] of Object.entries(value)) dst[k] = v;
            } else {
                // Merging mid-dictionary requires object "reflow"
                // However, since we don't have access to grandparent, we have to delete the object data and re-add it;

                // Collect output keys and locate where to delete
                const entries = Object.entries(dst);
                const i = Object.keys(dst).indexOf(this.index);

                // Delete keys after key to insert
                for (let s = i; s < entries.length; ++s) {
                    delete dst[entries[s][0]];
                }
                
                // Insert keys in middle
                if (this.where > 0) dst[entries[i][0]] = entries[i][1];
                for (const [k, v] of Object.entries(value)) dst[k] = v;
                if (this.where < 0) dst[entries[i][0]] = entries[i][1];

                // Insert keys back
                for (let s = i+1; s < entries.length; ++s) {
                    dst[entries[s][0]] = entries[s][1];
                }
            }
        }

        return true;
    }

    copy(from: JSONLocation, key?: string): boolean {
        if (!this.valid() || !from.valid()) return false;
        if (!from.hasValue()) {
            this.errMessage = `Cannot copy from path "${from.rawPath}" to "${this.rawPath}"; it has no value`;
            return false;
        }
        return this.set(JSON.parse(JSON.stringify(from.value())), key);
    }

    move(from: JSONLocation, key?: string): boolean {
        if (!this.valid() || !from.valid()) return false;
        if (!from.hasValue()) {
            this.errMessage = `Cannot move from path "${from.rawPath}" to "${this.rawPath}"; it has no value`;
            return false;
        }
        if (!this.set(from.value(), key)) return false;
        if (!from.delete()) return false;
        return true;
    }
}

class VersionRange {
    ranges: [number, number][] | null = [];

    errMessage: string = "";

    constructor(from: any, inRange?: VersionRange) {
        this.ranges = [];

        // Parse "from" into initial ranges
        if (typeof from == "string") {
            // Strings are version ranges, separated by spaces. Like ..4 7..
            const versionRanges = from.trim().split(" ").map(v => v.trim().split(".."));
            for (const versionRange of versionRanges) {
                if (versionRange.length == 1) {
                    const v = parseInt(versionRange[0]);
                    if (isNaN(v)) {
                        this.errMessage = `Version range "${from}" is invalid`;
                        this.ranges = null;
                        return;
                    }
                    this.ranges.push([v, v]);
                } else if (versionRange.length == 2) {
                    const rmin = versionRange[0];
                    const min = rmin ? parseInt(rmin) : 0;
                    const rmax = versionRange[1];
                    const max = rmax ? parseInt(rmax) : Infinity;
                    if (isNaN(min) || isNaN(max)) {
                        this.errMessage = `Version range "${from}" is invalid`;
                        this.ranges = null;
                        return;
                    }
                    this.ranges.push([min, max]);
                } else {
                    this.errMessage = `Version range "${from}" is invalid`;
                    this.ranges = null;
                    return;
                }
            }
            if (this.ranges.length <= 0) {
                this.errMessage = `Version range "${from}" is invalid`;
                this.ranges = null;
                return;
            }
        } else if (typeof from == "number") {
            // Single numbers are used as is if allowed.
            const i = Math.floor(from);
            this.ranges.push([i, i]);
        } else if (!from) {
            // Default is all versions, unbounded.
            this.ranges.push([0, Infinity]);
        } else {
            // What the heck is this?
            this.errMessage = "Version range is not a number or string";
            this.ranges = null;
            return;
        }

        // Sort and reduce ranges
        let overlap: [number, number][];
        [this.ranges, overlap] = VersionRange.reduce(this.ranges);
        // If any overlap exists, reduce it and error;
        if (overlap.length) {
            overlap = VersionRange.reduce(overlap)[0];
            const overlapText = overlap.map(r => r[0] == r[1] ? `${r[0]}` : `${r[0]}..${r[1]}`).join(" ");
            this.errMessage = `Version range "${from}" lists versions in sub-range "${overlapText}" multiple times`;
            this.ranges = null;
            return;
        }

        // Intersect with other range
        if (inRange && inRange.ranges) {
            // heh, oranges
            const oranges: [number, number][] = [];

            // Alternate back and forth, finding intersections.
            let ai = 0;
            let bi = 0;
            while (ai < this.ranges.length && bi < inRange.ranges.length) {
                const [amin, amax] = this.ranges[ai];
                const [bmin, bmax] = inRange.ranges[bi];

                // Find and use intersection if it exists
                if (bmin <= amin && amin <= bmax) {
                    oranges.push([amin, bmax]);
                } else if (amin <= bmin && bmin <= amax) {
                    oranges.push([bmin, amax]);
                }

                // Now move indexes forward if it lags behind
                if (amax <= bmax) ai += 1;
                if (bmax <= amax) bi += 1;
            }

            // If no versions overlap, throw an error.
            if (oranges.length <= 0) {
                this.errMessage = `Version range "${from}" has no overlap with parent version ranges`;
                this.ranges = null;
                return;
            }

            this.ranges = oranges;
        }

        // Add versions at the edges of all ranges
        for (const [min, max] of this.ranges) {
            VersionRange.addVersion(min);
            VersionRange.addVersion(max);
            VersionRange.addVersion(max+1);
        }
    }

    static reduce(ranges: [number, number][]): [[number, number][], [number, number][]] {
        if (ranges.length < 1) return [[], []];

        ranges.sort((a, b) => a[0] - b[0]);

        const nranges: [number, number][] = [];
        const overlap: [number, number][] = [];
        let [lmin, lmax] = ranges[0];
        for (const [min, max] of ranges.slice(1)) {
            if (min <= lmax+1) {
                // Merge and collect any overlap
                if (min <= lmax) overlap.push([min, lmax]);
                lmax = Math.max(lmax, max);
            } else {
                // No overlap or merge. Append old range
                nranges.push([lmin, lmax]);
                lmin = min;
                lmax = max;
            }
        }
        // Append last range
        nranges.push([lmin, lmax]);

        return [nranges, overlap];
    }

    valid(): boolean {
        return this.ranges != null;
    }

    // Collect matching versions.
    // If a linked version does not match while it's source does,
    // The two versions must be split.
    *versions(): Generator<number> {
        if (!this.valid() || !this.ranges) return;

        let ri = 0;
        let [min, max] = this.ranges[ri];
        for (const rver of Object.keys(JSONED.mschemas)) {
            // Loop over all versions
            const ver = parseInt(rver);
            while (ver > max) {
                if (++ri >= this.ranges.length) return;
                [min, max] = this.ranges[ri];
            }
            if (min <= ver && ver <= max) yield ver;
        }
    }

    static addVersion(ver: number) {
        if (ver <= 0 || !isFinite(ver) || ver in JSONED.mschemas) return;
    
        // Find nearest existing data by looking backwards.
        let nearest: any;
        for (let i = ver; i > 0; --i) {
            if (i in JSONED.mschemas) {
                nearest = JSONED.mschemas[i];
                break;
            }
        }
        
        if (nearest == null) {
            // No data, this is the first
            JSONED.mschemas[ver] = DEFAULT_MSCHEMA;
        } else {
            // Some data, link to nearest. Copy later if necessary.
            JSONED.mschemas[ver] = JSON.parse(JSON.stringify(nearest));
        }
    }
}

// Apply patchers recursively.
function patch(patchErrors: string[], path: string, patcher: {[k: string]: any}, inVersionRange?: VersionRange, skipVersions?: Set<number>) {
    // Applying patch
    // console.log(path, patcher);

    // Check version range, optionally using existing version range
    const versionRange = new VersionRange(patcher.version, inVersionRange);
    if (!versionRange.valid()) {
        patchErrors.push(`Failed to run patch "${path}":\n${versionRange.errMessage}`);
        return;
    }

    const toSkip = new Set<number>(skipVersions);

    // Loop and apply patches only in version range
    versionLoop:
    for (const ver of versionRange.versions()) {
        // Skip failed test versions
        if (toSkip.has(ver)) continue;

        // ver should always exist in JSONED.mschemas.
        if (!(ver in JSONED.mschemas)) {
            patchErrors.push(`Failed to run patch "${path}" could not find version ${ver}`);
            continue;
        }

        const mschema = JSONED.mschemas[ver];

        // Check tests and skip if any fail.
        if (patcher.tests) {
            if (typeof patcher.tests != "object") {
                patchErrors.push(`Patch "${path}" has invalid tests object, skipping...`);
                return;
            }
            for (const [testPath, testValue] of Object.entries(patcher.tests)) {
                const location = new JSONLocation(ver, testPath);
                if (!location.valid()) {
                    patchErrors.push(`Patch "${path}" could not run test at path "${testPath}":\n${location.errMessage}`);
                    toSkip.add(ver);
                    continue versionLoop;
                }
                // Note, this check depends on insertion order. This is intentional.
                if (JSON.stringify(location.value()) != JSON.stringify(testValue)) {
                    if (JSONED.LOG_FAILED_TESTS) console.log(`Patch "${path}" failed test at path "${testPath}" in version ${ver}, skipping version ${ver}`);
                    toSkip.add(ver);
                    continue versionLoop;
                }
            }
        }

        // Merge in any data directly provided
        if (patcher.data) {
            if (typeof patcher.data != "object") {
                patchErrors.push(`Patch "${path}" has invalid data object, skipping...`);
                return;
            }
            // Store conflicts. Continue checking for more conflicts so all can be printed.
            let conflicts: string[] = [];
            for (const [key, value] of Object.entries(patcher.data)) {
                if (key in mschema) {
                    const idata = mschema[key];
                    if (
                        typeof idata != "object" || typeof value != "object" ||
                        Array.isArray(idata) != Array.isArray(value)
                    ) {
                        conflicts.push("/"+key);
                        continue;
                    }

                    if (Array.isArray(value)) {
                        idata.push(...value);
                        continue;
                    }

                    for (const [ikey, ivalue] of Object.entries(value as object)) {
                        if (ikey in idata) {
                            conflicts.push("/"+key+"/"+ikey);
                        } else {
                            if (conflicts.length) continue;
                            idata[ikey] = ivalue;
                        }
                    }
                } else {
                    if (conflicts.length) continue;
                    mschema[key] = value;
                }
            }
            if (conflicts.length) {
                patchErrors.push(`Patch "${path}" has conflicting data at paths:\n${conflicts.join(", ")}\nskipping...`);
                return;
            }
        }

        // Apply patch (with "op", "path", "value", and "from")
        if (patcher.path) {
            if (patcher.patches) {
                patchErrors.push(`Patch "${path}" may not contain both an "op" field and sub-patches, skipping...`);
                return;
            }
            if (patcher.path && typeof patcher.path != "string") {
                patchErrors.push(`Patch "${path}" has non-string path, skipping...`);
                return;
            }
            const target = new JSONLocation(ver, patcher.path || "/");

            let from: JSONLocation = null as any;
            if (["copy", "move"].includes(patcher.op)) {
                if (!patcher.from) {
                    patchErrors.push(`Patch "${path}" is missing from path, skipping...`);
                    return;
                }
                
                if (typeof patcher.from != "string") {
                    patchErrors.push(`Patch "${path}" has non-string from path, skipping...`);
                    return;
                }
                from = new JSONLocation(ver, patcher.from);
                if (!from.valid()) {
                    patchErrors.push(`Failed to run patch "${path}":\n${from?.errMessage}`);
                    return;
                }
            }

            if (!target.valid()) {
                patchErrors.push(`Failed to run patch "${path}":\n${target.errMessage}`);
                return;
            }

            let success = true;
            switch (patcher.op || "merge") {
                case "set": success = target.set(patcher.value, patcher.key); break;
                case "delete": success = target.delete(); break;
                case "merge": success = target.merge(patcher.value); break;
                case "copy": success = target.copy(from, patcher.key); break;
                case "move": success = target.move(from, patcher.key); break;
                default:
                    patchErrors.push(`Patch "${path}" uses unknown operation, skipping...`);
                    return;
            }

            if (!success) patchErrors.push(`Failed to run patch "${path}":\n${target.errMessage || from?.errMessage}`);
        }
    }

    // Apply each sub-patch recursively
    if (patcher.patches) {
        if (!Array.isArray(patcher.patches)) {
            patchErrors.push(`Patch "${path}" contains an invalid list of sub-patches, skipping...`);
            return;
        }
        for (let i = 0; i < patcher.patches.length; ++i) {
            const subpatcher = patcher.patches[i];
            const subpatcherName = path+"/"+i;
            if (typeof subpatcher != "object") {
                patchErrors.push(`Patch "${subpatcherName}" is not valid, skipping...`);
                continue;
            }
            patch(patchErrors, subpatcherName, subpatcher, versionRange, toSkip);
        }
    }
}

let lock = false;

export async function loadSchemas(repoUrls: string[]): Promise<{[url: string]: string[]}> {
    // Lock to prevent repo loads from interfering with each other
    while (lock) await new Promise(r => setTimeout(r, 100));
    lock = true;

    // At least one schema version is required for ".." to match something at the start.
    JSONED.mschemas = {};
    VersionRange.addVersion(1);

    // Download all repos as patchers
    const patchers: [string, string, {[k: string]: any}, string[]][] = [];
    const patchErrors = {};

    // All options
    const optionDefaults = {};
    const optionDependencies = {};
    const optionDependents = {};

    let totalPatchCount = 0;
    let totalRepos = 0;
    for (const urepoUrl of repoUrls) {
        const repoUrl = urepoUrl.trim();

        PROJECT.showSnack(`Downloading repo:\n${repoUrl}`);
        console.log(`Downloading repo "${repoUrl}":`);

        let schemas: JSZipFolder;
        try {
            schemas = await fetchZip(repoUrl);
        } catch (err) {
            console.error(err);
            patchErrors[repoUrl] = [String(err)];
            continue;
        }

        const repoPatchErrors: string[] = [];
        patchErrors[repoUrl] = repoPatchErrors;

        PROJECT.showSnack(`Loading repo:\n${repoUrl}`);
        console.log(`Loading repo...`);

        let patchCount = 0;
        for (const [filepath, file] of Object.entries(schemas.files)) {
            // Only load yaml files in the "src" directory are loaded.
            if (!(filepath.startsWith(schemas.root+"src/") && filepath.endsWith(".yaml"))) continue;
            const filesubpath = filepath.slice(schemas.root.length);
            const ydata = loadYaml(await file.async("text"), {schema: JSON_SCHEMA});
            if (typeof ydata != "object") {
                repoPatchErrors.push(`File "${filesubpath}" is not a valid patch file, skipping...`);
                continue;
            }
            // Toggleable options for schemas.
            if (ydata.options) {
                // If the options are not an object, that's a problem
                if (typeof ydata.options != "object") {
                    repoPatchErrors.push(`File "${filepath}" has invalid options, skipping...`);
                    continue;
                }
                // Loop over all options
                optLoop:
                for (const [option, optdata] of Object.entries(ydata.options as object)) {
                    if (typeof optdata == "boolean") {
                        // Options which are booleans are defaults and exist as is
                        optionDefaults[option] = optdata;
                    } else if (typeof optdata == "object") {
                        if (typeof optdata.default != "boolean") {
                            repoPatchErrors.push(`File "${filepath}" option "${option}" default is not a boolean, skipping...`);
                            continue;
                        }
                        optionDefaults[option] = optdata.default;
                        if (optdata.depends) {
                            if (!Array.isArray(optdata.depends)) {
                                repoPatchErrors.push(`File "${filepath}" option "${option}" depends is not an array, skipping...`);
                                continue;
                            }
                            optionDependencies[option] = optdata.depends;
                            for (const dependency of optdata.depends) {
                                if (typeof dependency != "string") {
                                    repoPatchErrors.push(`File "${filepath}" option "${option}" has non-string dependency, skipping...`);
                                    continue optLoop;
                                }
                                if (!(dependency in optionDependents)) {
                                    optionDependents[dependency] = [];
                                }
                                optionDependents[dependency].push(option);
                            }
                        }
                    } else {
                        repoPatchErrors.push(`File "${filepath}" option "${option}" default is not a boolean`);
                    }
                }
            }
            patchers.push([
                // Patch file name
                ydata.name || filepath.slice(filepath.lastIndexOf("/")+1, -5),
                // Patch file full path
                filepath.slice(schemas.root.length),
                // Patch file data
                ydata,
                // List to store patch errors in
                repoPatchErrors
            ]);
            patchCount += 1;
        }

        console.log(`Found ${patchCount} valid patch file${patchCount == 1 ? "" : "s"}`);
        totalPatchCount += patchCount;
        totalRepos += 1;
    }

    PROJECT.showSnack(`Applying ${totalPatchCount} patches from ${totalRepos} repos...`);

    // Load option data from defaults and localStorage
    JSONED.options = {
        defaults: optionDefaults,
        dependencies: optionDependencies,
        dependents: optionDependents
    };
    const optionValues = updateOptionValues();
    JSONED.mschemas[1].options = optionValues;

    updateOptionHTML(optionValues);

    // Sort patchers by priority. Higher priority goes first, then patch name takes priority.
    patchers.sort((a, b) => (b[2]?.priority ?? 0) - (a[2]?.priority ?? 0) || a[0].localeCompare(b[0]));

    // Schemas are split by version. Any time a new version is mentioned, it gets split again.
    for (const patcher of patchers) patch(patcher[3], patcher[1], patcher[2]);

    lock = false;

    return patchErrors;
}

function _checkSchemaData(
    path: string,
    data: any,
    links: {[key: string]: any},
    checkErrors: string[],
    dependencies?: Set<string>
) {
    if (typeof data != "object") {
        checkErrors.push(`"${path}" is not a valid schema`);
        return;
    }

    if (!data.type) {
        if ("const" in data) data.type = "const";
        if ("link" in data) data.type = "link";
        if ("or" in data) data.type = "or";
        if ("enum" in data) data.type = "enum";
    }

    if (typeof data.type != "string") {
        checkErrors.push(`"${path}/type" is not a valid type`);
        return;
    }

    if ("link" in data) {
        if (typeof data.link != "string") {
            checkErrors.push(`"${path}/link" is not a string`);
        } else if (!(data.link in links)) {
            checkErrors.push(`"${path}/link" is unknown link "${data.link}"`);
        } else if (dependencies) {
            dependencies.add(data.link);
        }
    }
    if ("const" in data) {
        if (data.type != "const") checkErrors.push(`"${path}/const" is not used in type "${data.type}"`);
    }
    if ("or" in data) {
        if (data.type != "or") checkErrors.push(`"${path}/or" is not used in type "${data.type}"`);
    }
    if ("enum" in data) {
        if (data.type != "enum") checkErrors.push(`"${path}/enum" is not used in type "${data.type}"`);
    }

    if ("extend" in data) {
        checkErrors.push(`"${path}/extend" is no longer supported`);
    }
    if ("shared" in data) {
        checkErrors.push(`"${path}/shared" is no longer supported`);
    }
    if ("vals" in data && data.type != "list" && data.type != "tuple") {
        checkErrors.push(`"${path}/vals" is not used in type "${data.type}"`);
    }
    if ("props" in data && data.type != "object") {
        checkErrors.push(`"${path}/props" is not used in type "${data.type}"`);
    }
    if ("extra" in data && data.type != "object") {
        checkErrors.push(`"${path}/extra" is not used in type "${data.type}"`);
    }

    switch (data.type) {
        case "or":
            if (!Array.isArray(data.or)) {
                checkErrors.push(`"${path}/or" is not an array`);
                return;
            }
            for (const [i, sdata] of Object.entries(data.or)) {
                _checkSchemaData(path+"/"+i, sdata, links, checkErrors);
            }
            break;
        case "list":
            _checkSchemaData(path+"/vals", data.vals, links, checkErrors);
            break;
        case "tuple":
            if (!Array.isArray(data.vals)) {
                checkErrors.push(`"${path}/vals" is not an array`);
                return;
            }
            for (const [i, sdata] of Object.entries(data.vals)) {
                _checkSchemaData(path+"/vals/"+i, sdata, links, checkErrors, dependencies);
            }
            break;
        case "object":
            if (data.props) {
                if (typeof data.props != "object") {
                    checkErrors.push(`"${path}/props" is not a dictionary`);
                }
                for (const [k, v] of Object.entries(data.props)) {
                    _checkSchemaData(path+"/props/"+k, v, links, checkErrors,
                        (data.type != "object" || data.show ? dependencies : undefined)
                    );
                }
            }
            if (data.extra) {
                _checkSchemaData(path+"/extra", data.extra, links, checkErrors);
            }
            break;
        case "enum":
            if (!Array.isArray(data.enum)) {
                checkErrors.push(`"${path}/enum" is not an array`);
                return;
            }
            if (data.more) {
                if (typeof data.more != "object") {
                    checkErrors.push(`"${path}/more" is not a dictionary`);
                    return;
                }
                for (const [k, v] of Object.entries(data.more)) {
                    if (typeof v != "object") {
                        checkErrors.push(`"${path}/more/${k}" is not a dictionary`);
                        continue;
                    }
                    for (const [k2, v2] of Object.entries(v as object)) {
                        _checkSchemaData(path+"/more/"+k+"/"+k2, v2, links, checkErrors);
                    }
                }
            }
            break;
        default:
            if (![
                "string", "float", "number", "int", "integer",
                "bool", "boolean", "const", "image", "link",
            ].includes(data.type)) {
                checkErrors.push(`"${path}/type" is unknown type "${data.type}"`);
            }
    }
}

export function checkSchemas(): string[] {
    // Check and correct schema details.
    const checkErrors: string[] = [];

    for (const [ver, schema] of Object.entries(JSONED.mschemas)) {
        schema.temp = {};

        if (typeof schema.items != "object") {
            checkErrors.push(`"${ver}/items" is missing or an invalid object`);
            schema.items = JSON.parse(JSON.stringify(DEFAULT_ITEMS));
        }
        if (typeof schema.editors != "object") {
            checkErrors.push(`"${ver}/editors" is missing or an invalid object`);
            schema.editors = [];
        }
        if (typeof schema.links != "object") {
            checkErrors.push(`"${ver}/links" is missing or an invalid object`);
            schema.links = {};
        }

        // Verify that the items are valid
        if (typeof schema.items.root != "string") {
            checkErrors.push(`"${ver}/items/root" is not a string`);
            schema.items.root = "data";
        }
        if (
            !Array.isArray(schema.items.roots) ||
            schema.items.roots.findIndex(v => typeof v != "string") >= 0
        ) {
            checkErrors.push(`"${ver}/items/roots" is not an array of strings`);
            schema.items.roots = ["data", "assets"];
        }
        if (typeof schema.items.presets != "object") {
            checkErrors.push(`"${ver}/items/presets" is missing or an invalid object`);
            schema.items.presets = {};
        }
        let presets_failed = false;
        for (const [id, preset] of Object.entries(schema.items.presets)) {
            if (typeof id != "string") {
                checkErrors.push(`"${ver}/items/presets" has non-string key`);
                presets_failed = true;
                continue;
            }
            if (typeof preset.name != "string") {
                checkErrors.push(`"${ver}/items/presets/${id}/name" is not a string`);
                presets_failed = true;
            }
            if (
                !Array.isArray(preset.items) ||
                preset.items.findIndex(v => typeof v != "string") >= 0
            ) {
                checkErrors.push(`"${ver}/items/presets/${id}/items" is not an array of strings`);
                presets_failed = true;
            }
            if (
                !Array.isArray(preset.optional) ||
                preset.optional.findIndex(v => typeof v != "string") >= 0
            ) {
                checkErrors.push(`"${ver}/items/presets/${id}/optional" is not an array of strings`);
                presets_failed = true;
            }
            if (
                preset.identifiers && (!Array.isArray(preset.identifiers) ||
                preset.identifiers.findIndex(v => typeof v != "string") >= 0)
            ) {
                checkErrors.push(`"${ver}/items/presets/${id}/identifiers" is not an array of strings`);
                presets_failed = true;
            }
        }
        if (presets_failed) schema.items.presets = {};
        for (const [field, type] of [
            ["icons", "string"],
            // ["sort", "number"],
            ["aliases", "string"]
        ]) {
            if (
                typeof schema.items[field] != "object" ||
                Object.entries(schema.items[field]).findIndex(
                    ([k, v]) => typeof k != "string" || typeof v != type
                ) >= 0
            ) {
                checkErrors.push(`"${ver}/items/${field}" is not an object mapping strings to ${type}s`);
                schema.items[field] = {};
            }
        }

        // Verify that the editors are valid
        for (let i = 0; i < schema.editors.length; ++i) {
            const editor = schema.editors[i];

            try {
                if (editor.regex) RegExp(editor.regex);
            } catch (err) {
                checkErrors.push(`"${ver}/editors" has bad edtior regex "${editor.regex}":\n${err}`);
            }

            if ("link" in editor) {
                if (!("type" in editor)) editor.type = "link";
            
                if (editor.type != "link") {
                    checkErrors.push(`"${ver}/editors/${i}/link" cannot be used on type "${editor.type}"`);
                    continue;
                }
                if (typeof editor.link != "string") {
                    checkErrors.push(`"${ver}/editors/${i}/link" is not a string`);
                }
                if (!((editor.link as string) in schema.links)) {
                    checkErrors.push(`"${ver}/editors/${i}/link" is unknown link "${editor.link}"`);
                }
            }

            if (typeof editor.type != "string") {
                checkErrors.push(`"${ver}/editors/${i}/type" is not a string`);
            }
        }

        // Check schema data for errors and to collect link dependencies
        const linkDependencies: {[key: string]: Set<string>} = {};
        for (const [link, data] of Object.entries(schema.links)) {
            if (typeof link != "string") {
                checkErrors.push(`"${ver}/links" has non-string key`);
                continue;
            }
            const dependencies = new Set<string>();
            _checkSchemaData(ver+"/links/"+link, data, schema.links, checkErrors, dependencies);
            linkDependencies[link] = dependencies;
        }

        // Check for any links depending on themselves
        dependencyLoop:
        for (const link in linkDependencies) {
            let visited = new Set<string>();
            let toVisit = linkDependencies[link];
            do {
                if (toVisit.has(link)) {
                    checkErrors.push(`Link at "${ver}/links/${link}" depends on itself`);
                    continue dependencyLoop;
                }
                const visiting = toVisit;
                toVisit = new Set<string>();
                for (const dependency of visiting) {
                    visited.add(dependency);
                }
                for (const dependency of visiting) {
                    for (const idependency of linkDependencies[dependency]) {
                        if (!visited.has(idependency)) {
                            toVisit.add(idependency);
                        }
                    }
                }
            } while (toVisit.size > 0);
        }
    }

    return checkErrors;
}