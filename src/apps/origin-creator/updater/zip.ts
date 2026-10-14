import JSZip from "jszip";
import type { FileMap, UpdateOptions, UpdateResult } from "./types";
import { updateDatapack } from "./updater";

const TEXT_EXTENSIONS = [".json", ".mcmeta", ".mcfunction", ".txt", ".md", ".properties", ".lang", ".yml", ".yaml", ".glsl", ".vsh", ".fsh", ".fs", ".vs", ".mcshader"];

function isTextFile(path: string): boolean {
    const lower = path.toLowerCase();
    return TEXT_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export async function zipToFileMap(zip: JSZip): Promise<FileMap> {
    const files: FileMap = new Map();
    const jobs: Promise<void>[] = [];
    zip.forEach((relativePath, entry) => {
        if (entry.dir) return;
        const path = relativePath.replace(/\\/g, "/");
        jobs.push(
            (isTextFile(path) ? entry.async("string") : entry.async("uint8array")).then((content: string | Uint8Array) => {
                files.set(path, content);
            }),
        );
    });
    await Promise.all(jobs);
    return files;
}

export function fileMapToZip(files: FileMap, zip: JSZip = new JSZip()): JSZip {
    for (const [path, content] of files) zip.file(path, content);
    return zip;
}

export async function updateDatapackZip(
    input: JSZip | Blob | ArrayBuffer | Uint8Array,
    options: UpdateOptions = {},
): Promise<{ zip: JSZip; result: UpdateResult }> {
    const source = input instanceof JSZip ? input : await JSZip.loadAsync(input);
    const files = await zipToFileMap(source);
    const result = updateDatapack(files, options);
    return { zip: fileMapToZip(result.files), result };
}
