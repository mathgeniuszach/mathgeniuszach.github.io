const { Namer } = require("@parcel/plugin");
const path = require("path");
const fs = require("fs");

const pkgInfo = require("./package.json");

module.exports = new Namer({
    name({bundle, options}) {
        // fs.appendFileSync("/home/mgz/Desktop/log.txt", `name: ${bundle.getMainEntry().filePath}, ${bundle.type}, ${JSON.stringify(bundle.target)}\n`);

        if (bundle.getMainEntry()) {
            const pre = path.resolve(path.join(".", pkgInfo.sourceFolder || "src")).length + 1;
            const parts = path.parse(bundle.getMainEntry().filePath.substring(pre));

            if (options.mode == "production" || bundle.needsStableName) {
                return path.join(parts.dir, parts.name) + (bundle.type ? "."+bundle.type : parts.ext);
            } else {
                return path.join(parts.dir, parts.name) + "-" + bundle.hashReference + (bundle.type ? "."+bundle.type : parts.ext);
            }
        } else {
            return "s/" + bundle.id + "." + bundle.type;
        }
    }
});