import {snakeCase} from "lodash";
import JSZip from "jszip";
import React from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Dialog, DialogActions, DialogTitle, DialogContent, Button, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, Box, TextField, Select, InputLabel, MenuItem, Snackbar, Checkbox, FormGroup, Grid } from "@material-ui/core";

import { $, DEFAULT_FORMAT, Icon, viewSection } from "..";
import { PROJECT, save, updateName } from "../projects";
import { refreshTree, makeTree, newFolder } from "./jstree";
import { archive } from "../editor/export";
import { extract, include } from "../editor/import";
import { oc } from "../editor/api";
import { JSONED } from "../editor/global";
import { PresetSchema } from "../editor/schema";

// NOTE: Could possibly be added to API.
function touchItem(item: string) {
    let loc = PROJECT.data;
    for (const folder of item.split("/")) {
        if (folder == "") continue;
        if (!(folder in loc)) loc[folder] = {};
        loc = loc[folder];
    }
}
function usePreset(preset: PresetSchema, optional: boolean = false) {
    for (const item of preset.items) touchItem(item);
    if (optional && preset.optional) {
        for (const item of preset.optional) touchItem(item);
    }
}

function ProjectsButton(props) {
    return <button title="Open the projects panel." onClick={() => viewSection("projects")}>
        <Icon type="folder"/>
    </button>;
}
function HelpButton(props) {
    return <button title="Open the help panel." onClick={() => viewSection("help")}>
        <Icon type="question"/>
    </button>;
}

function AddTypeButton(props) {
    return <button title="Add a root folder to the datapack." onClick={() => newFolder("#")}>
        <Icon type="folder-plus"/>
    </button>;
}

let importZip: JSZip = null as any;

function ImportButton(props) {
    const [importOpen, setImportMenuOpen] = React.useState(false);
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snack, setSnack] = React.useState({
        message: "",
        severity: "success" as any
    });

    const handleImportMenuOpen = () => setImportMenuOpen(true);
    const handleImportMenuClose = () => setImportMenuOpen(false);
    const handleSnackOpen = () => setSnackOpen(true);
    const handleSnackClose = () => setSnackOpen(false);

    const [mode, setMode] = React.useState("replace");
    const modeChange = (e) => setMode(e.target.value);

    const [autoDef, setAutoDef] = React.useState(true);
    const autoDefChange = (e) => setAutoDef(e.target.checked);

    const [assetz, setAssetz] = React.useState(true);
    const assetzChange = (e) => setAssetz(e.target.checked);

    const [renameMerge, setRenameMerge] = React.useState(false);
    const renameMergeChange = (e) => setRenameMerge(e.target.checked);

    function showSnack(message: string, severity: string = "info") {
        setSnack({message, severity});
        handleSnackOpen();
    }
    PROJECT.showSnack = showSnack;

    function importFile(file: File, limitEnabled: boolean) {
        // Normal file and not a datapack.
        if (["exe", "jar", "bat", "sh", "zip"].includes(file.name.substr(file.name.lastIndexOf(".")+1))) {
            showSnack("Cannot embed filetype in datapack. Make sure it's a valid file!", "error");
            return;
        }
        if (limitEnabled && file.size > 1024*256) {
            showSnack("File is too large to import (>256KB)", "error");
            return;
        }

        if (file.size > 1024*128) showSnack("File is very large (>128KB)", "warning");

        try {
            include(file);
        } catch (err) {
            console.error(err);
            showSnack("Failed to import file. Ask in the Creator's Discord.", "error");
        }
    }

    PROJECT.handleImport = async function(files: FileList) {
        const limitEnabled = !globalThis.offline && !($('#disable-file-limit') as HTMLInputElement).checked;

        if (files.length > 1) {
            for (const file of files) {
                // console.log(file.type);

                if (file.name.endsWith(".jsonoc")) {
                    showSnack("Cannot import .jsonoc file in multi-import.", "error");
                    return;
                }

                try {
                    const testZip = await JSZip.loadAsync(file);
                    showSnack("Cannot load zip file in multi-import.", "error");
                    return;
                } catch (err) {}

                try {
                    importFile(file, limitEnabled);
                } catch (err) {
                    console.error(err);
                    showSnack("Failed to import file. Ask in the Creator's Discord.", "error");
                }
            }
        } else if (files.length == 1) {
            const file = files[0];

            try {
                if (file.name.endsWith(".jsonoc")) {
                    if (limitEnabled && file.size > 1024*1024) {
                        showSnack("Pack is too large to import (>1MB)", "error");
                        return;
                    }

                    if (file.size > 1024*512) showSnack("Pack is very large (>512KB)", "warning");

                    PROJECT.data = JSON.parse(await file.text());
                    save();
                    location.reload(); // Because I am lazy

                    return;
                }

                // It's a zip file, see if it's a pack. If not, we throw an error to import it as a file.
                let zip = await JSZip.loadAsync(file);
                if (!(
                    "fabric.mod.json" in zip.files ||
                    Object.keys(zip.files).reverse().some((v) => {
                        const out = v.match(/^\/?([^/]+\/)?pack.mcmeta$/);
                        if (out) zip = zip.folder(out[1])!;
                        return !!out;
                    })
                )) throw Error();

                if (limitEnabled && file.size > 1024*1024) {
                    showSnack("Pack is too large to import (>1MB)", "error");
                    return;
                }

                if (file.size > 1024*512) showSnack("Pack is very large (>512KB)", "warning");

                try {
                    importZip = zip;
                    handleImportMenuOpen();
                } catch (err) {
                    console.error(err);
                    showSnack("Failed to import pack. Ask in the Creator's Discord.", "error");
                }
            } catch (err) {
                try {
                    importFile(file, limitEnabled);
                } catch (err) {
                    console.error(err);
                    showSnack("Failed to import file. Ask in the Creator's Discord.", "error");
                }
            }
        }
    };

    return <>
        <button title="Import a file or an entire datapack." onClick={() => $("#importer")?.click()}>
            <Icon type="file-earmark-plus"/>
        </button>
        <input id="importer" type="file" style={{display: "none"}} onChange={(e) => e.target.files ? PROJECT.handleImport(e.target.files) : undefined}/>

        <Dialog open={importOpen} onClose={handleImportMenuClose}>
            <DialogTitle>Import Pack</DialogTitle>
            <DialogContent>
                <Box>
                    <FormControl>
                        <FormLabel component="legend" style={{marginBottom: "6px"}}>Import Mode</FormLabel>
                        <RadioGroup aria-label="mode" name="mode" value={mode} onChange={modeChange}>
                            <FormControlLabel value="replace" control={<Radio/>} label="Replace"/>
                            <FormControlLabel value="minimal" control={<Radio/>} label="Replace (Minimal)"/>
                            <FormControlLabel value="merge" control={<Radio/>} label="Merge"/>
                        </RadioGroup>
                    </FormControl>
                    <FormControl style={{marginTop: "10px"}}>
                        <FormLabel component="legend" style={{marginBottom: "6px"}}>Options</FormLabel>
                        <FormGroup>
                            <FormControlLabel label="Guess Pack ID If Empty" control={
                                <Checkbox checked={autoDef} onChange={autoDefChange}/>
                            }/>
                            <FormControlLabel control={<Checkbox checked={assetz} onChange={assetzChange}/>} label="Include Assets"/>
                            {/* <FormControlLabel control={<Checkbox checked={renameMerge && mode == "merge"} disabled={mode != "merge"} onChange={renameMergeChange}/>} label="Rename Merge Conflicts"/> */}
                        </FormGroup>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleImportMenuClose} color="primary">Cancel</Button>
                <Button onClick={() => {
                    if (mode == "minimal" || mode == "replace") {
                        // Deselect selected element
                        const tree = window["filetree"];
                        tree.deselect_all(true);
                        viewSection("projects");

                        // Update project data
                        PROJECT.parent = {};
                        PROJECT.active = "";
                        const pmeta = {name: thename};
                        if (!autoDef) pmeta["id"] = snakeCase(thename).replace(/[^A-Za-z0-9_]+/g, "").replace(/^\d/, "d");
                        PROJECT.data = {meta: pmeta};
                    }

                    PROJECT.changeTrees = {};
                    PROJECT.changeTree = null;

                    extract(importZip, mode != "merge", assetz, renameMerge);

                    if (mode == "replace") {
                        // Automatically figure out which preset best fits the imported pack
                        const mschema = JSONED.getCurrentSchema();
                        let use_preset = Object.values(mschema.items.presets)[0];
                        presetLoop:
                        for (const preset of Object.values(mschema.items.presets)) {
                            if (!preset.identifiers) continue;
                            for (const identifier of preset.identifiers) {
                                // TODO: make the identifiers regular expressions or something.
                                // Could become expensive for larger zips.
                                if (identifier in importZip.files) {
                                    use_preset = preset;
                                    break presetLoop;
                                }
                            }
                        }
                        usePreset(use_preset);
                    }

                    handleImportMenuClose();
                }} color="primary">Import</Button>
            </DialogActions>
        </Dialog>

        <Snackbar anchorOrigin={{vertical: "top", horizontal: "center"}} open={snackOpen} autoHideDuration={30000} onClose={handleSnackClose}>
            <Alert onClose={handleSnackClose} variant="filled" severity={snack.severity} style={{width: "100%"}}>
                {snack.message.split("\n").map((m, i) => <p key={i}>{m}</p>)}
            </Alert>
        </Snackbar>
    </>;
}

function* scan(data: {[k: string]: any}): Iterable<string> {
    for (const v of Object.values(data)) {
        if (typeof v == "string") {
            if (/^[a-z0-9_.-]+:([a-z0-9_.-]+\/)*[a-z0-9_.-]+$/.test(v)) {
                yield v;
            }
        } else if (typeof v == "object") {
            for (const i of scan(v)) yield i;
        }
    }
}

export function check(): {[key: string]: string[]} {
    const errors = {
        unknown: [] as string[],
        unusedPowers: [] as string[],
        unlayeredOrigins: [] as string[],
        emptyOrigins: [] as string[],
        nullFiles: [] as string[]
    };

    // Collect all ids in the project (including subpowers)
    const ids = new Set();

    for (const f of oc.listAndRead(undefined, true)) {
        const [type, id] = oc.getTypedID(f[0], true);

        if (type == "power" && f[1]?.type == "origins:multiple") {
            for (const o in f[1]) {
                if (["name", "description", "badges", "hidden", "loading_priority", "type"].includes(o)) continue;

                ids.add(id+"_"+o);
            }
        }

        ids.add(id);
    }

    // Check for unknown ids
    const pid = oc.id;

    const powers = new Set(oc.listFiles("powers/").map(f => oc.getTypedID(f, true)[1]));

    for (const [f, content] of oc.listAndRead(undefined, true)) {
        if (content == null) {
            errors.nullFiles.push(`File "${f}"`);
            continue;
        }

        let [typ, fid] = oc.getTypedID(f);
        typ = oc.startCase(typ);

        for (const nsid of scan(content)) {
            let [ns, id] = nsid.split(":");
            let tid = nsid;

            if (ns == "0" || ns == pid) {
                tid = pid + ":" + id;
                if (!ids.has(tid)) {
                    errors.unknown.push(`${typ} "${fid}" uses id "${nsid}"`);
                }
            }

            powers.delete(tid);
        }
    }

    // Check for unused powers
    for (const power of powers) {
        errors.unusedPowers.push(power.replace(RegExp("^"+oc.id+":"), "0:"));
    }

    // Check for unlayered and empty origins
    const layeredOrigins = new Set<string>();

    for (const [f, content] of oc.listAndRead("origin_layers/", true)) {
        if (typeof content != "object") continue;

        for (const o of (content?.origins || [])) {
            if (typeof o == "string") {
                const x = oc.locatePath("origins", o);
                layeredOrigins.add(x);
            } else {
                for (const oo of (o?.origins || [])) {
                    const x = oc.locatePath("origins", oo);
                    layeredOrigins.add(x);
                }
            }
        }
    }
    for (const [f, content] of oc.listAndRead("origins/", true)) {
        if (!layeredOrigins.has(f)) {
            const [typ, id] = oc.getTypedID(f);
            errors.unlayeredOrigins.push(id);
        }

        if (typeof content != "object" || !content.powers || !content.powers.length) {
            const [typ, id] = oc.getTypedID(f);
            errors.emptyOrigins.push(id);
        }
    }

    // console.log(errors);
    return errors;
}

function ExportErrors(props) {
    const alerts: any[] = [];
    let total = 0;

    if (!localStorage.getItem("ocdew")) {
        try {
            const errors = check();

            total = 0;
            for (const [k, v] of Object.entries(errors)) {
                total += v.length;
            }

            if (errors.nullFiles.length > 0) {
                alerts.push(<Alert key="nullFiles" severity="error">
                    <AlertTitle>These files have NULL contents!<br/><em>REPORT HOW YOU GOT THEM TO MATHGENIUSZACH IMMEDIATELY!</em></AlertTitle>
                    {errors.nullFiles.map((e, i) => <span key={i}>{e}<br/></span>)}
                </Alert>);
            }

            if (errors.unknown.length > 0) {
                alerts.push(<Alert key="unknown" severity="warning">
                    <AlertTitle>These files reference unknown ids.<br/><em>Check them for typos!</em></AlertTitle>
                    {errors.unknown.map((e, i) => <span key={i}>{e}<br/></span>)}
                </Alert>);
            }

            if (errors.unlayeredOrigins.length > 0) {
                alerts.push(<Alert key="unlayeredOrigns" severity="warning">
                    <AlertTitle>These origins are not in origin layers.<br/><em>Add them to one for them to show up in-game!</em></AlertTitle>
                    {errors.unlayeredOrigins.map((e, i) => <span key={i}>{e}<br/></span>)}
                </Alert>);
            }

            if (errors.emptyOrigins.length > 0) {
                alerts.push(<Alert key="emptyOrigins" severity="warning">
                    <AlertTitle>These origins have no powers.<br/><em>Give them at least one to make them do something!</em></AlertTitle>
                    {errors.emptyOrigins.map((e, i) => <span key={i}>{e}<br/></span>)}
                </Alert>);
            }

            if (errors.unusedPowers.length > 0) {
                alerts.push(<Alert key="unusedPowers" severity="warning">
                    <AlertTitle>These powers are unused.<br/><em>Add them to at least one origin for them to function!</em></AlertTitle>
                    {errors.unusedPowers.map((e, i) => <span key={i}>{e}<br/></span>)}
                </Alert>);
            }
        } catch (err) {
            console.error(err);
            total += 1;
            alerts.push(<Alert key="export-warning-error" severity="error">
                <AlertTitle>ERROR LOADING EXPORT WARNINGS!<br/><em>EXPORT AS JSONOC AND REPORT TO MATHGENIUSZACH IMMEDIATELY!</em></AlertTitle>
                {String(err)}
            </Alert>);
        }

        return <>
            <FormControl>
                <FormLabel component="legend">Export Warnings ({total})</FormLabel>
                <Grid container direction="column" wrap="nowrap" style={{overflowY:"scroll",maxHeight:"500px",marginTop:"7px",gap:"8px"}}>
                    {alerts}
                </Grid>
            </FormControl>
        </>;
    } else {
        return <></>;
    }

}

function ExportButton(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [type, setType] = React.useState("datapack");
    const typeChange = (e) => setType(e.target.value);


    return <>
        <button title="Export the project as a datapack or mod." onClick={handleOpen}>
            <Icon type="download"/>
        </button>
        <Dialog open={open} onClose={handleClose} maxWidth={false}>
            <DialogTitle>Export Pack</DialogTitle>
            <DialogContent>
                <Grid container direction="row" wrap="nowrap">
                    <Grid item>
                        <FormControl>
                            <FormLabel component="legend">Export Type</FormLabel>
                            <RadioGroup aria-label="type" name="type" value={type} onChange={typeChange}>
                                <FormControlLabel value="json" control={<Radio/>} label="JsonOC File"/>
                                <FormControlLabel value="datapack" control={<Radio/>} label="Datapack & Resourcepack"/>
                                <FormControlLabel value="poly" control={<Radio/>} label="Poly Mod (Forge & Fabric)"/>
                                <FormControlLabel value="forge" control={<Radio/>} label="Forge Only Mod"/>
                                <FormControlLabel value="fabric" control={<Radio/>} label="Fabric Only Mod"/>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <ExportErrors></ExportErrors>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button onClick={() => {archive(type); handleClose();}} color="primary">Download</Button>
            </DialogActions>
        </Dialog>
    </>;
}

let thename = "My Pack";
function ResetButton(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [type, setType] = React.useState("vanilla");
    const typeChange = (e) => setType(e.target.value);

    const [ver, setVer] = React.useState(DEFAULT_FORMAT);
    const verChange = (e) => setVer(e.target.value);

    const [assetz, setAssetz] = React.useState(true);
    const assetzChange = (e) => setAssetz(e.target.checked);

    const pack_format = parseInt(ver as any);
    const mschema = JSONED.getSchema(pack_format);

    const presets = [];
    for (const [value, preset] of Object.entries(mschema.items.presets)) {
        presets.push(<FormControlLabel value={value} control={<Radio/>} label={preset.name}/>);
    }

    return (<>
        <button title="Delete the whole project and start anew." onClick={handleOpen}>
            <Icon type="arrow-counterclockwise"/>
        </button>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Reset Pack</DialogTitle>
            <DialogContent>
                <Box>
                    <TextField defaultValue={thename} label="Display Name" onChange={(e) => {thename = e.target.value;}}/>
                    <FormControl>
                        <InputLabel>Pack Version</InputLabel>
                        <Select value={ver} onChange={verChange}>
                            <MenuItem value={6}>1.16.x</MenuItem>
                            <MenuItem value={7}>1.17.x</MenuItem>
                            <MenuItem value={8}>1.18.0-1</MenuItem>
                            <MenuItem value={9}>1.18.2+</MenuItem>
                            <MenuItem value={10}>1.19.0-3</MenuItem>
                            <MenuItem value={12}>1.19.4</MenuItem>
                            <MenuItem value={15}>1.20.0-1</MenuItem>
                            <MenuItem value={18}>1.20.2</MenuItem>
                            <MenuItem value={26}>1.20.3-4</MenuItem>
                            <MenuItem value={41}><span style={{color: "red"}}>1.20.5-6*</span></MenuItem>
                            <MenuItem value={48}><span style={{color: "red"}}>1.21.0-1*</span></MenuItem>
                            <MenuItem value={57}><span style={{color: "red"}}>1.21.2-3*</span></MenuItem>
                            <MenuItem value={61}><span style={{color: "red"}}>1.21.4*</span></MenuItem>
                            <MenuItem value={71}><span style={{color: "red"}}>1.21.5*</span></MenuItem>
                            <MenuItem value={80}><span style={{color: "red"}}>1.21.6*</span></MenuItem>
                            <MenuItem value={81}><span style={{color: "red"}}>1.21.7-8*</span></MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                    <FormControl>
                        <FormLabel component="legend">Type</FormLabel>
                        <FormGroup>
                            <RadioGroup aria-label="type" name="type" value={type in mschema.items.presets ? type : "blank"} onChange={typeChange}>
                                {presets}
                                <FormControlLabel value="blank" control={<Radio/>} label="Blank Project"/>
                            </RadioGroup>
                            <FormControlLabel control={<Checkbox checked={assetz && type != "blank"} disabled={type == "blank"} onChange={assetzChange}/>} label="Include Assets"/>
                        </FormGroup>
                    </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button onClick={() => {
                    // Deselect selected element
                    const tree = window["filetree"];
                    tree.deselect_all(true);
                    viewSection("projects");

                    // Update project data
                    PROJECT.parent = {};
                    PROJECT.active = "";
                    PROJECT.data = {
                        meta: {
                            name: thename,
                            id: snakeCase(thename).replace(/[^A-Za-z0-9_]+/g, "").replace(/^\d/, "d"),
                            pack_format: pack_format,
                            version: "1.0.0"
                        }
                    };
                    if (type !== "blank" && type in mschema.items.presets) {
                        usePreset(mschema.items.presets[type], assetz);
                    }

                    PROJECT.changeTrees = {};
                    PROJECT.changeTree = null;

                    updateName();
                    save();

                    // Update tree
                    refreshTree();

                    // Close
                    handleClose();
                }} color="primary">Reset</Button>
            </DialogActions>
        </Dialog>
    </>);
}

export class Sidebar extends React.Component {
    componentDidMount() {
        window["filetree"] = makeTree("#filetree");
    }

    render() {
        return (<>
            <h6>&nbsp;</h6>
            <div>
                <ProjectsButton/>
                <HelpButton/>
            </div>
            <div className="panel">
                <div id="filetree"></div>
            </div>
            <div>
                <AddTypeButton/>
                <ImportButton/>
                <ExportButton/>
                <ResetButton/>
            </div>
        </>);
    }
}

// export function InitialPrompt(props) {
//     const [importOpen, setImportMenuOpen] = React.useState(false);
//     return <>
//         <Dialog open={importOpen}>
//             <DialogTitle>Welcome Message</DialogTitle>
//             <DialogContent>
//                 Please read this. Please. Pretty please?<br/>
//                 If you don't... your datapacks will be forever cursed.<br/>
//                 <br/>
//                 The home page behind you
//             </DialogContent>
//         </Dialog>
//     </>;
// }