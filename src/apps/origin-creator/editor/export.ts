import JSZip from "jszip";
import { saveAs } from "file-saver";
import { block, unblock } from "../component/backdrop";
import { PROJECT } from "../projects";
import { simplify } from "./wrapper";
import { KNOWN_FILES, popSave } from "..";
import { oc } from "./api";

function resourcePackFormat(pack_format: number): number {
    switch (pack_format) {
        case 4: return 4;
        case 5: return 5;
        case 6: return 6;
        case 7: return 7;
        case 8: case 9: return 8;
        case 10: case 11: return 9; // 12 for 1.19.3
        case 12: return 13;
        case 13: case 14: case 15: return 15;
        case 16: case 17: case 18: return 18;
        case 19: case 20: case 21: case 22:
        case 23: case 24: case 25: case 26: default: return 22; // Mojang is weird. I'm not going to bother encoding all of these.
    }
}

function forgeVer(pack_format: number): string {
    switch (pack_format) {
        case 4: return "[1.13.0,1.14.4]";
        case 5: return "[1.15,1.16.1]";
        case 6: return "[1.16.2,1.16.5]";
        case 7: return "[1.17,1.17.1]";
        case 8: return "[1.18.0,1.18.1]";
        case 9: return "[1.18.2]";
        case 10: case 11: return "[1.19.0,1.19.3]";
        case 12: return "[1.19.4]";
        case 13: case 14: case 15: return "[1.20.0,1.20.1]";
        case 16: case 17: case 18: return "[1.20.2]";
        case 19: case 20: case 21: case 22:
        case 23: case 24: case 25: case 26: default: return "[1.20.3,)";
    }
}

function fabricDepends(pack_format: number, out: any, origined: boolean) {
    switch (pack_format) {
        case 4:
            out.depends.minecraft = ">=1.13.x <=1.14.x";
            break;
        case 5:
            out.depends.minecraft = ">=1.15.x <=1.16.1";
            break;
        case 6:
            out.depends.minecraft = "~1.16.2";
            if (origined) out.depends.origins = ">=0.7.0";
            break;
        case 7:
            out.depends.minecraft = "1.17.x";
            if (origined) out.depends.origins = ">=1.1.0";
            break;
        case 8:
            out.depends.minecraft = ">=1.18.0 <=1.18.1";
            if (origined) out.depends.origins = ">=1.3.0";
            break;
        case 9:
            out.depends.minecraft = "~1.18.2";
            if (origined) out.depends.origins = ">=1.4.0";
            break;
        case 10: case 11:
            out.depends.minecraft = ">=1.19.0 <=1.19.3";
            if (origined) out.depends.origins = ">=1.7.0";
            break;
        case 12:
            out.depends.minecraft = "~1.19.4";
            if (origined) out.depends.origins = ">=1.9.0";
            break;
        case 13: case 14: case 15:
            out.depends.minecraft = ">=1.20.0 <=1.20.1";
            if (origined) out.depends.origins = ">=1.10.0";
            break;
        case 16: case 17: case 18:
            out.depends.minecraft = "~1.20.2";
            if (origined) out.depends.origins = ">=1.11.0";
            break;
        case 19: case 20: case 21: case 22:
        case 23: case 24: case 25: case 26: default:
            out.depends.minecraft = ">=1.20.3";
            if (origined) out.depends.origins = ">=1.12.0";
            break;
    }
}

function pushjvm(output: number[], ...data) {
    for (const v of data) {
        if (typeof v == "string") {
            const str = v.length >= 256*256 ? v.substring(0, 256*256-1) : v;
            output.push(1);
            output.push(Math.floor(str.length / 256), str.length % 256);
            output.push(...new TextEncoder().encode(str));
        } else {
            output.push(v);
        }
    }
}

export async function archive(type: string) {
    block();
    popSave();

    const pmeta = simplify(PROJECT.data.meta);
    if (!pmeta.id) pmeta.id = "my_pack";
    if (!pmeta.name) pmeta.name = "My Pack";
    if (!pmeta.description) pmeta.description = "";
    if (!pmeta.version) pmeta.version = "1.0.0";

    if (type == "json") {
        const out = JSON.stringify(PROJECT.data, null, 4);
        saveAs(new Blob([out], {type: "application/json"}), pmeta.id + ".jsonoc");
        unblock();
        return;
    }

    let origined = false;
    for (const f of ["origin_layers/", "origins/", "powers/"]) {
        if (f in PROJECT.data && hasFile(PROJECT.data[f])) {
            origined = true;
            break;
        }
    }

    const zip = new JSZip();

    // Create icon
    if (pmeta.icon) zip.file("pack.png", pmeta.icon.substring(22), {base64: true});

    // Add license
    if (pmeta.license_text) zip.file("LICENSE", pmeta.license_text);

    // Create pack.mcmeta
    const x = Object.assign({}, pmeta);
    delete x.icon;
    delete x.license_text;
    delete x.filter;
    delete x.overlays;

    const px: any = {pack: x};
    if (pmeta.filter) px.filter = pmeta.filter;
    if (pmeta.overlays) px.overlays = pmeta.overlays;

    zip.file("pack.mcmeta", JSON.stringify(px, null, 4));

    // Create metadata based on type
    if (type == "fabric" || type == "poly") {
        // Create fabric.mod.json
        const out: any = {
            schemaVersion: 1,
            environment: "*",
            depends: {
                "fabric-api-base": "*",
                "fabric": "*"
            },
            name: pmeta.name || "Mod",
            id: pmeta.id || "my_pack",
            version: pmeta.version || "1.0.0",
            description: pmeta.description,
            license: pmeta.license || (pmeta.license_text ? "Custom" : "Unknown"),
        };

        // out.pack_format = pmeta.pack_format || 6;

        fabricDepends(pmeta.pack_format, out, origined);

        if (pmeta.icon) out.icon = "pack.png";
        if (pmeta.authors) out.authors = pmeta.authors;

        zip.file("fabric.mod.json", JSON.stringify(out, null, 4));
    }
    if (type == "forge" || type == "poly") {
        let ver = forgeVer(pmeta.pack_format);
        // Get mc version

        let fid: string = pmeta.id.replace(/"/g, '\\"') || "my_pack";
        if (fid.length > 255) fid = fid.substring(0, 255);

        // Create forge meta
        zip.file("META-INF/mods.toml",
`modLoader="javafml"
loaderVersion="[20,)"
license="${pmeta.license || "Unknown"}"${pmeta.icon ? '\nlogoFile="pack.png"\nlogoBlur=false' : ''}

[[mods]]
modId="${fid}"
displayName="${pmeta.name.replace(/\\/g, "\\\\").replace(/"/g, '\\"') || "Mod"}"
version="${pmeta.version || "1.0.0"}"
description='''
${pmeta.description.replace(/\\/g, "\\\\").replace(/'''/g, "\\'\\'\\'")}
'''
[[dependencies.${fid}]]
    modId="minecraft"
    mandatory=true
    versionRange="${ver}"
    ordering="NONE"
    side="BOTH"
${origined ?
`[[dependencies.${fid}]]
    modId="origins"
    mandatory=true
    versionRange="[0.1.0,)"
    ordering="NONE"
    side="BOTH"
` : ""}`);

        // To improve forge mod export support, add a mod entry point that does nothing.
        // Most versions of forge require a class file that registers the mod id.

        // The source code of this binary looks like (with "fid" replaced with pack id):

        /*  package com.fid;
            import net.minecraftforge.fml.common.Mod;

            @Mod("fid")
            public class Entry {}
        */

        const entry = [];
        pushjvm(entry,
            0xCA,0xFE,0xBA,0xBE,0x00,0x00,0x00,0x34,0x00,0x14,
            `com/${fid}/Entry`,
            0x07,0x00,0x01, "java/lang/Object",
            0x07,0x00,0x03, "Entry.java",
            "Lnet/minecraftforge/fml/common/Mod;", "value", fid,
            "<init>", "()V",
            0x0C,0x00,0x09,0x00,0x0A,0x0A,0x00,0x04,0x00,0x0B,
            "this", `Lcom/${fid}/Entry;`,
            "Code", "LineNumberTable", "LocalVariableTable",
            "SourceFile", "RuntimeVisibleAnnotations",
            0x00,0x21,0x00,0x02,0x00,0x04,0x00,0x00,0x00,0x00,
            0x00,0x01,0x00,0x01,0x00,0x09,0x00,0x0A,0x00,0x01,
            0x00,0x0F,0x00,0x00,0x00,0x2F,0x00,0x01,0x00,0x01,
            0x00,0x00,0x00,0x05,0x2A,0xB7,0x00,0x0C,0xB1,0x00,
            0x00,0x00,0x02,0x00,0x10,0x00,0x00,0x00,0x06,0x00,
            0x01,0x00,0x00,0x00,0x06,0x00,0x11,0x00,0x00,0x00,
            0x0C,0x00,0x01,0x00,0x00,0x00,0x05,0x00,0x0D,0x00,
            0x0E,0x00,0x00,0x00,0x02,0x00,0x12,0x00,0x00,0x00,
            0x02,0x00,0x05,0x00,0x13,0x00,0x00,0x00,0x0B,0x00,
            0x01,0x00,0x06,0x00,0x01,0x00,0x07,0x73,0x00,0x08
        );
        zip.file(`com/${fid}/Entry.class`, new Uint8Array(entry));
    }

    if (type != "datapack") {
        // Create manifest for mods
        zip.file("META-INF/MANIFEST.MF", "Manifest-Version: 1.0" /*+ "\nFMLModType: LIBRARY"*/ + "\n\n");
        // Add assets
        if ("assets/" in PROJECT.data) makeData(zip.folder("assets"), PROJECT.data["assets/"], "", ".json");
    }

    // Create data
    makeData(zip.folder("data"), PROJECT.data);

    // Prompt user for save
    const content = await zip.generateAsync({type: "blob"});
    saveAs(content, pmeta.name + " " + pmeta.version + (type == "datapack" ? ".zip" : ".jar"));

    if (type == "datapack" && "assets/" in PROJECT.data && hasFile(PROJECT.data["assets/"])) {
        const rzip = new JSZip();

        // Create mcmeta
        rzip.file("pack.mcmeta", JSON.stringify({"pack": x}, (k, v) => {
            return typeof k == "number" ? resourcePackFormat(v) : v;
        }, 4));

        // Create icon
        if (pmeta.icon) rzip.file("pack.png", pmeta.icon.substring(22), {base64: true});

        // Add license
        if (pmeta.license_text) rzip.file("LICENSE", pmeta.license_text);

        // Add assets to resourcepack
        makeData(rzip.folder("assets"), PROJECT.data["assets/"], "", ".json");

        const rcontent = await rzip.generateAsync({type: "blob"});
        saveAs(rcontent, pmeta.name + " " + pmeta.version + " (Resources).zip");
    }

    unblock();
}

function hasFile(data: any): boolean {
    for (const [k, v] of Object.entries(data)) {
        if (k.endsWith("/")) {
            if (hasFile(v)) return true;
        } else {
            return true;
        }
    }
    return false;
}

function makeData(izip: JSZip, data: any, path: string = "", ext?: string) {
    const pmeta = simplify(PROJECT.data.meta);
    const id = pmeta.id;

    for (const [k, v] of Object.entries(data)) {
        // Skip assets folder (also skips assets/assets/ in resource pack)
        if (path == "assets/") continue;

        if (k.endsWith("/")) {
            makeData(izip, v, path + k, ext || (k == "functions/" ? ".mcfunction" : ".json"));
        } else {
            if (!ext && path === "") continue; // Root level files do not get extracted in datapacks

            const p = k.indexOf(":");
            const namespace = (p <= 0 || k.startsWith("0:")) ? id : (k.slice(0, p) || id);
            if (!namespace) console.error(`Namespace '${namespace}' is invalid. k = ${k}; meta is `, pmeta);

            let name = (p > 0 ? k.slice(p+1) : k).replace(/:/g, "_");

            let out: any = v;
            if (typeof out != "string") {
                out = JSON.stringify(v, function (key, data) {
                    // Replace all 0: with the file's namespace
                    if (typeof data == "string" && data.startsWith("0:")) {
                        return data.replace("0", id);
                    } else {
                        return data;
                    }
                }, 4);
            } else if (out.startsWith("\0RAW ")) {
                out = atob(out.substring(5));
                const buf = new Uint8Array(out.length);
                for (let i = 0; i < out.length; ++i) {
                    buf[i] = out.charCodeAt(i);
                }
                out = buf;
            }

            if (typeof out == "string") {
                // For non-binary files, check for extension and append one if necessary
                if (!name.includes(".") || !KNOWN_FILES.includes(name.substring(name.lastIndexOf(".")))) name += ext;
            }

            izip.file(namespace + "/" + path + name, out);
        }
    }
}