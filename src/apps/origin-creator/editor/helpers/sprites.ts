import { HelperSpec, SpriteSheet } from "./types";

// Sheet layout: 10px steps, the empty bar is first, bar n is at (n+1)*10.
// Right of bar n, 2px higher, are its icons in 9px cells. icon_index picks the cell.
const SCALE = 3;
const ROW = 10;
const BAR_W = 71;
const ICON_X = 72;
const ICON_W = 9;
const ICON_Y = 8;
const ICON_H = 8;

type Tab = "sheet" | "bar" | "icon";

const el = (tag: string, cls: string, text?: string): HTMLElement => {
    const e = document.createElement(tag);
    e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
};

function crop(sheet: SpriteSheet, x: number, y: number, w: number, h: number, scale: number = SCALE): HTMLElement {
    const e = el("span", "jsprite");
    e.style.width = w * scale + "px";
    e.style.height = h * scale + "px";
    e.style.backgroundImage = `url("${sheet.image}")`;
    e.style.backgroundSize = `${256 * scale}px ${256 * scale}px`;
    e.style.backgroundPosition = `${-x * scale}px ${-y * scale}px`;
    return e;
}

export function spritePicker(spec: HelperSpec, button: HTMLElement, reposition: () => void): HTMLElement {
    const field = button.closest(".field");
    const scope = field?.parentElement;
    const input = (name: string) => scope?.querySelector(`.field[jid="${name}"] input`) as HTMLInputElement | null;

    const read = (name: string): string => input(name)?.value ?? "";
    const write = (name: string, value: string): boolean => {
        const i = input(name);
        if (!i) return false;
        i.value = value;
        i.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
    };

    // Empty sprite_location means the sheet marked default
    const current = (): SpriteSheet | undefined => {
        const v = read(spec.fields.sprite);
        return v ? spec.sheets.find(s => s.sprite == v) : spec.sheets.find(s => s.default) ?? spec.sheets[0];
    };
    const num = (name: string) => parseInt(read(name)) || 0;
    const iconAt = (sheet: SpriteSheet, bar: number, k: number) => crop(sheet, ICON_X + ICON_W * k, bar * ROW + ICON_Y, ICON_W, ICON_H);
    const iconCount = (sheet: SpriteSheet, bar: number) => sheet.icons[bar] ?? 0;

    let tab: Tab = (["sheet", "bar", "icon"].includes(spec.tab) ? spec.tab : "bar") as Tab;

    const root = el("div", "jsprites");
    const preview = el("div", "jsprites-preview");
    const tabs = el("div", "jsprites-tabs");
    const body = el("div", "jsprites-body");
    const note = el("div", "jhelper-note");
    root.append(preview, tabs, body, note);

    const drawPreview = () => {
        preview.textContent = "";
        const sheet = current();
        if (!sheet) { preview.textContent = "Custom sheet, no preview"; return; }

        const bar = el("span", "jsprites-bar");
        bar.style.width = BAR_W * SCALE + "px";
        bar.style.height = sheet.height * SCALE + "px";
        bar.append(crop(sheet, 0, 0, BAR_W, sheet.height));
        const fill = crop(sheet, 0, (num(spec.fields.bar) + 1) * ROW, BAR_W, sheet.height);
        fill.classList.add("jsprites-fill");
        bar.append(fill);
        preview.append(bar);

        const bi = num(spec.fields.bar);
        if (iconCount(sheet, bi) > 0) preview.append(iconAt(sheet, bi, num(spec.fields.icon)));
    };

    const pick = (name: string, value: string, then?: () => void) => {
        if (!write(name, value)) { note.textContent = `This object has no "${name}" field.`; return; }
        note.textContent = "";
        drawPreview();
        if (then) then(); else drawBody();
    };

    const drawBody = () => {
        body.textContent = "";
        const sheet = current();
        const grid = el("div", "jsprites-grid");

        if (tab == "sheet" || !sheet) {
            for (const s of spec.sheets) {
                const b = el("button", "jhelper-item jsprites-sheet");
                b.setAttribute("type", "button");
                b.setAttribute("data-sprite", s.sprite);
                b.append(el("span", "", s.title), crop(s, 0, ROW, BAR_W, s.height, 2));
                if (s === sheet) b.classList.add("jsprites-on");
                b.addEventListener("click", () => pick(spec.fields.sprite, s.sprite, () => setTab("bar")));
                body.append(b);
            }
            return;
        }

        if (tab == "bar") {
            const on = num(spec.fields.bar);
            for (let i = 0; i < sheet.bars; i++) {
                const b = el("button", "jhelper-item jsprites-pick jsprites-barpick");
                b.setAttribute("type", "button");
                b.setAttribute("data-index", String(i));
                b.title = `bar_index ${i}`;
                b.append(el("span", "jsprites-num", String(i)), crop(sheet, 0, (i + 1) * ROW, BAR_W, sheet.height, 2));
                if (iconCount(sheet, i) > 0) b.append(iconAt(sheet, i, 0));
                if (iconCount(sheet, i) > 1) b.append(el("span", "jsprites-more", `${iconCount(sheet, i)} icons`));
                if (i === on && read(spec.fields.bar) !== "") b.classList.add("jsprites-on");
                b.addEventListener("click", () => pick(spec.fields.bar, String(i)));
                body.append(b);
            }
            return;
        }

        const bar = num(spec.fields.bar);
        const n = iconCount(sheet, bar);
        if (n < 2) { note.textContent = `Bar ${bar} has ${n == 1 ? "only one icon" : "no icon"}, icon_index isn't needed.`; return; }
        const on = num(spec.fields.icon);
        for (let i = 0; i < n; i++) {
            const b = el("button", "jhelper-item jsprites-pick jsprites-iconpick");
            b.setAttribute("type", "button");
            b.setAttribute("data-index", String(i));
            b.title = `icon_index ${i}`;
            b.append(iconAt(sheet, bar, i));
            if (i === on && read(spec.fields.icon) !== "") b.classList.add("jsprites-on");
            b.addEventListener("click", () => pick(spec.fields.icon, String(i)));
            grid.append(b);
        }
        body.append(grid);
    };

    const setTab = (t: Tab) => {
        tab = t;
        note.textContent = "";
        tabs.querySelectorAll("button").forEach(b => b.classList.toggle("jsprites-on", b.getAttribute("data-tab") == t));
        drawBody();
        reposition();
    };

    for (const [t, label] of [["sheet", "Sheet"], ["bar", "Bar"], ["icon", "Icon"]] as [Tab, string][]) {
        const b = el("button", "jsprites-tab", label);
        b.setAttribute("type", "button");
        b.setAttribute("data-tab", t);
        b.addEventListener("click", () => setTab(t));
        tabs.append(b);
    }

    drawPreview();
    setTab(tab);
    return root;
}