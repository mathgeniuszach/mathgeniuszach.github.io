function mergeThing(thing) {
    importThing(thing, true);
}
function importThing(thing, merge) {
    if (thing.target.files.length) {
        var file = thing.target.files[0];
        var zip = new JSZip();
        zip.loadAsync(file).then(function() {
            // Honestly, screw async. People shouldn't be doing anything while importing.
            // Blocks an extra time to make time for this function to run fully.
            block(2, function() {
                save();
                loadData(JSON.stringify(data));
                //location.reload();
            });
            changeScreen("help");

            if (merge) {
                loadImportData(zip);
                unblock(2);
            } else {
                // Reset data
                data = JSON.parse(JSON.stringify(empty_data));
                if (!simplified) {
                    for (let i of non_simple) data[i] = {};
                }

                // Load icon (if available)
                var icon = zip.file("pack.png");
                if (!icon) {
                    // Do some digging to see if pack.png is inside a subfolder
                    for (let [file, filedata] of Object.entries(zip.files)) {
                        let slash = file.indexOf("/");
                        if (slash != -1 && file.substring(slash+1) == "pack.png") {
                            icon = filedata;
                            break;
                        }
                    }
                }
                if (icon) {
                    block();
                    icon.async("base64").then(function (o) {
                        data.meta.icon = "data:image/png;base64,"+o;
                        unblock();
                    }, function () {unblock()})
                }
                
                // Load metadata

                // See if fabric is available (if so, this is a mod)
                var fabric = zip.file("fabric.mod.json");
                if (fabric) {
                    fabric.async("text").then(function(o) {
                        try {
                            var metadata = JSON.parse(o);
                            var meta = data.meta;
                            
                            if (metadata.name) {
                                meta.name = metadata.name;
                                $("#side-main-head").text(data.meta.name);
                                $("#div-meta h2").text("pack - " + data.meta.name);
                            }
                            if (metadata.id) meta.id = metadata.id;
                            if (metadata.version) meta.version = metadata.version;
                            if (metadata.description) meta.description = metadata.description;
                            if (metadata.pack_format) meta.pack_format = metadata.pack_format
                            if (metadata.authors) meta.authors = metadata.authors.join(", ");

                            pid = data.meta.id;
                        } finally {
                            loadImportData(zip);
                            unblock();
                        }
                    }, function() {unblock()});
                } else {
                    // Otherwise if fabric is not available, we need to do some digging for the pack.mcmeta file
                    var mcmeta = zip.file("pack.mcmeta");
                    if (!mcmeta) {
                        for (let [file, filedata] of Object.entries(zip.files)) {
                            let slash = file.indexOf("/");
                            if (slash != -1 && file.substring(slash+1) == "pack.mcmeta") {
                                mcmeta = filedata;
                                break;
                            }
                        }
                    }
                    if (mcmeta) {
                        mcmeta.async("text").then(function(o) {
                            try {
                                Object.assign(data.meta, JSON.parse(o).pack);
                                $("#side-main-head").text(data.meta.name);
                                $("#div-meta h2").text("pack - " + data.meta.name);
                                pid = data.meta.id; // This is the only reason loadImportData exists
                            } finally {
                                loadImportData(zip);
                                unblock();
                            }
                        }, function() {unblock()});
                    } else {
                        unblock(2); // Exiting early means close unblock
                        return;
                    };
                }
            }
            
            // Unblock once to counteract extra block at beginning
            unblock();
        }, function () {
            // Generally this means the file was an invalid zip file. So maybe it's a valid json file?
            block();
            var reader = new FileReader();
            reader.onload = function(o) {
                try {
                    data = JSON.parse(o.target.result);
                    save();
                    location.reload();
                } finally {
                    unblock();
                }
            }
            reader.onerror = function() {unblock()};
            reader.readAsText(file);
        });
    }
    thing.target.value = "";
}
function loadImportData(zip) {
    block(Object.keys(zip.files).length);
    for (let [file, filedata] of Object.entries(zip.files)) {
        filedata.async("text").then(function(o) {
            try {
                let names = file.split(/[/.]/g);
                if (names[0] != "data" && names[1] == "data") names = names.splice(1);

                // Make sure this is a file and not a folder
                if (names[0] == "data" && names.length > 2 && names[names.length-1]) {
                    // Get the id from the path of the file
                    let id = names[names.length-2];
                    if (names[1] != pid) id = names[1] + ":" + id; // Check if namespace is needed
                    if (names[2] == "functions") { // Check if filetype is needed
                        if (names[names.length-1] != "mcfunction") id += "." + names[names.length-1];
                    } else {
                        if (names[names.length-1] != "json") id += "." + names[names.length-1];
                    }
                    let folders = names.slice(3, -2);
                    
                    // Check the type of this file. Determines what to do in other cases too
                    if (types.indexOf(names[2]) != -1) {
                        try {
                            putLoadedData(JSON.parse(o), names[2], folders, id);
                        } catch (err) {
                            // This file is invalid and must be loaded outside of the proper folder
                            folders.splice(0, 0, names[2]);
                            putLoadedData(o, "invalid", folders, id);
                        }
                    } else {
                        putLoadedData(o, names[2], folders, id);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                unblock();
            }
        }, function() {unblock()})
    }
}
function putLoadedData(d, type, folders, id) {
    var loc = data;
    if (loc[type+"/"] === undefined) loc[type+"/"] = {};

    loc = loc[type+"/"];
    for (let folder of folders) {
        if (loc[folder+"/"] === undefined) loc[folder+"/"] = {};
        loc = loc[folder+"/"];
    }

    loc[id] = d;
}

function exportDatapack() {
    "use strict";
    block();
    try {
        var meta = data.meta;
        if (!meta.description) meta.description = "";
        
        var zip = new JSZip();
        // Handle icon
        var icon = meta.icon;
        if (icon) {
            delete meta.icon;
            zip.file("pack.png", icon.substring(22), {base64: true});
        }
        // Handle meta
        zip.file("pack.mcmeta", `{"pack": ${JSON.stringify(meta)}}`);
        // Re add icon if necessary
        if (icon) meta.icon = icon;
        
        createData(zip.folder("data"));
        
        zip.generateAsync({"type": "blob"}).then(function(content) {
            saveAs(content, meta.id+".zip");
        });
    } catch (err) {
        console.error(err);
        alert("Could not export to datapack;\n" + err)
    } finally {
        unblock();
    }
}

function exportMod() {
    "use strict";
    block();
    try {
        var meta = data.meta;
        if (!meta.name) meta.name = "Mod";
        if (!pid) pid = "originsmod";
        if (!meta.description) meta.description = "";
        
        var outdata = {
            "schemaVersion": 1,
            "environment": "*",
            "depends": {
                "fabric-api-base": "*",
                "fabric": "*",
                "minecraft": ">=1.16.0"
            },
            "name": meta.name,
            "id": pid,
            "version": meta.version || "1.0.0",
            "description": meta.description.replaceAll("\n", "\\n").replaceAll("\r", ""),
            "license": "Unknown",
            "pack_format": meta.pack_format || 6
        }
        if (meta.icon) outdata.icon = "pack.png";
        if (meta.authors) outdata.authors = data.meta.authors.split(",").map(function(e) {return e.trim()});
        
        var zip = new JSZip();
        zip.file("fabric.mod.json", JSON.stringify(outdata));
        if (meta.icon) zip.file("pack.png", meta.icon.substring(22), {"base64": true});
        zip.folder("META-INF").file("MANIFEST.MF", "Manifest-Version: 1.0\n\n");
        
        createData(zip.folder("data"));
        
        zip.generateAsync({"type": "blob"}).then(function(content) {
            saveAs(content, data.meta.id+".jar");
        });
    } catch (err) {
        console.error(err);
        alert("Could not export to mod;\n" + err)
    } finally {
        unblock();
    }
}

function transformData(iData) {
    for (let [k, v] of Object.entries(iData)) {
        if (k == "o__") {
            for (let [name, nData] of Object.entries(v)) {
                iData[name] = nData;
            }
            delete iData[k];
        }
        else if (typeof(v) == "object") transformData(v);
    }
    return iData;
}

function createFile(folder, id, iData, type, path, dName=".json") {
    console.log()
    // stringify data
    var sData = iData;

    if (typeof(iData) == "object") sData = JSON.stringify(transformData(iData), null, 4);

    // Get ID
    var sid = id;
    var namespace = pid;
    var cIndex = id.indexOf(":");
    if (cIndex != -1) {
        namespace = id.substring(0, cIndex);
        sid = id.substring(cIndex+1);
    }
    if (sid.indexOf(".") == -1) sid += dName;

    // Create File
    var loc = folder.folder(namespace);
    if (type) loc = loc.folder(type);
    if (path) loc = loc.folder(path);
    loc.file(sid, sData);
}

function createData(dFolder) {
    "use strict";
    for (const [type, typeData] of Object.entries(JSON.parse(JSON.stringify(data)))) {
        if (type[type.length-1] != "/") {
            if (type != "meta" && type != "$") {
                // TODO: Handle files outside of a folder
                createFile(dFolder, type, typeData);
            }
        } else {
            // Handle folders
            createRData(dFolder, typeData, type);
        }
    }
}
function createRData(dFolder, itemData, type, path="") {
    for (const [id, iData] of Object.entries(itemData)) {
        if (id[id.length-1] != "/") {
            // Handle leafy files
            switch (type) {
                case "functions/":
                    createFile(dFolder, id, iData, type, path, ".mcfunction");
                    break;
                case "data_scripts/":
                    // This is where the compiler should actually kick in
                    //createFile(dFolder, id, iData, type, path, ".mcds");
                    break;
                default:
                    createFile(dFolder, id, iData, type, path);
                    break;
            }
        } else {
            // Handle folders
            createRData(dFolder, iData, type, path + id);
        }
    }
}

function downloadRaw() {
    "use strict";
    saveAs(new Blob([JSON.stringify(data, null, 4)], {type: "text/plain;charset=utf-8"}), pid+".json");
}
function downloadActiveRaw() {
    var d = activeParent[activeUName];
    if (typeof(d) == "object") {
        saveAs(new Blob([JSON.stringify(d, null, 4)], {type: "text/plain;charset=utf-8"}), pid+".json");
    } else {
        saveAs(new Blob([d], {type: "text/plain;charset=utf-8"}), pid+".txt");
    }
}
function downloadOther() {
    var d = activeParent[activeUName];
}