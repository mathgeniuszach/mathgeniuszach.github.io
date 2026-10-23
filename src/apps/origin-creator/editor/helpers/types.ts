// One sprite sheet of a "kind: sprites" helper
export type SpriteSheet = {
    title: string;
    sprite: string;
    image: string;
    bars: number;
    icons: number[];
    height: number;
    default: boolean;
};

// Read from a schema's "helper:" key
export type HelperSpec = {
    kind: "list" | "sprites";
    title: string;
    list: string[];
    id: string;
    folder: string[];
    tab: string;
    fields: { sprite: string; bar: string; icon: string };
    sheets: SpriteSheet[];
};

export type HelperItem = {
    value: string;
    desc?: string;
};

export type HelperSection = {
    label: string;
    items: HelperItem[];
};
