import { startCase, escape } from "lodash";
import { PROJECT } from "../projects";

import { ISchema, SList, SGeneral } from "./schema";
import { JSONED } from "./global";

export function regescape(s: string) {
    return s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\//g, "\\/");
}

function t(text: string): string {
    return text
        .replace(/[\r\n]+/g, " ")
        .replace(/\s{2,}/g, " ")
        .replace(/> +/g, ">")
        .trim();
}

let n = 0;

// FIXME: I'm pretty sure that maps don't work like this lol
const lbuilds = new Map();
function buildList(s: SList & SGeneral, ver: number, show: boolean = false, named: string | boolean = false, illegal?: string[]) {
    // Resolve links and objects so they can default in a list to be shown
    let val = resolve(s.vals, ver);

    // Handle recursion
    let nn = n;
    if (lbuilds.has(s)) {
        // This item has been built before, so we just use it instead.
        nn = lbuilds.get(s);
    } else {
        // This item has not been built before
        lbuilds.set(s, n);
        n++;

        const title = val.title ? `<span>${escape(val.title)}:&nbsp;</span>` : '';

        // Don't build resolved schema! Links are built remotely, only once.
        const ihtml = build(s.vals, ver, true, false);
        JSONED.htmls[`list-${nn}`] = t(`<div>
            ${named ? `${title}<input type="text" onchange="JSONED.changeListKey(this.parentElement.parentElement, this.value)"${typeof named == "string" ? ` onkeydown='return /[${escape(regescape(named))}]/.test(event.key)'` : ''}>` : ""}
            <button onclick="JSONED.delListItem(this.parentElement.parentElement, ${!!named})"><p class="bi bi-dash"></p></button>
            <button onclick="JSONED.moveListItem(this.parentElement.parentElement, true, ${!!named})"><p class="bi bi-caret-up"></p></button>
            <button onclick="JSONED.moveListItem(this.parentElement.parentElement, false, ${!!named})"><p class="bi bi-caret-down"></p></button>
            <button onclick="JSONED.cloneListItem(this.parentElement.parentElement, ${!!named})"><p class="bi bi-chevron-bar-expand"></p></button>
        </div>`) + ihtml;
    }

    const html = t(`<div key="list-${nn}">
        <button onclick="JSONED.addListItem(this.parentElement, '${escape(val.type)}', ${!!named})"><p class="bi bi-plus"></p></button>
        <button onclick="JSONED.clearListItems(this.parentElement.parentElement, ${!!named})"><p class="bi bi-x"></p></button>
    </div>`);
    const shown = `<div${named ? ' class="nlist"' : ""}${illegal ? ` i=${escape(JSON.stringify(illegal))}` : ""}>${html}</div>`;

    if (s.show ?? show) {
        return shown;
    } else {
        const hhtml = `<button key="sub-${n}" hkey="h-${n}" type="list" onclick="JSONED.toggleObject(this)"><p class="bi bi-$ICON$"></p></button>`;
        const hiddenHtml = hhtml.replace("$ICON$", "plus");
        JSONED.htmls[`code-${n}`] = shown;
        JSONED.htmls[`h-${n}`] = hiddenHtml;
        JSONED.htmls[`sub-${n}`] = hhtml.replace("$ICON$", "dash") + "<br>" + html;

        return `<div shown="${n++}" class="panel">${hiddenHtml}</div>`;
    }
}

// Resolves the given schema to a link, overwriting any fields in the link it finds.
export function resolve(s: ISchema, ver?: number) {
    if (typeof s != "object") throw Error("Cannot resolve non-schema");
    if (!("link" in s)) return s;

    const links = JSONED.mschemas[ver ?? PROJECT.ver].links;

    let out: any = null;

    // Recurse through schema links.
    let ts: ISchema = s;
    while ("link" in ts) {
        // ts has "link" field.
        // If other fields exist, record them.
        if (Object.keys(ts).length > 1) {
            if (out == null) out = {};
            for (const [k, v] of Object.entries(ts)) {
                if (k in out || k == "link" || k == "type" && v == "link") continue;
                out[k] = v;
            }
        }
        // Then move on to the next linked schema.
        if (typeof links[ts.link] != "object") {
            throw Error(`Unknown link ${ts.link} in version ${ver ?? PROJECT.ver}`);
        }
        ts = links[ts.link];
    }

    // If no fields were recorded, the linked schema can be returned as is.
    if (out === null) return ts;

    // If fields were recorded, remaining fields are added to the out object.
    for (const [k, v] of Object.entries(ts)) {
        if (k in out) continue;
        out[k] = v;
    }

    return out;
}

export function build(s: ISchema, ver: number, show?: boolean, panel?: boolean): string {
    // Build different things in different situations
    switch (s.type) {
        case "or": {
            const nn = n++;
            let html: string[] = s.or.map((vs, i) => {
                let tvs = resolve(vs, ver);
                let title = tvs.title;
                if (!title) title = tvs.type;

                // Don't build resolved schema! Links are built remotely, only once.
                const ihtml = build(vs, ver, true, false);

                JSONED.htmls[`or-${nn}-${i}`] = `<div jtype="${escape(tvs.type)}" jid="${i}">${ihtml}</div>`;
                return `<option type="${escape(tvs.type)}" key="or-${nn}-${i}" value="${i}"${tvs.desc ? ` desc="${escape(tvs.desc)}"` : ""}${tvs.href ? ` href="${escape(tvs.href)}"` : ""}>${escape(title)}</option>`;
            });

            const code = `<div class="flex"><select ${s.hooks?.includes("preserve_single") ? "preserver" : ""} onchange="JSONED.switchData(this, this.value)">${html.join("")}</select>&nbsp;</div>`;
            const shown = `<div${(panel ?? s.panel ?? true) ? ' class="panel"' : ''}>${code}</div>`;

            if (s.unspec && !show) {
                // Store raw code so it can be used directly if need be
                JSONED.htmls[`code-${nn}`] = shown;

                const hiddenHtml = t(`<button key="sub-${nn}" hkey="h-${nn}"
                    onclick="
                        ${s.hooks?.includes("fix_type") ? "const l = this.parentElement?.parentElement?.nextElementSibling?.nextElementSibling?.lastElementChild;" : ""}
                        JSONED.toggleOr(this);
                        ${s.hooks?.includes("fix_type") ? "JSONED.fixTypeFromCondition(l, true);" : ""}
                    ">
                <p class="bi bi-plus"></p></button>`);
                JSONED.htmls[`h-${nn}`] = hiddenHtml;
                // NOTE: No XSS here, but it does mess with some potential code
                JSONED.htmls[`sub-${nn}`] = hiddenHtml.replace('="bi bi-plus">', '="bi bi-dash">').replace(", true);", ", false);") + code;
                return `<div shown="${nn}"${(panel ?? s.panel ?? true) ? ' class="panel"' : ''}>${hiddenHtml}</div>`;
            } else {
                return shown;
            }
        }
        case "string":
            return t(`<${s.ext ? "textarea" : 'input type="text"'}
                ${s.large ? " large" : ""}
                ${s.default ? ` value="${escape(s.default)}"` : ''}
                ${s.allow ? ` onkeydown='return /[${escape(regescape(s.allow))}]/.test(event.key)'` : ''}
                onchange="
                    ${s.nonempty ? " if (!this.value.trim()) this.value = '" + escape(s.default) + "';" : ""}
                    let v = this.value;
                    ${s.hooks?.includes("ns") ? "if (v && !v.includes(':')) { v = '0:'+v; this.value = v; }" : ""}
                    JSONED.setData(this, v);
                    ${s.hooks?.includes("name") ? " JSONED.updateName();" : ""}
                    ${s.hooks?.includes("refresh") ? 'JSONED.refresh();' : ""}
                "
            >${s.ext ? "</textarea>" : ""}`);
        case "float":
        case "number":
            return t(`<input title=""
                type="number"
                ${s.default ? ` value="${escape(s.default as any)}"` : ''}
                onkeydown='return event.key != "+"'
                onchange="
                    let v = this.value === '' ? NaN : parseFloat(this.value);
                    ${s.min !== undefined ? `v = Math.max(v, ${s.min});` : ""}
                    ${s.max !== undefined ? `v = Math.min(v, ${s.max});` : ""}
                    if (isNaN(v)) {this.value = ''; v = undefined}
                    else this.value = v;
                    JSONED.setData(this, v);
                    ${s.hooks?.includes("refresh") ? 'JSONED.refresh();' : ""}
                "
                ${s.min !== undefined ? ` min=${escape(String(s.min))}` : ""}
                ${s.max !== undefined ? ` max=${escape(String(s.max))}` : ""}
                step="any"
            >`);
        case "int":
        case "integer":
            return t(`<input title=""
                type="number"
                ${s.default ? ` value="${escape(s.default as any)}"` : ''}
                onkeydown='return event.key != "+" && event.key != "."'
                onchange="
                    let v = this.value === '' ? NaN : parseInt(this.value);
                    ${s.min !== undefined ? `v = Math.max(v, ${Math.ceil(s.min)});` : ""}
                    ${s.max !== undefined ? `v = Math.min(v, ${Math.floor(s.max)});` : ""}
                    if (isNaN(v)) {this.value = ''; v = undefined}
                    else this.value = v;
                    JSONED.setData(this, v);
                    ${s.hooks?.includes("refresh") ? 'JSONED.refresh();' : ""}
                "
                ${s.min !== undefined ? ` min=${escape(String(s.min))}` : ""}
                ${s.max !== undefined ? ` max=${escape(String(s.max))}` : ""}
            >`);
        case "bool":
        case "boolean":
            return t(`<input
                type="checkbox"
                ${s.default ? " checked" : ""}
                onchange="JSONED.setData(this, this.checked, ${s.default || s.default === false ? true : false})"
            >`);
        case "const": {
            if (typeof s.const == "string" || typeof s.const == "number") {
                return `<span>${escape(String(s.const))}</span>`;
            } else {
                return `<span><pre><code>${escape(JSON.stringify(s.const, null, 4))}</code></pre></span>`;
            }
        }
        case "image":
            // This class, "img-edit", is here so divs without panels can be matched easily.
            return t(`<div class="img-edit">
                <img style="width:${parseInt(s.width ?? 128 as any) }px;height:${parseInt(s.height ?? 128 as any)}px">
                <div>
                    <button onclick="JSONED.clearImage(this.parentElement.parentElement.firstElementChild, this.nextElementSibling)">Clear</button>
                    <input onchange="JSONED.setImage(this.parentElement.parentElement.firstElementChild, this, ${parseInt(s.width ?? 128 as any)}, ${parseInt(s.height ?? 128 as any)})" type="file" accept="image/*">
                </div>
            </div>`);

        case "link":
            return t(`<oclink
                ver="${escape(String(ver))}"
                to="${escape(s.link)}"
                show="${escape(String(show))}"
                panel="${escape(String(panel))}"
            />`);

        case "enum": {
            let opt = false;
            let i = 0;
            const opts: string[] = [];
            for (const e of s.enum) {
                const uval = String(e);
                if (uval[0] == '$') {
                    // Option Group
                    const val = escape(uval.substring(1));
                    if (opt) opts.push("</optgroup>");
                    else opt = true;
                    opts.push(`<optgroup label='${val}'>`);
                } else {
                    // Regular Option
                    const val = escape(String(e));
                    opts.push(`<option${i === s.default ? " selected" : ""} value="${typeof e}-${val}">${val}</option>`);
                    i++;
                }
            }
            if (opt) opts.push("</optgroup>");

            if (s.hooks?.includes("fix_multiple")) {
                opts.splice(2, 0, `<option value="string-origins:multiple">origins:multiple</option>`);
            }

            if (s.unspec) opts.unshift('<option value="undefined-undefined">undefined</option>');

            return t(`<select onchange="
                ${s.hooks?.includes("fix_cond") ? "JSONED.fixConditionFromType(this);" : ""}
                ${s.hooks?.includes("fix_multiple") ? "if (this.value == 'string-origins:multiple') JSONED.changeToMultiple(this); else" : ""}
                JSONED.setData(this, this.value${s.more ? `, ${n}` : ""});
            ">${opts.join("")}</select>`);
        }

        case "tuple":
            return `<div class="panel">${s.vals.map((e, i) => {
                // Don't build resolved schema! Links are built remotely, only once.
                const html = build(e, ver, true, true);
                return `<div jtype="${escape(e.type)}" jid="${i}">${html}</div>`;
            }).join("")}</div>`;

        // Lists and objects have part of their html generated in a separate location
        case "list": {
            // Resolve links and objects so they can default in a list to be shown
            let val = resolve(s.vals, ver);

            if (val.type == "string") {
                // Lists of strings can be handled with textareas
                return t(`<textarea${s.large ? " large" : ""} wrap="off" class="tlist" title="Enter a list of texts, split by line."
                    ${val.allow ? ` onkeydown='return /[${escape(regescape(val.allow))}]/.test(event.key)'` : ''}
                    onchange="
                        let out = this.value.split(/\\r\\n|\\r|\\n/g);
                        out = out.length == 0 || out.length == 1 && out[0] === '' ? [] : out;
                        ${val.hooks?.includes("ns") ? "out = out.map(v => v.includes(':') ? v : '0:'+v); this.value = out.join('\\n');" : ""}
                        JSONED.setData(
                            this,
                            out.length == 0 ? undefined : out
                        )
                    ">
                </textarea>`);
            } else {
                return buildList(s as any, ver, s.show ?? show);
            }
        }
        case "object": {
            if (!(s.ikeys instanceof Set)) s.ikeys = new Set();
            if (!(s.more instanceof Set)) s.more = new Set();

            const fix_multiple = s.hooks?.includes("fix_multiple");

            // Create shown html
            const html: string[] = [];
            if (s.props) {
                function getAliases(props: {[key: string]: ISchema}): {[key: string]: string} {
                    const aliases: {[key: string]: string} = {};
                    for (const [k, vs] of Object.entries(props)) {
                        if (!vs.aliases) continue;
                        for (const alias of vs.aliases) {
                            aliases[alias] = k;
                        }
                    }
                    return aliases;
                }

                function genProps(html: string[], props: {[key: string]: ISchema}, more: boolean = true) {
                    for (const [k, vs] of Object.entries(props) as [string, ISchema][]) {
                        (s as any).ikeys.add(k);

                        if (fix_multiple && k == 'type' && vs.hooks) vs.hooks.push("fix_multiple");

                        // Loop over properties and generate html for each
                        let tvs = resolve(vs, ver);
                        // Don't build resolved schema! Links are built remotely, only once.
                        const ihtml = build(vs, ver);
                        let { title, type, href, desc, gap } = tvs;

                        if (!title) title = startCase(k);

                        // Insert built html
                        if (gap == "before" || gap == "both") html.push("<hr/>");

                        const large_lbl = type == "list" || type == "object" || type == "image" || type == "or" || (tvs.type == "string" && tvs.ext);
                        html.push(`<div class='field${large_lbl ? " field-large" : ""}' jtype="${escape(type)}" jid="${escape(k)}">`);

                        html.push(`<span>`);
                        if (href) html.push(`<a${desc ? ` title="${escape(desc)}"` : ""} target="_blank" rel="noopener noreferrer" href="${escape(href)}">${title}:</a>`);
                        else html.push(`<span${desc ? ` title="${escape(desc)}"` : ""}>${title}:</span>`);
                        html.push("</span>");

                        html.push(ihtml);
                        html.push("</div>");

                        if (gap == true || gap == "after" || gap == "both") html.push("<hr/>");

                        // Insert more fields
                        if (tvs.type == "enum" && tvs.more) {
                            if (more) {
                                const nn = n++;

                                Object.keys(tvs.more).forEach((e) => (s as any).ikeys.add(e));
                                Object.keys(tvs.more).forEach((e) => (s as any).more.add(e));

                                html.push(`<div jmore="${nn}">`);

                                // Loop over extra properties and generate html for each
                                for (const [part, is] of Object.entries(tvs.more as {[key: string]: {[field: string]: ISchema}})) {
                                    // Loop over properties inside enum
                                    const khtml = [];
                                    if (!tvs.talias) tvs.talias = {};
                                    tvs.talias[part] = getAliases(is);
                                    genProps(khtml, is, false);

                                    // Uses a special id for findSchema. This specific jid is detected by a space.
                                    JSONED.htmls[`more-${nn}-${part}`] = `<div jtype="more" jid="${escape(k)} ${escape(part)}">${khtml.join("")}</div>`;
                                }

                                html.push(`</div>`);
                            } else {
                                throw Error("more enum inside more");
                            }
                        }
                    }
                }

                s.talias = getAliases(s.props);
                genProps(html, s.props);
            }
            if (s.extra) {
                if (s.props) html.push("<hr/>");

                let tvs = resolve(s.extra, ver);

                // Recursion protection
                if (!(s as any).temp) (s as any).temp = {
                    type: "list",
                    vals: tvs,
                };

                const ehtml = buildList((s as any).temp, ver, true, s.extra.allowkey ?? true, s?.props && [...s.ikeys]);

                if (tvs.title || s.props) {
                    let {title, desc, href} = tvs;
                    html.push("<div class='field field-large'>");

                    if (!title) html.push("<span></span>");
                    else if (href) html.push(`<a${desc?` title="${escape(desc)}"`:""} href="${escape(href)}">${title}:</a>`);
                    else html.push(`<span${desc?` title="${escape(desc)}"`:""}>${title}:</span>`);
                    html.push(ehtml);

                    html.push("</div>");
                } else {
                    html.push(`<div class='field field-large'>${ehtml}</div>`);
                }
            }
            const code = html.join("");
            const shown = `<div${(panel ?? s.panel ?? true) ? ' class="panel"' : ''}>${code}</div>`;
            if (s.show ?? show) {
                return shown;
            } else {
                const hiddenHtml = `<button key="sub-${n}" hkey="h-${n}" onclick="JSONED.toggleObject(this)"><p class="bi bi-plus"></p></button>`;
                JSONED.htmls[`code-${n}`] = shown;
                JSONED.htmls[`h-${n}`] = hiddenHtml;
                JSONED.htmls[`sub-${n}`] = hiddenHtml.replace("bi-plus", "bi-dash") + code;

                return `<div shown="${n++}"${(panel ?? s.panel ?? true) ? ' class="panel"' : ''}>${hiddenHtml}</div>`;
            }
        }
        default:
            return "";
    }
}