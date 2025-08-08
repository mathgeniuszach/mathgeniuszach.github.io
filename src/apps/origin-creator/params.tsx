import JSZip from "jszip";

function clean(text: string): string {
    return encodeURIComponent(text.replace(/\/+/g, ""));
}

export const urlParams: URLSearchParams = new URLSearchParams(location.search);
export const ghuser = clean(urlParams.get("u") || "");
export const ghrepo = clean(urlParams.get("r") || "");
export const ghbranch = clean(urlParams.get("b") || "");
export const savecount = parseInt(urlParams.get("saves") as any) || 5;

export const ocrepo = `github://${ghuser || "mathgeniuszach"}/${ghrepo || "origin-creator-schemas"}/${ghbranch || "dev"}`;
export const flowrepo = `github://${ghuser || "mathgeniuszach"}/${ghrepo || "origins-flow-help"}/${ghbranch || "main"}`;

const MAX_TRIES = 3;
const RETRY_DELAY = 5000;

export type JSZipFolder = JSZip & {root: string};

// Downloads the data from the given url and returns a JSZip at the root of the repo.
export async function fetchZip(url: string): Promise<JSZipFolder> {
    // Find protocol location in url
    const protoLoc = url.indexOf("://");
    if (protoLoc < 0) throw new Error("Unknown url protocol!");

    // Use protocol to determine how to fetch zip
    let newUrl = url;

    const proto = url.substring(0, protoLoc);
    const parts = url.substring(protoLoc+3).split("/").map(p => decodeURIComponent(p));
    switch (proto) {
        case "github": {
            if (parts.length < 2 || parts.length > 3) throw new Error("Bad github url.");
            newUrl = `https://api.mathgeniuszach.com/repo/${parts[0]}/${parts[1]}/${parts[2] || "main"}`;
            break;
        }
        default: throw new Error(`Unknown url protocol "${proto}"`);
    }

    let zfile = await fetch(newUrl);
    if (400 <= zfile.status && zfile.status <= 499) {
        throw new Error(`${zfile.status}: ${zfile.statusText}`);
    }

    let tries = MAX_TRIES;
    while (!zfile.ok && tries) {
        await new Promise(r => setTimeout(r, RETRY_DELAY));
        zfile = await fetch(newUrl);

        if (400 <= zfile.status && zfile.status <= 499) {
            throw new Error(`${zfile.status}: ${zfile.statusText}`);
        }

        --tries;
    }
    if (!zfile.ok) throw new Error(`Max retries exceeded; ${zfile.status}: ${zfile.statusText}`);

    const zip = await JSZip.loadAsync(zfile.blob());
    const fpath = Object.keys(zip.files)[0];
    return zip.folder(fpath.substring(0, fpath.indexOf("/")+1)) as JSZipFolder;
}