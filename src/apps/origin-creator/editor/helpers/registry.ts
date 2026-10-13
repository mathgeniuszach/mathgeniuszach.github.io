import { Helper, HelperContext } from "./types";

import damageType from "./damage-type";
import damageTag from "./damage-tag";

// Add helpers, entry below import above
export const HELPERS: Helper[] = [
    damageType,
    damageTag,
];

export function getHelper(id: string): Helper | undefined {
    return HELPERS.find(h => h.id === id);
}

export function findHelper(ctx: HelperContext): Helper | undefined {
    return HELPERS.find(h => h.match(ctx));
}

export function helperButton(ctx: HelperContext): string {
    const h = findHelper(ctx);
    if (!h) return "";
    return `<button type="button" class="jhelper" data-helper="${h.id}" title="${h.title}: show list"><i class="bi bi-plus-circle"></i></button>`;
}
