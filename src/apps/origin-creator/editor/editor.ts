import { build, resolve } from "./build";
import { JSONED } from "./global";
import { load, updatePanels } from "./load";
import { $, update } from "..";
import { PROJECT } from "../projects";

// Primitives
type SString = {
    type: "string"
    default?: string
    allow?: string
    name?: boolean // Special attribute that makes this update the name of the slot and header
    nonempty?: boolean // If this is set and the field becomes empty, sets to default.
    ext?: boolean // Whether or not this should actually be a textarea instead of an input,
    large?: boolean // If ext only
}
type SNumber = {
    type: "number" | "float"
    default?: number
    min?: number
    max?: number
}
type SInteger = {
    type: "integer" | "int"
    default?: number
    min?: number
    max?: number
}
type SBoolean = {
    type: "boolean" | "bool"
    default?: boolean
}
type SConst = {
    type: "const"
    const: string | number | boolean
}
type SImage = {
    type: "image"
    width?: number
    height?: number
}

// Non-primitives
type SLink = {
    type?: "link"
    link: string
    id?: string // For linking to an external schema
}
export type SEnum = {
    type?: "enum"
    enum: (string | number | boolean | null)[]
    more?: {[key: string]: {[field: string]: ISchema}}
    ns?: string
    norepr?: boolean
    default?: number
    unspec?: boolean
    convert?: {[key: string]: string}
    talias?: {[more: string]: {[field: string]: string}} // Precalculated
}
type SOr = {
    type?: "or"
    nopanel?: boolean
    or: ISchema[]
    shared?: {[key: string]: ISchema} // A list of properties shared by all "object" types in "or". Shared properties come before other properties.
    default?: number
    unspec?: boolean | string
}

// Object based
export type SList = {
    type: "list"
    vals: ISchema
    show?: boolean
    large?: boolean // If textlist only
    // default?: any[]
}
type STuple = {
    type: "tuple"
    vals: ISchema[]
}
type SObject = {
    type: "object"
    props?: {[field: string]: ISchema}
    extra?: SExtra
    show?: boolean
    showpanel?: boolean
    ikeys?: Set<string>
    more?: Set<string>
    talias?: {[field: string]: string} // Precalculated
}

// General
export type SGeneral = {
    title?: string
    desc?: string
    href?: string
    gap?: boolean | "before" | "after" | "both"
    hooks?: string[]
    aliases?: string[]
}

// Group them all up
export type ISchema = SGeneral & (
    SString | SNumber | SInteger | SBoolean | SConst | SImage |
    SLink | SEnum | SOr |
    SList | STuple | SObject
    // | SExtends
)

export type SExtra = ISchema & {    
    allowkey?: string
}

export type Schema = ISchema & {
    links?: {[key: string]: ISchema}
}

export type MSchema = {[key: string]: ISchema}

export class Editor {
    id: string

    constructor(id: string, schema: Schema) {
        // See if editor can be created
        const div = document.getElementById(id);
        if (div == null) console.error("Editor id is null!", id, schema);

        if (!div || div.tagName != "DIV") throw Error(`Cannot find a div with the id "${id}"`);
        if (div.getAttribute("editor")) throw Error(`An editor already exists with the id "${id}"`);

        // Build htmls
        this.id = id;

        // Load schema
        JSONED.schemas[id] = schema;

        // Resolve root object schema, which must have show set to true by default
        let ischema = resolve(schema, id);
        if (ischema.type == "object") ischema.show = true;
        div.setAttribute("jtype", ischema.type);

        // Build all htmls so we can use them
        for (const [link, data] of Object.entries(schema.links ?? {})) {
            JSONED.htmls[id+"-link-"+link] = build(data, id);
        }
        JSONED.htmls[id + "-root"] = build(schema, id);

        // Remove all links (Actually handled by index.tsx now for external link safety)
        // function fixLinks(html: string): string {
        //     const links = new Set();
        //     let out = html;

        //     while (out.includes("<@")) {
        //         out = out.replace(/<@(.*?)>/g, (_, link) => {
        //             if (links.has(link)) throw Error(`infinite illegal recursive loop in link "${unescape(link)}".`);
        //             links.add(link);
        //             return JSONED.htmls[id]["link-" + unescape(link)];
        //         });
        //     }
        //     return out;
        // }
        // for (const [k, html] of Object.entries(this.htmls)) {
        //     this.htmls[k] = fixLinks(html);
        // }
    }

    reset() {
        // Begin by replacing all exiting html in the div with the prebuilt one

        const div = document.getElementById(this.id);
        if (div == null) console.error("Editor id is null!", this.id);

        div.innerHTML = JSONED.htmls[this.id + "-root"];

        // Now reload
        // this.reload();
    }
    reload() {
        load(this.id, PROJECT.parent, PROJECT.active, $(`#${this.id}[jtype]`), JSONED.schemas[this.id]);
        updatePanels();
        update(false);
    }
}
