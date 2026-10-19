// Read from a schema's "helper:" key
export type HelperSpec = {
    title: string;
    list: string[];
    id: string;
    folder: string[];
};

export type HelperItem = {
    value: string;
    desc?: string;
};

export type HelperSection = {
    label: string;
    items: HelperItem[];
};
