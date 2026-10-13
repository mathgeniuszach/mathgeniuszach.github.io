let current = "";

export function setScope(link: string) {
    current = link;
}

export function getScope(): string {
    return current;
}
