var WormState;function e(x){return eval(d(x))}function d(t){return atob(t)}function add_widgets(){// Discord widgets
document.querySelectorAll("discord").forEach(async t=>{let n=t.getAttribute("link");t.innerHTML=`<a class="dc-icon" href="https://discord.gg/${n}" target="_blank">
                <img style="opacity:0" src="https://cdn.discordapp.com/icons/421862906091798529/08d5e8eb1d0ebc0730ee203be48b1876.webp?size=64">
            </a>
            <div>
                <a class="dc-title" href="https://discord.gg/${n}" target="_blank">...</a>
                <span class="dc-members">
                    <i class="online-circ"></i><span class="online-num">?? Online</span>
                    <i class="members-circ"></i><span class="members-num">?? Members</span>
                </span>
            </div>
            <a class="dc-join" href="https://discord.gg/${n}" target="_blank">Join</a>`;let i=await (await fetch(`https://discordapp.com/api/v9/invites/${n}?with_counts=true`)).json(),o=`https://cdn.discordapp.com/icons/${i.guild.id}/${i.guild.icon}.webp?size=64`,s=i.guild.name,a=String(i.approximate_presence_count),r=String(i.approximate_member_count);t.innerHTML=`<a class="dc-icon" href="https://discord.gg/${n}" target="_blank"><img src="${o}"></a>
            <div>
                <a class="dc-title" href="https://discord.gg/${n}" target="_blank">${s}</a>
                <span class="dc-members">
                    <i class="online-circ"></i><span class="online-num">${a} Online</span>
                    <i class="members-circ"></i><span class="members-num">${r} Members</span>
                </span>
            </div>
            <a class="dc-join" href="https://discord.gg/${n}" target="_blank">Join</a>`}),// Accordions
document.querySelectorAll(".expand").forEach(async t=>{let n=t.firstElementChild,i=n.innerHTML;n.innerHTML="<p class='bi bi-plus'></p> "+i,n.setAttribute("tabindex","0"),n.addEventListener("click",()=>{t.toggleAttribute("shown")?n.innerHTML="<p class='bi bi-dash'></p> "+i:n.innerHTML="<p class='bi bi-plus'></p> "+i})}),window.addEventListener("keypress",t=>{"Enter"==t.key&&document.activeElement&&document.activeElement.click()});// Skip nav main element
let t=document.querySelector("aside")||document.querySelector("header");t.insertAdjacentHTML("afterend",'<main id="navskip" tabindex="-1"></main>')}window.$=document.querySelector.bind(document),// eslint-disable-next-line no-undef
window.$$=document.querySelectorAll.bind(document),"xmgzx.github.io"!=location.host&&"localhost:1234"!=location.host&&"www.mathgeniuszach.com"!=location.host&&"mathgeniuszach.com"!=location.host&&(window.stop(),location.host="www.mathgeniuszach.com",location.reload()),window.addEventListener("DOMContentLoaded",()=>{for(let t of document.querySelectorAll("aside"))t.hasAttribute("nomobile")||t.insertAdjacentHTML("beforebegin",'<button class="toggle-aside" onclick="toggleAside(this)">+</button>');add_widgets(),// Delete preloaders
document.querySelectorAll(".limbo").forEach(t=>t.remove())});// Cheats
// https://gist.github.com/starfys/aaaee80838d0e013c27d
const buf=new ArrayBuffer(4),f32=new Float32Array(buf),u32=new Uint32Array(buf);function isqrt(t){let n=.5*(f32[0]=t);u32[0]=1597463007-(u32[0]>>1);let i=f32[0];return i*(1.5-n*i*i)}let wn=0;!function(t){t[t.IDLE=0]="IDLE",t[t.ATTACKING=1]="ATTACKING",t[t.DEAD=2]="DEAD"}(WormState||(WormState={}));class Worm{constructor(t,n,i,o){this.ctx=t,this.color=n,this.width=i,this.length=o,this.sqrlength=o*o,this.px=Math.random()*window.innerWidth,this.py=Math.random()*window.innerHeight,this.attack_target=null,this.state=WormState.IDLE}move(){let t,n;let i=window.innerWidth,o=window.innerHeight;if(this.state!=WormState.ATTACKING||this.attack_target||this.grab_target(),this.attack_target){let i=document.querySelector("."+this.attack_target);if(!i){this.attack_target=null;return}let o=i.getBoundingClientRect();if((t=o.x+o.width/2-this.px)*t+(n=o.y+o.height/2-this.py)*n<this.sqrlength){i.remove(),this.attack_target=null,this.state=WormState.DEAD;return}}else t=Math.random()*i-this.px,n=Math.random()*o-this.py;let s=this.length*isqrt(t*t+n*n);t*=s,n*=s,this.ctx.strokeStyle=this.color,this.ctx.lineWidth=this.width,this.ctx.lineCap="round",this.ctx.beginPath(),this.ctx.moveTo(this.px,this.py),this.px+=t,this.py+=n,this.ctx.lineTo(this.px,this.py),this.ctx.stroke()}grab_target(){let t=document.querySelectorAll("*");if(!t||t.length<=0){this.attack_target=null;return}for(let n=0;n<5;++n){let n=t[Math.floor(Math.random()*t.length)];if(null===n.offsetParent)continue;// Ignore invisible elements
let i=0;if(""!==n.textContent.trim())for(let t of n.childNodes)t.nodeType==Node.TEXT_NODE&&t.nodeValue.trim()&&++i;if(i&&"W"!=n.tagName){let t;let i=splitWords(n);do t=Math.floor(Math.random()*i.length);while("<"==i[t][0])// This loop is guaranteed to eventually find a match. Eventually.
i[t]=`<w style="color:red" class="ww w${wn}">${i[t]}</w>`,n.innerHTML=i.join(" ")}else{if(n.textContent.trim()||n.classList.contains("ww"))continue;n.style.color="red",n.classList.add(`w${wn}`,"ww")}this.attack_target=`w${wn}`,++wn;return}this.attack_target=null}}function splitWords(t){let n=[];for(let i of t.childNodes)if(i.nodeType===Node.TEXT_NODE){if(i.nodeValue.length>0){let t=i.nodeValue.trim();t&&n.push(...t.split(/\s+/g))}}else i.nodeType!==Node.COMMENT_NODE&&n.push(i.outerHTML.trim());return n}const keys=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];let key_i=0;window.addEventListener("keydown",t=>{if(key_i>-1&&(2!=key_i||"ArrowUp"!=t.key)){if(t.key==keys[key_i]){if(key_i++>=keys.length-1){alert("CHEAT CODE DETECTED!\nANTI-CHEAT ACTIVATED!"),key_i=-1,setInterval(()=>{"light"==document.documentElement.getAttribute("theme")?globalThis.changeTheme("dark"):globalThis.changeTheme("light")},500),document.body.insertAdjacentHTML("afterbegin",'<canvas style="position:fixed;top:0;left:0;bottom:0;right:0;z-index:100000;border:none;pointer-events:none">');let t=document.body.firstElementChild,n=t.getContext("2d"),i=[],o=[];setInterval(()=>{for(let o of(t.width=window.innerWidth,t.height=window.innerHeight,n.clearRect(0,0,t.width,t.height),i))o.move();for(let t=0;t<o.length;++t){let n=o[t];n.move(),n.state==WormState.DEAD&&o.splice(t--,1)}},50);let s=30,a=20;setInterval(()=>{if(i.length<a+1&&o.length<s&&(i.push(new Worm(n,`hsl(${360*Math.random()}, 100%, 50%)`,5*Math.random()+5,10*Math.random()+15)),i.length>a)){let t=i.shift();t.state=WormState.ATTACKING,o.push(t)}},100)}}else key_i=0}}),// The real sitelock
e("aWYgKGxvY2F0aW9uLmhvc3QgIT0gInhtZ3p4LmdpdGh1Yi5pbyIgJiYgbG9jYXRpb24uaG9zdCAhPSAibG9jYWxob3N0OjEyMzQiICYmIGxvY2F0aW9uLmhvc3QgIT0gInd3dy5tYXRoZ2VuaXVzemFjaC5jb20iICYmIGxvY2F0aW9uLmhvc3QgIT0gIm1hdGhnZW5pdXN6YWNoLmNvbSIpIHsKICAgIHdpbmRvdy5zdG9wKCk7CiAgICBsb2NhdGlvbi5ob3N0ID0gInd3dy5tYXRoZ2VuaXVzemFjaC5jb20iOwogICAgbG9jYXRpb24ucmVsb2FkKCk7Cn0=");