import JSZip from "jszip";
import { IMAGE_FILES, viewSection } from "..";
import { block, unblock } from "../component/backdrop";
import { refresh } from "../component/jstree";
import { iconed } from "../component/sidebar";
import { PROJECT, save, updateName } from "../projects";
import { get, set, has } from "./wrapper";

export async function extract(zip: JSZip, updateMetadata: boolean = true, includeAssets: boolean = true, renameMergeConflicts: boolean = true) {
    block();

    const pmeta = PROJECT.data.meta;

    // Extract and load icon
    if (updateMetadata) {
        const icon = zip.file("pack.png");
        if (icon) {
            try {
                set(pmeta, "icon", "data:image/png;base64," + await icon.async("base64"));
            } catch (err) {
                unblock();
                throw Error("Failed to load pack icon; " + err);
            }
        }

        const licenseFilename = Object.keys(zip.files).find(v => v.toUpperCase().includes("LICENSE") && !v.includes("/"));
        if (licenseFilename) {
            const license = zip.file(licenseFilename)!;
            set(pmeta, "license_text", await license.async("text"));
        }

        try {
            let meta: any = null;
            let supermeta: any = null;
            if ("fabric.mod.json" in zip.files) {
                // Fabric mod
                const modjson = zip.file("fabric.mod.json")!;
                meta = JSON.parse(await modjson.async("text"));
            } else if ("pack.mcmeta" in zip.files) {
                // Forge mod or vanilla datapack
                const mcmeta = zip.file("pack.mcmeta")!;
                supermeta = JSON.parse(await mcmeta.async("text"));
                meta = supermeta.pack;
            }

            if (meta?.id) set(pmeta, "id", String(meta.id).trim());
            if (meta?.name) set(pmeta, "meta", String(meta.name).trim());
            if (meta?.version) set(pmeta, "version", String(meta.version));
            if (meta?.description) set(pmeta, "description", String(meta.description));
            if (Array.isArray(meta?.authors)) set(pmeta, "authors", meta.authors);
            if (meta?.license) set(pmeta, "license", String(meta.license));

            if (supermeta?.filter) set(pmeta, "filter", supermeta.filter);
            if (supermeta?.overlays) set(pmeta, "overlays", supermeta.overlays);

            // Pick the latest pack format
            const newFormat = Math.max(parseInt(meta?.pack_format) || 10, get(pmeta, "pack_format") || 6);
            set(pmeta, "pack_format", newFormat);

            if (!get(pmeta, "id")) {
                // No id, meaning we need to generate one automatically

                // Get all namespaces
                const namespaces = Object.keys(zip.files)
                    .map(f => f.split("/")[1])
                    .filter(f => f && f !== undefined && f !== "minecraft" && f !== "origins");

                // Now count each namespace
                const nsCount: {[key: string]: number} = {};
                for (const ns of namespaces) {
                    nsCount[ns] = (nsCount[ns] ?? 0) + 1;
                }

                // Get most common namespace
                let tns = "my_pack";
                let tnsCount = 0;
                for (const [ns, count] of Object.entries(nsCount)) {
                    if (count > tnsCount) {
                        tns = ns;
                        tnsCount = count;
                    }
                }

                // Now use that namespace
                set(pmeta, "id", tns);
            }

            updateName();
        } catch (err) {
            unblock();
            throw Error("Failed to load metadata; " + err);
        }
    }

    const pid = get(pmeta, "id");

    // Load and merge content
    for (let [file, filedata] of Object.entries(zip.files)) {
        // Normalize incorrectly formatted zips
        let names = file.toLowerCase().trim().replace(/[^a-z0-9./_-]+/g, "_").split(/\//g);
        if (names[0] != "data" && names[0] != "assets" && (names[1] == "data" || names[1] == "assets")) names = names.splice(1);

        // Throw out non-data and non-asset files
        if (names[0] != "data" && names[0] != "assets") continue;

        // Make sure this is a file and not a folder.
        // All folders end with a slash.
        if (!names[names.length-1]) continue;

        // Throw out non-namespaced files
        if (names.length <= 2) continue;

        // Throw out assets, but only if the user wants to do so
        if (!includeAssets && names[0] == "assets") continue;

        // Add the s to the end of folder names when importing for 1.21+
        // Mojang made a strange decision to remove it from half the file names,
        // this corrects that and provides a more sensible experience, especially for porting.
        if (names[0] == "data" && names.length > 3) {
            if (names[2].slice(-1) != "s") names[2] += "s";
            if (names.length > 4 && (names[2] == "tags" || names[2] == "worldgen") && names[3].slice(-1) != "s") names[3] += "s";
        }

        // Get namespaced id of file
        let id = names[names.length-1];
        let ext = ".txt";
        if (id.includes(".")) {
            const di = id.lastIndexOf(".");
            ext = id.substring(di);
            id = id.substring(0, di);
        }
        if (names[1] != pid) id = names[1] + ":" + id; // Check if namespace is needed
        if (names[0] != "assets" && names[2] == "functions") {
            if (ext != ".mcfunction") id += ext;
        } else {
            if (ext != ".json") id += ext;
        }

        // Read the file
        let o = await encodeRawFiledata(await filedata.async("uint8array"), ext);
        try {
            o = JSON.parse(o, (k, v) => {
                // Replace namespace with 0:
                if (typeof v == "string" && v.startsWith(pid+":")) {
                    return v.replace(pid, "0");
                } else {
                    return v;
                }
            });
        } catch (err) {}

        // Get middle folders, which are all folders between the type and the filename
        const folders = names.slice(3, -1);

        // Check the type of this file. Determines what to do in other cases too
        // Slice excludes "meta" and "assets"
        if (names[0] == "data" && iconed.slice(1,-1).indexOf(names[2]) != -1 && names[2] != "functions") {
            loadFiledata(o, names[2], folders, id, names[0]);
        } else {
            loadFiledata(o, names.length > 3 ? names[2] : "", folders, id, names[0]);
        }
    }

    viewSection("projects");
    save();
    refresh();
    unblock();
}

async function loadFiledata(data: any, type: string, folders: string[], key: string, root: string) {
    // console.log(type, key);
    // Find location to insert data at
    let loc = PROJECT.data;

    if (root == "assets") {
        if (loc["assets/"] == undefined) loc["assets/"] = {};
        loc = loc["assets/"];
    }
    if (type) {
        if (loc[type+"/"] == undefined) loc[type+"/"] = {};
        loc = loc[type+"/"];
    }
    for (const folder of folders) {
        if (loc[folder+"/"] === undefined) loc[folder+"/"] = {};
        loc = loc[folder+"/"];
    }

    // Insert data at location
    if (loc[key]) {
        // Check if we can merge with existing data
        try {
            const c = loc[key];
            switch (type) {
                // Merge origin layers. Mixes origins. Replaces true fields. Perfect merge.
                case "origin_layers":
                    if (!has(c, "origins")) set(c, "origins", []);
                    // console.log(data.origins, c.origins, get(c, "origins"));
                    if (data.origins) set(c, "origins", [...new Set([...get(c, "origins"), ...data.origins])]);

                    for (const [k,v] of Object.entries(data)) {
                        if (v === true) set(c, k, true);
                    }
                    break;
                // Merge tags. Mixes values. Replaces "replace" field. Perfect merge.
                case "tags":
                    if (!has(c, "values")) set(c, "values", []);
                    if (data.values) set(c, "values", [...new Set([...get(c, "values"), ...data.values])]);

                    if (get(c, "replace") || data.replace) set(c, "replace", true);
                    break;
                // Merge language files. Merges perfectly if and only if no keys overlap. Overlapping keys are overriden.
                case "lang":
                    for (const [k,v] of Object.entries(data)) {
                        set(c, k, v);
                    }
                    break;
                // // Merge model files. Can only be done perfectly with overrides.
                // case "models":
                //     break;
                // // Merge blockstate files. Can only be done
                // case "blockstates":
                //     break;
                // Everything else cannot be merged perfectly unless they are matching files
                default:
                    loc[key] = data;
            }
        } catch (err) {
            console.error("Problem merging data; ", err);
            loc[key] = data;
        }
    } else {
        loc[key] = data;
    }
}

// TODO: swap this function out with something better
function guess_type(ext: string, content: string): string {
    if (ext == ".mcfunction") return "functions/";
    if (IMAGE_FILES.includes(ext)) return "textures/";

    try {
        const data = JSON.parse(content);
        if ("origins" in data) return "origin_layers/";
        if ("powers" in data) return "origins/";
        if ("pools" in data) return "loot_tables/";
        if ("criteria" in data) return "advancements/";
        if ("result" in data) return "recipes/";
        if ("type" in data) {
            if ("condition" in data || "name" in data || "hidden" in data) return "powers/";

            const ver = get(PROJECT.data.meta, "pack_format");
            const type = data["type"];

            // Probably powers?
            return "powers/";

            // TODO: Ensure that this is not a special recipe
            // for (let i = ver; i >= 6; --i) {
            //     const k = "recipes-" + ver;
            //     if (k in JSONED.schemas) {
            //         const cschema = resolve(JSONED.schemas[k], k);
            //         if (cschema.type != "or") break;

            //         for (const obj of cschema.or) {
            //             if (obj.type != "object") continue;

            //             const tschema = obj.props["type"];
            //             if (!tschema || tschema.type != "enum") continue;

            //             if (tschema.enum.includes(type)) return "recipes/";
            //         }

            //         break;
            //     }
            // }

            // // Non-special recipe type field objects are powers
            // // return "powers/";
        }
        if (Array.isArray(data) && data.length > 0 && "function" in data[0] || "function" in data) return "item_modifiers";
        if ("condition" in data) return "predicates/";
        if ("values" in data) return "tags/";
    } catch (err) {}

    return "imports/";
}

async function encodeRawFiledata(rawFiledata: Uint8Array, ext: string) {
    // Javascript is dumb in that it uses UTF-16 as the default format for strings.
    // This means storing both UTF-8 characters and raw byte data is impossible.
    // Coincedentally, encoding and then decoding an arbitrary byte array will not yield correct data.
    // To get around Javascript's idiocy, We perform this conversion and check if javascript screwed up the size.
    // If it did, then we encode with base64 instead with a null character at the start.
    let encodedRawFiledata = new TextDecoder().decode(rawFiledata);

    if (IMAGE_FILES.includes(ext) || new TextEncoder().encode(encodedRawFiledata).length != rawFiledata.length) {
        // If we get here, javascript can't encode this properly.
        // Because of call stack limitations,
        encodedRawFiledata = "\0RAW " + await bufferToBase64(rawFiledata);
    }

    return encodedRawFiledata;
}

export async function bufferToBase64(buffer) {
    // use a FileReader to generate a base64 data URI:
    const base64url: any = await new Promise(r => {
        const reader = new FileReader();
        reader.onload = () => r(reader.result);
        reader.readAsDataURL(new Blob([buffer]));
    });
    console.log(buffer.length, base64url.length);
    // remove the `data:...;base64,` part from the start
    return base64url.slice(base64url.indexOf(',') + 1);
}

export async function include(file: File, loc?: {[k: string]: any}) {
    block();

    // Get file name
    let name = file.name.toLowerCase().trim().replace(/[^a-z0-9._-]+/g, "_");
    const extloc = name.lastIndexOf(".");
    let ext   = extloc == -1 ? ""   : name.substring(extloc);
    name      = extloc == -1 ? name : name.substring(0, extloc);

    // Read entire file
    const stream = (await file.stream()).getReader();
    let size = 0;
    const chunks: Uint8Array[] = [];
    for (;;) {
        const bytes = await stream.read();
        if (bytes.done) break;
        chunks.push(bytes.value);
        size += bytes.value.length;
    }

    // Combine chunks into one big array
    let offset = 0;
    const out = new Uint8Array(size);
    for (const chunk of chunks) {
        out.set(chunk, offset);
        offset += chunk.length;
    }

    let t = await encodeRawFiledata(out, ext);

    // Get location to place import
    let pdata: {[k: string]: any} = loc as any;
    if (!pdata) {
        const type = guess_type(ext, t);
        if (type == "functions/" && ext == ".mcfunction" || ext == ".json") ext = "";

        pdata = PROJECT.data;
        if (type == "textures/") {
            // Asset types go into the assets folder
            if (!("assets/" in pdata)) pdata["assets/"] = {};
            pdata = pdata["assets/"];
        }
        // Make folder to import into if it doesn't exist
        if (!(type in pdata)) pdata[type] = {};
        pdata = pdata[type];
    }

    // Fix filename in case of collisions
    while (name in pdata || name+ext in pdata) name += "_";
    name += ext;

    // Parse json of file
    try {
        const pmeta = PROJECT.data.meta;
        const pid = get(pmeta, "id");

        t = JSON.parse(t, (k, v) => {
            // Replace namespace with 0:
            if (typeof v == "string" && v.startsWith(pid+":")) {
                return v.replace(pid, "0");
            } else {
                return v;
            }
        });
    } catch (err) {}
    pdata[name] = t;
    save();

    // Refresh tree
    refresh();

    unblock();
}