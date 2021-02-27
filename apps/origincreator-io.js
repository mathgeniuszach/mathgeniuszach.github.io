
function importThing(thing) {
    if (thing.target.files.length) {
        var file = thing.target.files[0];
        var zip = new JSZip();
        zip.loadAsync(file).then(function() {
            // Honestly, screw async. People shouldn't be doing anything while importing.
            // Blocks an extra time to make time for this function to run fully.
            block(3, function() {
                save();
                //location.reload(); // FIXME: HACK: Lazy, but whatever.
            });
            changeScreen("help");
            
            // Load metadata
            var mcmeta = zip.file("pack.mcmeta");
            var fabric = zip.file("fabric.mod.json")
            if (mcmeta) {
                mcmeta.async("text").then(function(o) {
                    try {
                        Object.assign(data.meta, JSON.parse(o).pack);
                        $("#side-main-head").text(data.meta.name);
                        $("#div-meta h2").text("pack - " + data.meta.name);
                    } finally {
                        unblock();
                    }
                }, function() {unblock()});
            } else if (fabric) {
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
                    } finally {
                        unblock();
                    }
                }, function() {unblock()});
            } else {
                unblock(2); // Exiting early means close unblock
                return;
            };
            
            // Load icon (if available)
            var icon = zip.file("pack.png");
            if (icon) icon.async("base64").then(function (o) {
                data.meta.icon = "data:image/png;base64,"+o;
                unblock();
            }, function () {unblock()})
            
            // Load content
            var dFolder = zip.folder("data");
            block(Object.keys(dFolder.files).length-1);
            
            for (const [file, filedata] of Object.entries(dFolder.files)) {
                filedata.async("text").then(function(o) {
                    try {
                        var names = file.split(/[/.]/g);
                        
                        if (names[0] == "data" && names.length > 2 && names[names.length-1]) {
                            var id = names[1] + ":" + names.slice(3, -1).join("/");
                            var type = names[2].substring(0, names[2].length-1);

                            var idata
                            try {
                                idata = JSON.parse(o);
                            } catch (err) {
                                loadOther(names, o);
                                unblock();
                                return;
                            }
                            
                            switch (names[2]) {
                                case "origin_layers":
                                    if (!data.layer[id]) {
                                        $("#layers-group>.newitem").before(`<option class="ocitem" value="layer-${id}">${id}</option>`);
                                    }
                                    
                                    let origins = [];
                                    let cOrigins = [];
                                    data.layer[id] = {
                                        "replace": idata.replace,
                                        "origins": origins,
                                        "conditional_origins": cOrigins
                                    };
                                    for (let v of idata.origins) {
                                        if (typeof(v) == "string") {
                                            origins.push(v);
                                        } else {
                                            cOrigins.push(v);
                                        }
                                    }
                                    break;
                                case "tags":
                                    if (!data[type][id]) {
                                        $("#" + type + "s-group>.newitem").before(`<option class="ocitem" value="${type}-${id}">${id}</option>`);
                                    }
                                    
                                    let values = [];
                                    let rValues = [];
                                    data.tag[id] = {
                                        "replace": idata.replace,
                                        "values": values,
                                        "required_values": rValues
                                    };
                                    for (let v of idata.values) {
                                        if (typeof(v) == "string") {
                                            values.push(v);
                                        } else {
                                            rValues.push(v);
                                        }
                                    }
                                    break;
                                case "origins":
                                case "powers":
                                    if (!data[type][id]) {
                                        $("#" + type + "s-group>.newitem").before(`<option class="ocitem" value="${type}-${id}">${id}</option>`);
                                    }
                                    data[type][id] = idata;
                                    break;
                                default:
                                    loadOther(names, o);
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    } finally {
                        unblock();
                    }
                }, function() {unblock()})
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
function loadOther(names, o) {
    var id = names[1] + ":" + names.slice(0, -1).join("/") + "." + names[names.length-1];
    if (!data.other[id]) {
        $("#others-group>.newitem").before(`<option class="ocitem" value="other-${id}">${id}</option>`);
    }
    data.other[id] = {"data": o};
}

function exportDatapack() {
    "use strict";
    
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
}

function exportMod() {
    "use strict";
    
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
            "minecraft": ">=1.16.0",
            "origins": ">=0.4.7"
        },
        "name": meta.name,
        "id": pid,
        "version": meta.version || "1.0.0",
        "description": meta.description.replace("\n", "\\n").replace("\r", ""),
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
}

function createFile(folder, id, sub, data) {
    var sid = id.split(/[:/]/g);
    if (sid.length > 1) {
        // Create folder structure
        var loc = folder.folder(sid[0]).folder(sub);
        for (let i = 1; i < sid.length-1; i++) {
            loc = loc.folder(sid[i]);
        }

        // Create
        loc.file(sid[sid.length-1]+".json", JSON.stringify(data, null, 4));
    }
}

function createData(dFolder) {
    // Create origin layers
    for (const [id, lData] of Object.entries(data.layer)) {
        let origins = lData.origins;
        if (lData.conditional_origins) origins = origins.concat(lData.conditional_origins);
        
        createFile(dFolder, id, "origin_layers", {
            "replace": lData.replace || false,
            "origins": origins
        });
    }
    
    // Create a bunch of stuff
    for (const type of ["origin", "power"]) {
        for (const [id, lData] of Object.entries(data[type])) {
            createFile(dFolder, id, type+"s", lData);
        }
    }

    // Create tags
    for (const [id, lData] of Object.entries(data.tag)) {
        let values = lData.values;
        if (lData.required_values) values = values.concat(lData.required_values);

        createFile(dFolder, id, "tags", {
            "replace": lData.replace || false,
            "values": values
        });
    }
}

function downloadRaw() {
    saveAs(new Blob([JSON.stringify(data, null, 4)], {type: "text/plain;charset=utf-8"}), pid+".json");
}