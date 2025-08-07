const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const { exit } = require("process");

// Determine mode, production or development
const MODE = process.argv.length > 2 ? process.argv[2].toLowerCase() : null;

// Remove non-git items in dist
for (const f of fs.readdirSync("dist")) {
    if (f[0] != "." && f != "CNAME" && f != "README.md" && f != "bin") {
        fs.rmSync(path.join("dist", f), {recursive: true, force: true});
    }
}

if (MODE == "clean") exit(0);

// Acquire all entry points
function findEntries(dir, files, loc="/") {
    for (const f of fs.readdirSync(dir)) {
        const fpath = path.join(dir, f);
        const floc = path.join(loc, f);
        if (f == "index.html" || loc == "/apps/gamez/games" && f.endsWith(".html")) files.push(fpath);
        else if (fs.lstatSync(fpath).isDirectory()) findEntries(fpath, files, floc);
    }
}

const args = [];
findEntries("src", args);
console.log(`${args.length} entry pages found`);

// Push on some extra arguments
args.push("--dist-dir", "./dist", "--no-cache");

if (MODE) {
    // Always insert mode into arguments if provided
    args.unshift(MODE);
    // In production mode, disable source maps
    if (MODE == "build") args.push("--no-source-maps");
}

// Include incl files
function clone(src, dst) {
    for (const f of fs.readdirSync(src)) {
        const srcf = path.join(src, f);
        const dstf = path.join(dst, f);

        if (fs.lstatSync(srcf).isDirectory()) {
            // Source is a folder

            // Create directory if it does not exist
            if (fs.existsSync(dstf)) {
                // If something that's not a directory exists here, delete it
                if (!fs.lstatSync(dstf).isDirectory()) {
                    fs.rmSync(dstf);
                    // Make the directory
                    fs.mkdirSync(dstf);
                }
            } else {
                // Make the directory
                fs.mkdirSync(dstf);
            }
            // Recursive clone
            clone(srcf, dstf);
        } else {
            // Source is a file

            // Delete old file if it exists
            if (fs.existsSync(dstf)) fs.rmSync(dstf);
            // Clone the file
            fs.writeFileSync(dstf, fs.readFileSync(srcf));
        }
    }
}
clone("incl", "dist");

// Run parcel command
child_process.spawn("parcel", args, {
    cwd: process.cwd(),
    detached: true,
    stdio: "inherit"
});