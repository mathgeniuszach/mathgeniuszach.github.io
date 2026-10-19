import { startCase } from "lodash";

import { locateLink } from "../build";
import { oc } from "../api";
import { HelperSpec, HelperItem, HelperSection } from "./types";

const specs: HelperSpec[] = [];

const arr = (v: any): string[] => v == null ? [] : (Array.isArray(v) ? v : [v]).map(String);

// Schema "helper:" -> button. "id" defaults to the file being built, so lists can sit next to the field
export function helperButton(schema: any, fileId: string): string {
    const h = schema?.helper;
    if (!h || typeof h != "object") return "";

    const spec: HelperSpec = {
        title: String(h.title ?? "Helper"),
        list: arr(h.list),
        id: String(h.id ?? fileId.split("-")[0]),
        folder: arr(h.folder),
    };
    if (spec.list.length == 0 && spec.folder.length == 0) return "";

    const key = JSON.stringify(spec);
    let i = specs.findIndex(s => JSON.stringify(s) == key);
    if (i < 0) i = specs.push(spec) - 1;

    return `<button type="button" class="jhelper" data-helper="${i}" title="${spec.title.replace(/"/g, "&quot;")}: show list"><i class="bi bi-plus-circle"></i></button>`;
}

export function getHelper(index: string): HelperSpec | undefined {
    return specs[parseInt(index)];
}

// Splits one enum into sections, "$Name" entries start a new one
function enumSections(label: string, e: any[], out: HelperSection[]) {
    let cur: HelperSection = { label, items: [] };
    for (const v of e) {
        const s = String(v);
        if (s[0] == "$") {
            if (cur.items.length) out.push(cur);
            cur = { label: s.substring(1), items: [] };
        } else {
            cur.items.push({ value: s });
        }
    }
    if (cur.items.length) out.push(cur);
}

// Lists a link as it is now, so project version and edited schemas apply
function linkSections(spec: HelperSpec, name: string, out: HelperSection[]) {
    let link: any;
    try { link = locateLink(name, spec.id); } catch { return; }

    // Multiple lists get their own heading
    const label = spec.list.length > 1 ? startCase(name) : spec.title;
    if (Array.isArray(link.enum)) enumSections(label, link.enum, out);
    else if (Array.isArray(link.or)) for (const o of link.or) if (Array.isArray(o.enum)) enumSections(o.title ?? label, o.enum, out);
}

// Files in the project's own folders, subfolders included
function folderItems(folder: string): HelperItem[] {
    const base = folder.replace(/\/+$/, "");
    const alt = base.endsWith("s") ? base.slice(0, -1) : base + "s";
    const items: HelperItem[] = [];
    for (const f of Array.from(new Set([base, alt]))) {
        let files: string[] = [];
        try { files = oc.listFiles(f + "/"); } catch { continue; }
        for (const p of files) {
            try { items.push({ value: oc.getTypedID(p)[1] }); } catch { }
        }
    }
    return items;
}

export function helperSections(spec: HelperSpec): HelperSection[] {
    const out: HelperSection[] = [];
    for (const name of spec.list) linkSections(spec, name, out);

    const mine: HelperItem[] = [];
    for (const f of spec.folder) mine.push(...folderItems(f));
    if (mine.length) out.unshift({ label: "From your datapack", items: Array.from(new Map(mine.map(i => [i.value, i])).values()) });

    return out;
}
