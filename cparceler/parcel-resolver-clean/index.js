const { Resolver } = require("@parcel/plugin");
const path = require("path");
const fs = require("fs");

const pkgInfo = require("./package.json");

// function resolveExt(file) {
//     // Tests for file which might need an extra extension to be resolved
//     try {
//         if (fs.existsSync(file) && fs.lstatSync(file).isFile()) return { filePath: file };

//         for (const ext of [".js", ".jsx", ".ts", ".tsx"]) {
//             if (fs.existsSync(file+ext) && fs.lstatSync(file+ext).isFile()) return { filePath: file+ext };
//         }
//     } catch (err) { /**/ }

//     return null;
// }

// function resolveModule(modulesFolder, module) {
//     try {
//         const mod = path.resolve(path.join(modulesFolder, module));
//         const main = JSON.parse(fs.readFileSync(path.join(mod, "package.json"))).main;
//         return resolveExt(path.resolve(path.join(mod, main)));
//     } catch (err) { /**/ }

//     return null;
// }

module.exports = new Resolver({
    async resolve({specifier, dependency}) {
        // Filter out external links and data urls
        if (/^\.?\/?bin\/.*|^\w*:?\/\/|data:/.test(specifier)) return {isExcluded: true};
        // Filter out files we don't want to copy over
        if (/^\.?\/?i\/.*|.*\.py|^(\.|\/s)?\/?coi-serviceworker.*/.test(specifier)) return {isExcluded: true};

        if (dependency.resolveFrom) {
            // Not an entry point. This is being imported from elsewhere.

            // Absolute references point to the src directory.
            const srcBase = pkgInfo.sourceFolder || "src";
            if (specifier[0] == "/") return { filePath: path.resolve(path.join(".", srcBase, specifier)) };

        //     // Relative reference
        //     let resolution = resolveExt(path.resolve(path.join(path.dirname(resolveFrom), data.specifier)));
        //     if (resolution) return resolution;

        //     // Still if not, if code, it's possible something got screwed up
        //     if (data.dependency.sourceAssetType == "js") {
        //         if (resolveFrom.includes("/node_modules/")) {
        //             // Submodule with some weird quirks.
        //             // Need to resolve relative to the nearest ancestor named node_modules.
        //             const innerModuleFolder = resolveFrom.substring(0, resolveFrom.lastIndexOf("/node_modules/")+14);
        //             resolution = resolveExt(path.join(innerModuleFolder, data.specifier));
        //             if (resolution) return resolution;

        //             resolution = resolveModule(innerModuleFolder, data.specifier);
        //             if (resolution) return resolution;
        //         }

        //         resolution = resolveModule("node_modules", data.specifier);
        //         if (resolution) return resolution;
        //     }

        //     // fs.appendFileSync("/home/mgz/Desktop/log.txt", `resolve: ${JSON.stringify(data)}\n         ${resolveFrom}\n         ${data.dependency.sourceAssetType}\n         ${data.moduleSpecifier}\n\n`);
        // } else {
        //     // This is an entry point. Parcel already resolved these automatically.
        //     return { filePath: data.specifier };
        }

        // Otherwise, we have failed to locate the file. Perhaps something else will have better luck?
        if (!specifier) console.log("uh ohs.");
        return null;
    }
});