
function importThing(e) {
    if (e.target.files.length) {
        var zip = new JSZip();
        zip.loadAsync(e.target.files[0]).then(function() {
            // Honestly, screw async. People shouldn't be doing anything while importing.
            // Blocks an extra time to make time for this function to run fully.
            block(3, function() {
                save();
                location.reload(); // FIXME: HACK: Lazy, but whatever.
            });
            
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
                        
                        if (names[0] == "data" && names.length > 2) {
                            var idata = JSON.parse(o);
                            var id = names[1] + ":" + names.slice(3, -1).join("/");
                            
                            switch (names[2]) {
                                case "origin_layers":
                                    if (!data.layer[id]) {
                                        $("#layers-group>.newitem").before(`<option class="ocitem" value="layer-${id}">${id}</option>`)
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
                                case "origins":
                                    if (!data.origin[id]) {
                                        $("#origins-group>.newitem").before(`<option class="ocitem" value="layer-${id}">${id}</option>`)
                                    }
                                    
                                    data.origin[id] = idata;
                                    break;
                                case "powers":
                                    if (!data.power[id]) {
                                        $("#powers-group>.newitem").before(`<option class="ocitem" value="layer-${id}">${id}</option>`)
                                    }
                                    data.power[id] = idata;
                                    break;
                            }
                        }
                    } catch (err) {
                        console.log("'" + file + "' IS NOT A VALID FILE");
                    } finally {
                        unblock();
                    }
                }, function() {unblock()})
            }
            
            // Unblock once to counteract extra block at beginning
            unblock();
        }, function () {});
    }
    e.target.value = "";
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
    
    // Create origins
    for (const [id, lData] of Object.entries(data.origin)) {
        createFile(dFolder, id, "origins", lData);
    }
    
    // Create powers
    for (const [id, lData] of Object.entries(data.power)) {
        createFile(dFolder, id, "powers", lData);
    }
}