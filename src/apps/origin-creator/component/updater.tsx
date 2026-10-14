import JSZip from "jszip";
import React from "react";
import { saveAs } from "file-saver";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";

import { Icon } from "..";
import { fileMapToZip, findDatapackRoot, formatLogEntry, updateDatapack, zipToFileMap } from "../updater";
import type { FileMap, LogEntry, LogLevel, UpdateResult } from "../updater";

const PACK_FORMATS: Record<number, string> = {
    15: "1.20 - 1.20.1",
    18: "1.20.2",
    26: "1.20.3 - 1.20.4",
    41: "1.20.5 - 1.20.6",
    48: "1.21 - 1.21.1",
};

const LEVEL_STYLE: Record<LogLevel, { icon: string; color: string }> = {
    INFO: { icon: "●", color: "#4caf50" },
    WARNING: { icon: "▲", color: "#ff9800" },
    ERROR: { icon: "✖", color: "#f44336" },
};

const MAX_ROWS = 500;

interface PackInfo {
    name: string;
    size: number;
    root: string;
    packFormat: number | null;
    powers: number;
    origins: number;
    files: number;
}

type Status = "idle" | "loading" | "invalid" | "ready" | "working" | "done";
type Filter = "ALL" | LogLevel;

function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

function readPackFormat(files: FileMap, root: string): number | null {
    const raw = files.get(root + "pack.mcmeta");
    if (raw === undefined) return null;
    try {
        const text = typeof raw === "string" ? raw : new TextDecoder().decode(raw);
        const format = JSON.parse(text.replace(/^\uFEFF/, ""))?.pack?.pack_format;
        return typeof format === "number" ? format : null;
    } catch {
        return null;
    }
}

function countUnder(files: FileMap, prefix: string): number {
    let n = 0;
    for (const p of files.keys()) if (p.startsWith(prefix) && p.endsWith(".json")) n++;
    return n;
}

function inspectPack(files: FileMap, file: File): PackInfo | null {
    const root = findDatapackRoot(files);
    if (root === null) return null;
    const dataPrefix = root + "data/";
    if (![...files.keys()].some((p) => p.startsWith(dataPrefix))) return null;

    let powers = 0;
    let origins = 0;
    for (const p of files.keys()) {
        if (!p.startsWith(dataPrefix) || !p.endsWith(".json")) continue;
        const rest = p.slice(dataPrefix.length).split("/");
        if (rest[1] === "powers") powers++;
        else if (rest[1] === "origins") origins++;
    }
    return { name: file.name, size: file.size, root, packFormat: readPackFormat(files, root), powers, origins, files: files.size };
}

export function UpdaterButton() {
    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = React.useState<Status>("idle");
    const [dragging, setDragging] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [info, setInfo] = React.useState<PackInfo | null>(null);
    const [result, setResult] = React.useState<UpdateResult | null>(null);
    const [filter, setFilter] = React.useState<Filter>("ALL");

    const filesRef = React.useRef<FileMap | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    function reset() {
        filesRef.current = null;
        setStatus("idle");
        setMessage("");
        setInfo(null);
        setResult(null);
        setFilter("ALL");
    }

    function close() {
        if (status === "working") return;
        setOpen(false);
        reset();
    }

    async function loadFile(file: File | undefined) {
        if (!file) return;
        reset();
        setStatus("loading");

        let zip: JSZip;
        try {

            zip = await JSZip.loadAsync(file);
        } catch {
            setStatus("invalid");
            setMessage("Not Zip.");
            return;
        }

        try {
            const files = await zipToFileMap(zip);
            const found = inspectPack(files, file);
            if (!found) {
                setStatus("invalid");
                setMessage("This zip isn't a datapack: it needs a pack.mcmeta and a data folder.");
                return;
            }
            filesRef.current = files;
            setInfo(found);
            setStatus("ready");
        } catch (err) {
            console.error(err);
            setStatus("invalid");
            setMessage("Failed to read the zip. It may be corrupted.");
        }
    }

    async function runUpdate() {
        const files = filesRef.current;
        if (!files || !info) return;
        setStatus("working");

        await new Promise((r) => setTimeout(r, 30));

        try {
            const res = updateDatapack(files);
            const blob = await fileMapToZip(res.files).generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: { level: 9 },
            });
            saveAs(blob, info.name.replace(/\.zip$/i, "") + " (1.21.1).zip");
            filesRef.current = null;
            setResult(res);
            setStatus("done");
        } catch (err) {
            console.error(err);
            setStatus("invalid");
            setMessage("Update failed, Check website Console (F12) and report Bug to FulkorRain's github or discord server.");
        }
    }

    function copyLog() {
        if (result) navigator.clipboard?.writeText(result.logs.map(formatLogEntry).join("\n"));
    }

    const logs: LogEntry[] = result ? result.logs.filter((l) => filter === "ALL" || l.level === filter) : [];

    return (
        <>
            <button title="Open the pack updater (1.20.x to 1.21.1)." onClick={() => setOpen(true)}>
                <Icon type="arrow-repeat" />
            </button>

            <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
                <DialogTitle>Update Pack (1.20.x → 1.21.1)</DialogTitle>
                <DialogContent>
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".zip,application/zip,application/x-zip-compressed"
                        style={{ display: "none" }}
                        onChange={(e) => {
                            loadFile(e.target.files?.[0]);
                            e.target.value = "";
                        }}
                    />

                    {status !== "done" && (
                        <div
                            onClick={() => status !== "working" && inputRef.current?.click()}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragging(true);
                            }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setDragging(false);
                                if (status !== "working") loadFile(e.dataTransfer.files?.[0]);
                            }}
                            style={{
                                border: "2px dashed " + (dragging ? "#2196f3" : "gray"),
                                borderRadius: 6,
                                padding: "28px 12px",
                                textAlign: "center",
                                cursor: status === "working" ? "default" : "pointer",
                                background: dragging ? "rgba(33,150,243,0.08)" : "transparent",
                            }}
                        >
                            <div style={{ fontSize: "1.6rem" }}>
                                <Icon type="file-earmark-zip" />
                            </div>
                            {status === "loading" ? "Reading datapack..." : info ? "Drop or click to pick a different zip" : "Drop a datapack .zip here, or click to browse"}
                        </div>
                    )}

                    {status === "invalid" && <p style={{ color: "#f44336", marginBottom: 0 }}>{message}</p>}

                    {(status === "ready" || status === "working") && info && (
                        <div style={{ marginTop: 14 }}>
                            <b>{info.name}</b> ({formatSize(info.size)})
                            <ul style={{ margin: "6px 0 0 0", paddingLeft: 20 }}>
                                <li>
                                    Valid datapack: {info.files} files, {info.powers} powers, {info.origins} origins
                                </li>
                                <li>
                                    pack_format: {info.packFormat ?? "unknown"}
                                    {info.packFormat !== null && PACK_FORMATS[info.packFormat] ? ` (${PACK_FORMATS[info.packFormat]})` : ""}
                                </li>
                                {info.packFormat !== null && info.packFormat >= 48 && (
                                    <li style={{ color: "#ff9800" }}>Already a 1.21.1 Pack, May not need updates.</li>
                                )}
                            </ul>
                        </div>
                    )}

                    {status === "done" && result && (
                        <>
                            <p style={{ marginTop: 0 }}>
                                Updated <b>{info?.name}</b>. The new zip was downloaded.
                            </p>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                                {(["ALL", "INFO", "WARNING", "ERROR"] as Filter[]).map((f) => (
                                    <Button key={f} size="small" color="primary" variant={filter === f ? "contained" : "outlined"} onClick={() => setFilter(f)}>
                                        {f === "ALL" ? `All (${result.logs.length})` : `${LEVEL_STYLE[f].icon} ${f === "INFO" ? "Changes" : f === "WARNING" ? "Warnings" : "Errors"} (${result.counts[f]})`}
                                    </Button>
                                ))}
                            </div>
                            <div
                                style={{
                                    maxHeight: 320,
                                    overflowY: "auto",
                                    border: "1px solid gray",
                                    borderRadius: 4,
                                    padding: 6,
                                    fontFamily: "monospace",
                                    fontSize: "0.8rem",
                                }}
                            >
                                {logs.length === 0 && <div>Nothing to show.</div>}
                                {logs.slice(0, MAX_ROWS).map((l, i) => (
                                    <div key={i} style={{ padding: "3px 0", borderBottom: "1px solid rgba(128,128,128,0.25)" }}>
                                        <span style={{ color: LEVEL_STYLE[l.level].color }}>{LEVEL_STYLE[l.level].icon}</span> {l.message}
                                        <div style={{ opacity: 0.65 }}>
                                            {l.file || "(datapack)"}
                                            {l.fields}
                                        </div>
                                    </div>
                                ))}
                                {logs.length > MAX_ROWS && <div style={{ paddingTop: 4 }}>...and {logs.length - MAX_ROWS} more. Use "Copy log" to get everything.</div>}
                            </div>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    {status === "done" && (
                        <>
                            <Button onClick={copyLog} color="primary">
                                Copy log
                            </Button>
                            <Button onClick={reset} color="primary">
                                Update another
                            </Button>
                        </>
                    )}
                    <Button onClick={close} color="primary" disabled={status === "working"}>
                        Close
                    </Button>
                    {status !== "done" && (
                        <Button onClick={runUpdate} color="primary" variant="contained" disabled={status !== "ready"}>
                            {status === "working" ? "Updating..." : "Update"}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}
