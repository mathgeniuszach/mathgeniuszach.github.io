(window as any).$ = document.querySelector.bind(document);
// eslint-disable-next-line no-undef
(window as any).$$ = document.querySelectorAll.bind(document);

function e(x) {
    return eval(d(x));
}
function d(t) {
    return atob(t);
}
// Not the real sitelock, but one particular sitelock to confuse people trying to break in
if (location.host != "mathgeniuszach.github.io" && location.host != "localhost:1234" && location.host != "www.mathgeniuszach.com" && location.host != "mathgeniuszach.com" && location.protocol != "file:") {
    window.stop();
    location.host = "www.mathgeniuszach.com";
    location.reload();
}

// Generic code

function embedVideo(link, width, height) {
    document.getElementById("yt-"+link).outerHTML = `<iframe
        style="max-height:${height}px;max-width:100%;border:none;"
        sandbox="allow-scripts allow-same-origin"
        class="yt-iframe"
        width="${width}" height="${height}"
        src="https://www.youtube-nocookie.com/embed/${link}?autoplay=1" title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
    </iframe>`;
}
window.embedVideo = embedVideo;

function toggleAside(btn: HTMLButtonElement) {
    btn.textContent = btn.nextElementSibling.toggleAttribute("shown") ? "-" : "+";
}
window.toggleAside = toggleAside;

window.addEventListener("DOMContentLoaded", () => {
    if (globalThis.offline) {
        document.documentElement.toggleAttribute("offline");
    }

    for (const aside of document.querySelectorAll("aside")) {
        if (!aside.hasAttribute("nomobile")) {
            aside.insertAdjacentHTML("beforebegin", '<button class="toggle-aside" onclick="toggleAside(this)">+</button>');
        }
    }

    add_widgets();

    // Delete preloaders
    document.querySelectorAll(".limbo").forEach(e => e.remove());
});

function add_widgets() {
    // Discord widgets
    document.querySelectorAll(".discord").forEach(async (e) => {
        try {
            const link = e.getAttribute("link");
            // e.innerHTML =
            //     `<a class="dc-icon" href="https://discord.gg/${link}" target="_blank">
            //         <img style="opacity:0" src="https://cdn.discordapp.com/icons/421862906091798529/08d5e8eb1d0ebc0730ee203be48b1876.webp?size=64">
            //     </a>
            //     <div>
            //         <a class="dc-title" href="https://discord.gg/${link}" target="_blank">...</a>
            //         <span class="dc-members">
            //             <i class="online-circ"></i><span class="online-num">?? Online</span>
            //             <i class="members-circ"></i><span class="members-num">?? Members</span>
            //         </span>
            //     </div>
            //     <a class="dc-join" href="https://discord.gg/${link}" target="_blank">Join</a>`;

            const data = await (await fetch(`https://discordapp.com/api/v9/invites/${link}?with_counts=true`)).json();

            // console.log(link, data);

            const iconUrl = `https://cdn.discordapp.com/icons/${encodeURIComponent(data.guild.id)}/${encodeURIComponent(data.guild.icon)}.webp?size=64`;
            const iconBlob = (await (await fetch(iconUrl)).blob());

            let icon = e.querySelector("img").src;

            try {
                icon = await new Promise(r => {
                    const fr = new FileReader();
                    fr.onload = e => r(e.target.result as string);
                    fr.readAsDataURL(iconBlob);
                });
            } catch (err) {}

            const title = data.guild.name;
            const online = String(data.approximate_presence_count);
            const members = String(data.approximate_member_count);
            e.innerHTML =
                `<a class="dc-icon" href="https://discord.gg/${link}" target="_blank"><img src="${icon}"></a>
                <div>
                    <a class="dc-title" href="https://discord.gg/${link}" target="_blank">${title}</a>
                    <span class="dc-members">
                        <i class="online-circ"></i><span class="online-num">${online} Online</span>
                        <i class="members-circ"></i><span class="members-num">${members} Members</span>
                    </span>
                </div>
                <a class="dc-join" href="https://discord.gg/${link}" target="_blank">Join</a>`;
        } catch (err) {
            console.error(err);
        }
    });

    // Accordions
    // document.querySelectorAll(".expand").forEach(async (e) => {
    //     const h2 = e.firstElementChild;

    //     const title = h2.innerHTML;
    //     h2.innerHTML = "<p class='bi bi-plus'></p> " + title;

    //     h2.setAttribute("tabindex", "0");
    //     h2.addEventListener("click", () => {
    //         if (e.toggleAttribute("shown")) {
    //             h2.innerHTML = "<p class='bi bi-dash'></p> " + title;
    //         } else {
    //             h2.innerHTML = "<p class='bi bi-plus'></p> " + title;
    //         }
    //     });
    // });

    window.addEventListener("keypress", (e) => {
        if (e.key == "Enter" && document.activeElement) {
            (document.activeElement as any).click();
        }
    });

    // Skip nav main element
    // const to_skip = document.querySelector("aside") || document.querySelector("header");
    // to_skip.insertAdjacentHTML("afterend", '<main id="navskip" tabindex="-1"></main>');
}

// Cheats

// https://gist.github.com/starfys/aaaee80838d0e013c27d
const buf = new ArrayBuffer(4);
const f32 = new Float32Array(buf);
const u32 = new Uint32Array(buf);

function isqrt(x) {
    const x2 = 0.5 * (f32[0] = x);
    u32[0] = (0x5f3759df - (u32[0] >> 1));
    let y = f32[0];
    y = y * (1.5 - (x2 * y * y));
    return y;
}

let wn = 0;

enum WormState {
    IDLE,
    ATTACKING,
    DEAD
}

class Worm {
    ctx: CanvasRenderingContext2D;
    color: string;
    width: number;
    length: number;
    sqrlength: number;
    px: number;
    py: number;

    attack_target?: string;

    state: WormState;

    constructor(ctx: CanvasRenderingContext2D, color: string, width: number, length: number) {
        this.ctx = ctx;
        this.color = color;
        this.width = width;
        this.length = length;
        this.sqrlength = length*length;
        this.px = Math.random()*window.innerWidth;
        this.py = Math.random()*window.innerHeight;
        this.attack_target = null;
        this.state = WormState.IDLE;
    }

    move() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        let tx, ty;
        if (this.state == WormState.ATTACKING) {
            // grab_target() can fail, if this happens we just run around randomly
            if (!this.attack_target) this.grab_target();
        }

        if (this.attack_target) {
            const target = document.querySelector("."+this.attack_target);
            if (!target) {
                this.attack_target = null;
                return;
            }

            const rect = target.getBoundingClientRect();
            tx = rect.x + rect.width / 2 - this.px;
            ty = rect.y + rect.height / 2 - this.py;

            if (tx*tx+ty*ty < this.sqrlength) {
                target.remove();
                this.attack_target = null;
                this.state = WormState.DEAD;
                return;
            }
        } else {
            tx = Math.random()*w - this.px;
            ty = Math.random()*h - this.py;
        }

        const s = this.length * isqrt(tx*tx+ty*ty);
        tx *= s;
        ty *= s;

        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.width;
        this.ctx.lineCap = "round";

        this.ctx.beginPath();
        this.ctx.moveTo(this.px, this.py);

        this.px += tx;
        this.py += ty;

        this.ctx.lineTo(this.px, this.py);
        this.ctx.stroke();
    }

    grab_target() {
        const food = document.querySelectorAll("*:not(.dont-eat)");
        if (!food || food.length <= 0) {
            this.attack_target = null;
            return;
        }

        for (let i = 0; i < 5; ++i) { // 5 tries max, so we don't freeze the ui
            const target = food[Math.floor(Math.random()*food.length)] as HTMLElement;
            if (target.offsetParent === null) continue; // Ignore invisible elements

            let textElementCount = 0;

            if (target.textContent.trim() !== "") {
                for (const node of target.childNodes) {
                    if (node.nodeType == Node.TEXT_NODE) {
                        if (node.nodeValue.trim()) ++textElementCount;
                    }
                }
            }

            if (textElementCount && target.tagName != "W") {
                const ifood = splitWords(target);

                let fi;
                do {
                    fi = Math.floor(Math.random()*ifood.length);
                } while (ifood[fi][0] == "<"); // This loop is guaranteed to eventually find a match. Eventually.

                ifood[fi] = `<w style="color:red" class="ww w${wn}">${ifood[fi]}</w>`;
                target.innerHTML = ifood.join(" ");
            } else {
                if (target.textContent.trim() || target.classList.contains("ww")) continue;

                target.style.color = "red";
                target.classList.add(`w${wn}`, "ww");
            }

            this.attack_target = `w${wn}`;
            ++wn;
            return;
        }

        this.attack_target = null;
    }
}

function splitWords(element: HTMLElement): string[] {
    const words: string[] = [];

    for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.nodeValue.length > 0) {
                const v = node.nodeValue.trim();
                if (v) words.push(...v.split(/\s+/g));
            }
        } else if (node.nodeType !== Node.COMMENT_NODE) {
            words.push((node as HTMLElement).outerHTML.trim());
        }
    }

    return words;
}

const keys = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let key_i = 0;
window.addEventListener("keydown", (e) => {
    if (key_i > -1) {
        if (key_i == 2 && e.key == "ArrowUp") return; // Pressing up the third time keeps us where we are in the list.

        if (e.key == keys[key_i]) {
            if (key_i++ >= keys.length-1) {
                alert("(SEIZURE WARNING)\n\nCHEAT CODE DETECTED!\nANTI-CHEAT ACTIVATED!");
                key_i = -1;

                if (!window.matchMedia(`(prefers-reduced-motion: reduce)`)) setInterval(() => {
                    if (document.documentElement.getAttribute("theme") == "light") {
                        globalThis.changeTheme("dark");
                    } else {
                        globalThis.changeTheme("light");
                    }
                }, 1000);

                document.body.insertAdjacentHTML("afterbegin", '<canvas class="dont-eat" style="position:fixed;top:0;left:0;bottom:0;right:0;z-index:100000;border:none;pointer-events:none">');
                const canvas = document.body.firstElementChild as HTMLCanvasElement;

                const context = canvas.getContext("2d");

                const worms: Worm[] = [];
                const attacking_worms: Worm[] = [];

                setInterval(() => {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;

                    context.clearRect(0, 0, canvas.width, canvas.height);

                    for (const worm of worms) {
                        worm.move();
                    }
                    for (let i = 0; i < attacking_worms.length; ++i) {
                        const worm = attacking_worms[i];
                        worm.move();
                        if (worm.state == WormState.DEAD) attacking_worms.splice(i--, 1);
                    }
                }, 50);

                let n = 0;

                const NUM_ATK = 30;
                const NUM_REG = 20;

                setInterval(() => {
                    if (worms.length < NUM_REG+1 && attacking_worms.length < NUM_ATK) {
                        worms.push(new Worm(context, `hsl(${Math.random()*360}, 100%, 50%)`, Math.random()*5+5, Math.random()*10+15));
                        if (worms.length > NUM_REG) {
                            const worm = worms.shift();
                            worm.state = WormState.ATTACKING;
                            attacking_worms.push(worm);
                        }
                    }
                }, 100);
            }
        } else {
            key_i = 0;
        }
    }
});


// The real sitelock
e('aWYgKGxvY2F0aW9uLmhvc3QgIT0gIm1hdGhnZW5pdXN6YWNoLmdpdGh1Yi5pbyIgJiYgbG9jYXRpb24uaG9zdCAhPSAibG9jYWxob3N0OjEyMzQiICYmIGxvY2F0aW9uLmhvc3QgIT0gInd3dy5tYXRoZ2VuaXVzemFjaC5jb20iICYmIGxvY2F0aW9uLmhvc3QgIT0gIm1hdGhnZW5pdXN6YWNoLmNvbSIgJiYgbG9jYXRpb24ucHJvdG9jb2wgIT0gImZpbGU6IikgewogICAgd2luZG93LnN0b3AoKTsKICAgIGxvY2F0aW9uLmhvc3QgPSAid3d3Lm1hdGhnZW5pdXN6YWNoLmNvbSI7CiAgICBsb2NhdGlvbi5yZWxvYWQoKTsKfQ==');