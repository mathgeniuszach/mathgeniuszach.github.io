export function simplify(item: any): any {
    if (item instanceof OMap) {
        const out = {};
        for (const k of item.k) {
            if (!(k in out) && k in item.v) {
                const v = simplify(item.v[k]);
                if (v !== undefined) out[k] = v;
            }
        }
        return out;
    } else if (item instanceof Array) {
        return item.map(e => simplify(e));
    } else if (item instanceof Wrapper) {
        return simplify(item.v);
    } else if (item && typeof item == "object") {
        const out = {};
        Object.entries(item).forEach((x) => out[x[0]] = simplify(x[1]));
        return out;
    } else {
        return item;
    }
}

export function set(d, k, v) {
    if (d instanceof OMap) d.set(k, v);
    else if (v === undefined) delete d[k];
    else d[k] = v;
}
export function get(d, k): any {
    if (d instanceof OMap) return d.get(k);
    else return d[k];
}
export function del(d, k, key: boolean = false): any {
    if (d instanceof OMap) d.del(k, key);
    else delete d[k];
}
export function has(d, k): boolean {
    if (d instanceof OMap) return d.has(k);
    else if (typeof d != "object") return false;
    else return k in d;
}
export function keys(d): string[] {
    if (d instanceof OMap) return d.keys();
    else return Object.keys(d);
}
export function values(d): any[] {
    if (d instanceof OMap) return d.values();
    else return Object.values(d);
}

export class Wrapper<T> {
    v: T | undefined

    constructor(v?: T) {
        this.v = v;
    }
    
    clear() {
        this.v = undefined;
    }
    set(v: T | undefined) {
        this.v = v;
    }
    get(): T {
        return this.v;
    }
}

/**
 * This is a structured and more ordered version of a JavaScript object or Map.
 * It will keep keys in the same order even after they have been deleted.
 * To receive the map as an object, use OMap.toObject(). To JSON stringify it, use OMap.toString().
 */
export class OMap {
    /**
     * This is a list of keys this OMap is currently keeping track of the order of.
     */
    k: string[]
    /**
     * These are the values this OMap is storing.
     */
    v: {[key: string]: any}

    /**
     * Creates a new OMap.
     * @param map An optional object to create an OMap from.
     * @param k An optional starting order for keys to go in.
     */
    constructor(map?: {[key: string]: any}, k?: Set<string> | string[]) {
        if (map == undefined) {
            this.v = {};
            this.k = k == undefined ? [] : [...(k instanceof Set ? k : new Set(k))];
        } else {
            this.v = map;
            this.rekey(k);
        }
    }
    
    rekey(k?: Set<string> | string[]) {
        if (k == undefined) {
            this.k = Object.keys(this.v);
        } else {
            const sk = new Set(k);
            this.k = [...(k instanceof Set ? k : new Set(k))];
            for (const key of Object.keys(this.v)) {
                if (!sk.has(key)) this.k.push(key);
            }
        }
    }

    /**
     * Checks whether or not the OMap has a value for some key.
     * @param k The key to check for.
     * @param dead Whether or not to check dead values too.
     * @returns Whether or not the OMap has a value for this key.
     */
    has(k: string, dead: boolean = false): boolean {
        if (dead) return this.k.includes(k);
        else return k in this.v;
    }
    /**
     * Checks whether or not a key is dead (i.e., it is included in the internal ordering structure but has no value associated with it)
     * @param k Key to check.
     * @returns Whether or not the key is dead.
     */
    dead(k: string): boolean {
        return this.k.includes(k) && !(k in this.v);
    }
    /**
     * Gets the stored value associated with the given key.
     * @param k The key to get the stored value of.
     * @returns The value associated with the given key.
     */
    get(k: string): any {
        return this.v[k];
    }
    /**
     * Associates a given key to a given value, maintaining order and inserting the key at the end of the order if necessary.
     * @param k A key to associate with the given value.
     * @param v The value to associate with the given key. If undefined this method works like `OMap.del(k)`.
     */
    set(k: string, v: any) {
        if (!this.has(k, true)) this.k.push(k);
        if (v === undefined) delete this.v[k];
        else this.v[k] = v;
    }
    /**
     * Removes the value associated with the given key.
     * @param k The key to remove the value associated with.
     * @param key If true, this method will also delete the key from the internal order structure.
     */
    del(k: string, key: boolean = false) {
        delete this.v[k];
        if (key) this.k.splice(this.k.indexOf(k), 1);
    }
    /**
     * Renames a key to a new one, preserving order.
     * @param oldKey The key to rename (it must exist in the OMap)
     * @param newKey The key to rename to (it must not already exist in the OMap)
     */
    rename(oldKey: string, newKey: string) {
        // Check to make sure this operation is safe
        if (this.has(newKey, true)) throw Error(`key "${newKey}" already exists in OMap`);
        const i = this.k.indexOf(oldKey);
        if (i == -1) throw Error(`key "${oldKey}" does not exist in OMap`);

        // Replace old key with new one
        this.k[i] = newKey;

        // Replace the old value key with the new one if it's not dead
        if (oldKey in this.v) {
            const v = this.v[oldKey];
            delete this.v[oldKey];
            this.v[newKey] = v;
        }
    }
    /**
     * Removes all values associated with any keys.
     * @param keys Whether or not to delete the internal key ordering structure as well.
     */
    clear(keys: boolean = false) {
        this.v = {};
        if (keys) this.k = [];
    }

    /**
     * Gets the key at the given index.
     * @param i The index to find the key at.
     * @param dead Whether or not to include dead keys in the check.
     * @returns The key at the given index.
     */
    keyAt(i: number, dead: boolean = false): string {
        return this.keys(dead)[i];
    }
    /**
     * Gets the value associated with the key at the given index.
     * @param i The index to find the value at.
     * @param dead Whether or not to include dead keys in the check.
     * @returns The value given by the key at the given index.
     */
    valAt(i: number, dead: boolean = false): any {
        return this.keys(dead)[i];
    }
    /**
     * Returns a list of live keys in the OMap (i.e., all keys with values mapped to them).
     * @param dead If true, this method returns dead keys in the structure as well.
     * @returns A list of live keys in the OMap.
     */
    keys(dead: boolean = false) {
        if (dead) return this.k;
        else return this.k.filter(k => k in this.v);
    }
    /**
     * Returns a list of values in the OMap ordered by the internal structure.
     */
    values(): any[] {
        return this.k.map(k => this.v[k]);
    }
    /**
     * Returns the number of live (and optionally dead) keys in the OMap.
     * @param dead If true, this method includes dead keys in the size as well.
     * @returns The number of keys in the OMap.
     */
    size(dead: boolean = false) {
        if (dead) return this.k.length;
        else return Object.keys(this.v).length;
    }
    /**
     * Locates the given key's position in the internal ordering structure of this OMap.
     * @param k The key to locate.
     * @param dead Whether or not to include dead keys as part of the ordering.
     * @returns The key's position in this OMap's ordering structure.
     */
    index(k: string, dead: boolean = false) {
        return this.keys(dead).indexOf(k);
    }
    /**
     * Moves a key relatively inside the internal ordering structure. Movements that would move the key out of bounds would make it move to the end instead.
     * @param k The key to move.
     * @param rel Position relative to move. Negative values mean to a previous index and positive to a later index.
     * @param dead When false, dead keys are ignored / skipped over when moving. When true they are not ignored.
     */
    shift(k: string, rel: number, dead: boolean = false) {
        // Check safety
        const i = this.k.indexOf(k);
        if (i == -1) throw Error(`key "${k}" does not exist in OMap`);

        // Get movement location
        let ni = 0;
        if (dead) {
            ni = Math.min(Math.max(0, i + rel), this.k.length);
        } else {
            if (!(k in this.v)) throw Error(`key "${k}" is dead and cannot be shifted when dead is false`);
            const live = this.keys();
            ni = Math.max(0, live.indexOf(k) + rel);
            if (ni >= live.length) ni = this.k.length;
            else ni = this.k.indexOf(live[ni]);
        }

        // Perform move
        if (i != ni) {
            this.k.splice(i, 1);
            this.k.splice(ni, 0, k);
        }
    }
    move(k: string, pos: number, dead: boolean = false) {
        // Check safety
        const i = this.k.indexOf(k);
        if (i == -1) throw Error(`key "${k}" does not exist in OMap`);

        // Get movement location
        let ni = Math.max(0, pos);
        if (dead) {
            ni = Math.min(ni, this.k.length);
        } else {
            const live = this.keys();
            if (ni >= live.length) ni = this.k.length;
            else ni = this.k.indexOf(live[ni]);
        }

        // Perform move
        if (i != ni) {
            this.k.splice(i, 1);
            this.k.splice(ni, 0, k);
        }
    }

    toJSON(): {[key: string]: any} {
        return simplify(this);
    }
    toString(space?: number): string {
        return JSON.stringify(this, undefined, space);
    }
}