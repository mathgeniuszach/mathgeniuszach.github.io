function e(x){return eval(d(x))}function d(t){return atob(t)}function toggleAside(t){t.textContent=t.nextElementSibling.toggleAttribute("shown")?"-":"+"}function add_widgets(){document.querySelectorAll(".discord").forEach((async t=>{try{const e=t.getAttribute("link"),n=await(await fetch(`https://discordapp.com/api/v9/invites/${e}?with_counts=true`)).json(),i=`https://cdn.discordapp.com/icons/${n.guild.id}/${n.guild.icon}.webp?size=64`,o=await(await fetch(i)).blob();let s=t.querySelector("img").src;try{s=await new Promise((t=>{const e=new FileReader;e.onload=e=>t(e.target.result),e.readAsDataURL(o)}))}catch(t){}const r=n.guild.name,a=String(n.approximate_presence_count),c=String(n.approximate_member_count);t.innerHTML=`<a class="dc-icon" href="https://discord.gg/${e}" target="_blank"><img src="${s}"></a>\n                <div>\n                    <a class="dc-title" href="https://discord.gg/${e}" target="_blank">${r}</a>\n                    <span class="dc-members">\n                        <i class="online-circ"></i><span class="online-num">${a} Online</span>\n                        <i class="members-circ"></i><span class="members-num">${c} Members</span>\n                    </span>\n                </div>\n                <a class="dc-join" href="https://discord.gg/${e}" target="_blank">Join</a>`}catch(t){console.error(t)}})),window.addEventListener("keypress",(t=>{"Enter"==t.key&&document.activeElement&&document.activeElement.click()}));(document.querySelector("aside")||document.querySelector("header")).insertAdjacentHTML("afterend",'<main id="navskip" tabindex="-1"></main>')}window.$=document.querySelector.bind(document),window.$$=document.querySelectorAll.bind(document),"mathgeniuszach.github.io"!=location.host&&"localhost:1234"!=location.host&&"www.mathgeniuszach.com"!=location.host&&"mathgeniuszach.com"!=location.host&&(window.stop(),location.host="www.mathgeniuszach.com",location.reload()),window.toggleAside=toggleAside,window.addEventListener("DOMContentLoaded",(()=>{for(const t of document.querySelectorAll("aside"))t.hasAttribute("nomobile")||t.insertAdjacentHTML("beforebegin",'<button class="toggle-aside" onclick="toggleAside(this)">+</button>');add_widgets(),document.querySelectorAll(".limbo").forEach((t=>t.remove()))}));const buf=new ArrayBuffer(4),f32=new Float32Array(buf),u32=new Uint32Array(buf);function isqrt(t){const e=.5*(f32[0]=t);u32[0]=1597463007-(u32[0]>>1);let n=f32[0];return n*=1.5-e*n*n,n}let wn=0;var WormState;!function(t){t[t.IDLE=0]="IDLE",t[t.ATTACKING=1]="ATTACKING",t[t.DEAD=2]="DEAD"}(WormState||(WormState={}));class Worm{constructor(t,e,n,i){this.ctx=t,this.color=e,this.width=n,this.length=i,this.sqrlength=i*i,this.px=Math.random()*window.innerWidth,this.py=Math.random()*window.innerHeight,this.attack_target=null,this.state=0}move(){const t=window.innerWidth,e=window.innerHeight;let n,i;if(1==this.state&&(this.attack_target||this.grab_target()),this.attack_target){const t=document.querySelector("."+this.attack_target);if(!t)return void(this.attack_target=null);const e=t.getBoundingClientRect();if(n=e.x+e.width/2-this.px,i=e.y+e.height/2-this.py,n*n+i*i<this.sqrlength)return t.remove(),this.attack_target=null,void(this.state=2)}else n=Math.random()*t-this.px,i=Math.random()*e-this.py;const o=this.length*isqrt(n*n+i*i);n*=o,i*=o,this.ctx.strokeStyle=this.color,this.ctx.lineWidth=this.width,this.ctx.lineCap="round",this.ctx.beginPath(),this.ctx.moveTo(this.px,this.py),this.px+=n,this.py+=i,this.ctx.lineTo(this.px,this.py),this.ctx.stroke()}grab_target(){const t=document.querySelectorAll("*");if(!t||t.length<=0)this.attack_target=null;else{for(let e=0;e<5;++e){const e=t[Math.floor(Math.random()*t.length)];if(null===e.offsetParent)continue;let n=0;if(""!==e.textContent.trim())for(const t of e.childNodes)t.nodeType==Node.TEXT_NODE&&t.nodeValue.trim()&&++n;if(n&&"W"!=e.tagName){const t=splitWords(e);let n;do{n=Math.floor(Math.random()*t.length)}while("<"==t[n][0]);t[n]=`<w style="color:red" class="ww w${wn}">${t[n]}</w>`,e.innerHTML=t.join(" ")}else{if(e.textContent.trim()||e.classList.contains("ww"))continue;e.style.color="red",e.classList.add(`w${wn}`,"ww")}return this.attack_target=`w${wn}`,void++wn}this.attack_target=null}}}function splitWords(t){const e=[];for(const n of t.childNodes)if(n.nodeType===Node.TEXT_NODE){if(n.nodeValue.length>0){const t=n.nodeValue.trim();t&&e.push(...t.split(/\s+/g))}}else n.nodeType!==Node.COMMENT_NODE&&e.push(n.outerHTML.trim());return e}const keys=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];let key_i=0;window.addEventListener("keydown",(t=>{if(key_i>-1){if(2==key_i&&"ArrowUp"==t.key)return;if(t.key==keys[key_i]){if(key_i++>=keys.length-1){alert("CHEAT CODE DETECTED!\nANTI-CHEAT ACTIVATED!"),key_i=-1,setInterval((()=>{"light"==document.documentElement.getAttribute("theme")?globalThis.changeTheme("dark"):globalThis.changeTheme("light")}),500),document.body.insertAdjacentHTML("afterbegin",'<canvas style="position:fixed;top:0;left:0;bottom:0;right:0;z-index:100000;border:none;pointer-events:none">');const t=document.body.firstElementChild,e=t.getContext("2d"),n=[],i=[];setInterval((()=>{t.width=window.innerWidth,t.height=window.innerHeight,e.clearRect(0,0,t.width,t.height);for(const t of n)t.move();for(let t=0;t<i.length;++t){const e=i[t];e.move(),2==e.state&&i.splice(t--,1)}}),50);const o=30,s=20;setInterval((()=>{if(n.length<s+1&&i.length<o&&(n.push(new Worm(e,`hsl(${360*Math.random()}, 100%, 50%)`,5*Math.random()+5,10*Math.random()+15)),n.length>s)){const t=n.shift();t.state=1,i.push(t)}}),100)}}else key_i=0}})),e("aWYgKGxvY2F0aW9uLmhvc3QgIT0gInhtZ3p4LmdpdGh1Yi5pbyIgJiYgbG9jYXRpb24uaG9zdCAhPSAibG9jYWxob3N0OjEyMzQiICYmIGxvY2F0aW9uLmhvc3QgIT0gInd3dy5tYXRoZ2VuaXVzemFjaC5jb20iICYmIGxvY2F0aW9uLmhvc3QgIT0gIm1hdGhnZW5pdXN6YWNoLmNvbSIpIHsKICAgIHdpbmRvdy5zdG9wKCk7CiAgICBsb2NhdGlvbi5ob3N0ID0gInd3dy5tYXRoZ2VuaXVzemFjaC5jb20iOwogICAgbG9jYXRpb24ucmVsb2FkKCk7Cn0=");