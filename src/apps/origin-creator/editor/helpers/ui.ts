import { getHelper } from "./registry";

// The helper menu: a small popover with a search box and the helper's lists.
// Clicking an item puts its value into the field the "+" button belongs to.
// One delegated click listener handles every "+" button, so nothing needs to be wired up per field.

let panel: HTMLElement | null = null;
let anchor: HTMLElement | null = null;

function close() {
    if (panel) panel.remove();
    panel = null;
    anchor = null;
}

// A field can be a plain dropdown, a text box, or an "or" of both (for example "built-in" | "custom"),
// which has a chooser dropdown on top. These find the right control inside a field.
const isChooser = (s: HTMLSelectElement) => Array.from(s.options).some(o => o.hasAttribute("key"));
const valueSelect = (f: Element) => Array.from(f.querySelectorAll("select")).find(s => !isChooser(s)) as HTMLSelectElement | undefined;
const chooserSelect = (f: Element) => Array.from(f.querySelectorAll("select")).find(isChooser) as HTMLSelectElement | undefined;
const textInput = (f: Element) => f.querySelector("input[type=text], textarea") as HTMLInputElement | HTMLTextAreaElement | null;

// Sets a control and fires its "change" event, so the editor's normal handling saves the data.
function fire(el: HTMLElement) {
    el.dispatchEvent(new Event("change", { bubbles: true }));
}

// Puts a value in the field that owns the button. Returns false if the field can't take that value.
function applyValue(button: HTMLElement, value: string): boolean {
    const field = button.closest(".field");
    if (!field) return false;

    // If the field is switched off (an optional field), switch it on first
    if (!valueSelect(field) && !chooserSelect(field) && !textInput(field)) {
        const toggle = field.querySelector("button[key]") as HTMLElement | null;
        if (toggle) toggle.click();
    }

    // 1. A dropdown of built-in values. These may be listed with or without "minecraft:", so try both.
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

    // 2. A text box
    let input = textInput(field);

    // 3. Not in the dropdown, but the field also allows custom text: switch it to the text option
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

    const search = document.createElement("input");
    search.type = "text";
    search.className = "jhelper-search";
    search.placeholder = "Search...";

    const list = document.createElement("div");
    list.className = "jhelper-list";

    const note = document.createElement("div");
    note.className = "jhelper-note";

    const render = () => {
        const q = search.value.trim().toLowerCase();
        list.textContent = "";
        let shown = 0;

        for (const section of helper.sections()) {
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
    search.addEventListener("input", render);

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

    // Place it just under the button, kept inside the window
    const r = button.getBoundingClientRect();
    const left = Math.max(4, Math.min(r.left, window.innerWidth - el.offsetWidth - 8));
    el.style.left = (left + window.scrollX) + "px";
    el.style.top = (r.bottom + window.scrollY + 4) + "px";

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

        if (panel && !target.closest(".jhelper-panel")) close();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
    });
}
