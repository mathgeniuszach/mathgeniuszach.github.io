import { getHelper, helperSections } from "./registry";
import { spritePicker } from "./sprites";


let panel: HTMLElement | null = null;
let anchor: HTMLElement | null = null;

function close() {
    if (panel) panel.remove();
    panel = null;
    anchor = null;
}

const isChooser = (s: HTMLSelectElement) => Array.from(s.options).some(o => o.hasAttribute("key"));
const valueSelect = (f: Element) => Array.from(f.querySelectorAll("select")).find(s => !isChooser(s)) as HTMLSelectElement | undefined;
const chooserSelect = (f: Element) => Array.from(f.querySelectorAll("select")).find(isChooser) as HTMLSelectElement | undefined;
const textInput = (f: Element) => f.querySelector("input[type=text], textarea") as HTMLInputElement | HTMLTextAreaElement | null;

function fire(el: HTMLElement) {
    el.dispatchEvent(new Event("change", { bubbles: true }));
}

function applyValue(button: HTMLElement, value: string): boolean {
    const field = button.closest(".field");
    if (!field) return false;

    if (!valueSelect(field) && !chooserSelect(field) && !textInput(field)) {
        const toggle = field.querySelector("button[key]") as HTMLElement | null;
        if (toggle) toggle.click();
    }

    // can be with or without minecraft:
    const select = valueSelect(field);
    if (select) {
        const bare = value.replace(/^minecraft:/, "");
        const wanted = [`string-${value}`, `string-${bare}`, `string-minecraft:${bare}`];
        const option = Array.from(select.options).find(o => wanted.includes(o.value));
        if (option) {
            select.value = option.value;
            fire(select);
            return true;
        }
    }

    let input = textInput(field);

    if (!input) {
        const chooser = chooserSelect(field);
        const custom = chooser && Array.from(chooser.options).find(o => o.getAttribute("type") === "string");
        if (chooser && custom) {
            chooser.value = custom.value;
            fire(chooser);
            input = textInput(field);
        }
    }

    if (input) {
        input.value = value;
        fire(input);
        return true;
    }

    return false;
}

// Helper panel resize
const EDGE = 8;
function place() {
    if (!panel || !anchor) return;
    if (!anchor.isConnected) { close(); return; }

    const r = anchor.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) { close(); return; } // button scrolled out of view

    const below = window.innerHeight - r.bottom - EDGE;
    const above = r.top - EDGE;
    const flip = below < 200 && above > below;

    
    panel.style.maxHeight = Math.min(340, Math.max(120, flip ? above : below)) + "px";
    const top = flip ? r.top - panel.offsetHeight - 4 : r.bottom + 4;
    const left = Math.min(r.left, window.innerWidth - panel.offsetWidth - EDGE);

    panel.style.left = Math.max(4, left) + "px";
    panel.style.top = Math.max(4, top) + "px";
}

function open(button: HTMLElement) {
    const helper = getHelper(button.getAttribute("data-helper") || "");
    if (!helper) return;

    close();
    anchor = button;

    const el = document.createElement("div");
    el.className = "jhelper-panel";

    const head = document.createElement("div");
    head.className = "jhelper-head";
    const title = document.createElement("span");
    title.textContent = helper.title;
    const x = document.createElement("button");
    x.type = "button";
    x.className = "jhelper-close";
    x.textContent = "×";
    x.title = "Close";
    x.addEventListener("click", close);
    head.append(title, x);

    // Sprite pickers
    if (helper.kind == "sprites") {
        el.classList.add("jhelper-sprites");
        el.append(head, spritePicker(helper, button, place));
        document.body.appendChild(el);
        panel = el;
        place();
        return;
    }

    const search = document.createElement("input");
    search.type = "text";
    search.className = "jhelper-search";
    search.placeholder = "Search...";

    const list = document.createElement("div");
    list.className = "jhelper-list";

    const note = document.createElement("div");
    note.className = "jhelper-note";

    const all = helperSections(helper);

    const render = () => {
        const q = search.value.trim().toLowerCase();
        list.textContent = "";
        let shown = 0;

        for (const section of all) {
            const items = section.items.filter(i => !q || i.value.toLowerCase().includes(q) || (i.desc || "").toLowerCase().includes(q));
            if (items.length === 0) continue;

            const h = document.createElement("div");
            h.className = "jhelper-section";
            h.textContent = section.label;
            list.appendChild(h);

            for (const item of items) {
                const b = document.createElement("button");
                b.type = "button";
                b.className = "jhelper-item";
                b.setAttribute("data-value", item.value);
                b.textContent = item.value;
                if (item.desc) {
                    const d = document.createElement("span");
                    d.textContent = item.desc;
                    b.appendChild(d);
                }
                list.appendChild(b);
                shown++;
            }
        }

        if (shown === 0) {
            const none = document.createElement("div");
            none.className = "jhelper-none";
            none.textContent = "No matches";
            list.appendChild(none);
        }
    };
        search.addEventListener("input", () => { render(); place(); });

    list.addEventListener("click", (e) => {
        const b = (e.target as Element).closest(".jhelper-item") as HTMLElement | null;
        if (!b || !anchor) return;
        if (applyValue(anchor, b.getAttribute("data-value") || "")) {
            close();
        } else {
            note.textContent = "That value isn't available in this field.";
        }
    });

    el.append(head, search, list, note);
    render();
    document.body.appendChild(el);
    panel = el;

        place();

    search.focus();
}

// Helper menu closures

if (typeof document !== "undefined") {
    document.addEventListener("click", (e) => {
        const target = e.target as Element | null;
        if (!target || !target.closest) return;

        const button = target.closest(".jhelper") as HTMLElement | null;
        if (button) {
           
            if (panel && anchor === button) close();
            else open(button);
            return;
        }

        if (panel && !e.composedPath().includes(panel)) close();
    });

    window.addEventListener("scroll", (e) => {
        if (panel && !panel.contains(e.target as Node)) place();
    }, true);
    window.addEventListener("resize", place);
    
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
    });
}
