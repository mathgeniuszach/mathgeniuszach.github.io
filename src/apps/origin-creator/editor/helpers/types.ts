export type HelperContext = {
    link?: string;
    key: string;
    schema: any;
    scope: string;
    path: string[];
};

export type HelperItem = {
    value: string;
    desc?: string;
};

export type HelperSection = {
    label: string;
    items: HelperItem[];
};

export type Helper = {
    id: string;
    title: string;
    match: (ctx: HelperContext) => boolean;
    sections: () => HelperSection[];
};
