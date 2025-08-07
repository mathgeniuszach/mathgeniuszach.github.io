import DOMPurify from "dompurify";
import yaml from "js-yaml";
import { marked } from "marked";
import hljs from "highlight.js";
import JSZip from "jszip";

import { fetchZip, flowrepo } from "../params";

const parser = new DOMParser();

const titles = {};
const htmls = {};
const redirects = {};

let appending = false;
let flowData: JSZip = null;

async function parseText(text?: string, p: boolean = false): Promise<string> {
    if (!text) return "";

    const allowed = ['span', 'pre', 'code', 'b', 'i', 'em', 'img', 'a', 'ul', 'ol', 'li', 'br', 'table', 'tbody', 'th', 'tr', 'td', 'h2', 'h3', 'h4', 'h5', 'h6'];
    if (p) allowed.push('p');

    const document = parser.parseFromString(DOMPurify.sanitize(marked.parse(text), {ALLOWED_TAGS: allowed}), "text/html");

    // Prevent source elements of images from going outside relative to the page
    const toSet = [];
    for (const elem of document.querySelectorAll("img")) {
        const src = elem.src
            .replace(/^https?:\/\/(localhost:\d+|mathgeniuszach.github.io|www.mathgeniuszach.com)\/apps\/origin-creator(\/help)?/g, "")
            .replace(/[^\w/-]+|^\//g, "");
        const fullSrc = "i/" + src + ".png";
        
        elem.src = URL.createObjectURL(await flowData.file(fullSrc).async("blob"));
    }
    // Open in-text links in another tab
    document.querySelectorAll("a").forEach((elem: HTMLAnchorElement) => {
        elem.rel = "noopener noreferrer";
        elem.target = "_blank";
    });

    return document.body.innerHTML.trim();
}

globalThis.openPage = (page: string) => {
    // Set appending mode
    appending = true;

    // Set hash based on page
    const ppage = page in redirects ? redirects[page] : page || "index";
    location.hash = ppage == "index" ? '' : "#" + ppage;
};

globalThis.loadPage = (page: string) => {
    const map = document.getElementById("map");
    const content = document.getElementById("content");

    let ppage = page in redirects ? redirects[page] : page || "index";
    if (!(ppage in htmls)) ppage = "undefined";

    content.innerHTML = htmls[ppage];

    let pageMapElem = map.querySelector("#map-"+ppage);
    if (pageMapElem) {
        // If the page is already in the map, delete up until that point.
        while (pageMapElem.nextSibling) pageMapElem.nextSibling.remove();
    } else {
        // If not in appending mode, delete all html that's not the home button (to prevent generating weird chains)
        if (!appending) {
            pageMapElem = map.querySelector("#map-index");
            while (pageMapElem.nextSibling) pageMapElem.nextSibling.remove();
        }

        // If not, add the page to the map.
        map.insertAdjacentHTML("beforeend", `<span class="mapelem" id='map-${ppage}'><span>&nbsp;&gt;&nbsp;</span><a href="javascript:openPage('${ppage}')">${titles[ppage]}</a></span>`);
    }

    // Highlight
    hljs.highlightAll();

    // Reset appending mode
    appending = false;
};

window.addEventListener("DOMContentLoaded", async () => {
    try {
        flowData = await fetchZip(flowrepo);
    } catch (err) {
        const message = "Could not fetch flow data from github. Try again later.";
        console.error(message, err);
        document.getElementById("load").innerHTML = message;
        return;
    }

    const meta = yaml.load(await flowData.file("index.yaml").async("text"));

    const files = typeof(meta.data) == "string" ? meta.data.split(" ") : meta.data;
    Object.assign(redirects, meta.redirects);

    const datamap = {"undefined": meta.default};

    // Grab yaml data
    await Promise.all(files.map(async file => {
        try {
            Object.assign(datamap, yaml.load(await flowData.file(file).async("text")));
        } catch (err) {
            console.error(`Error parsing "${file['path']}";`, err);
        }
    }));

    // Parse data and build html
    for (const [key, data] of Object.entries(datamap)) {
        const pkey = key.replace(/[^\w/-]+|^\//g, "");

        titles[pkey] = await parseText(data["title"]);
        htmls[pkey] = `
            ${await parseText(data["text"], true)}
            ${(await Promise.all(((data["opts"] || []) as object[]).map(async (opt, i) => {
                try {
                    return `<button onclick='openPage("${opt["link"].replace(/[^\w/-]+|^\//g, "")}")'>${await parseText(opt["text"])}</button>`;
                } catch (err) {
                    console.error(`Error, invalid option ${i} of menu ${pkey}`, err);
                }
            }))).join("")}
        `;
    }

    // Build starter page
    const page = (location.hash || "#index").substring(1);
    appending = true;
    globalThis.loadPage(page);
});

window.onhashchange = e => {
    const page = (location.hash || "#index").substring(1);
    globalThis.loadPage(page);

    const section = document.querySelector("section");
    if (section) section.scrollTo(0, 0);
};