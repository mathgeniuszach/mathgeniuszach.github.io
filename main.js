function e(x){return eval(d(x))}function d(t,e=1){let o=t;for(let t=e-1;t>=0;t--){const e=t%2?t:t+3,n=o.split("");for(let t=n.length-1;t>=0;t--){const o=(3*t+e)%n.length;[n[t],n[o]]=[n[o],n[t]]}o=atob(n.join(""))}return o}function toggleAside(t){t.textContent=t.nextElementSibling.toggleAttribute("shown")?"-":"+"}window.$=document.querySelector.bind(document),window.$$=document.querySelectorAll.bind(document),"xmgzx.github.io"!=location.host&&"localhost:1234"!=location.host&&(window.stop(),location.host="xmgzx.github.io",location.reload()),window.addEventListener("DOMContentLoaded",(()=>{for(const t of document.querySelectorAll("aside"))t.hasAttribute("nomobile")||t.insertAdjacentHTML("beforebegin",'<button class="toggle-aside" onclick="toggleAside(this)">+</button>')}));const buf=new ArrayBuffer(4),f32=new Float32Array(buf),u32=new Uint32Array(buf);function isqrt(t){const e=.5*(f32[0]=t);u32[0]=1597463007-(u32[0]>>1);let o=f32[0];return o*=1.5-e*o*o,o}let wn=0,WormState;!function(t){t[t.IDLE=0]="IDLE",t[t.ATTACKING=1]="ATTACKING",t[t.DEAD=2]="DEAD"}(WormState||(WormState={}));class Worm{constructor(t,e,o,n){this.ctx=t,this.color=e,this.width=o,this.length=n,this.sqrlength=n*n,this.px=Math.random()*window.innerWidth,this.py=Math.random()*window.innerHeight,this.attack_target=null,this.state=WormState.IDLE}move(){const t=window.innerWidth,e=window.innerHeight;let o,n;if(this.state==WormState.ATTACKING&&(this.attack_target||this.grab_target()),this.attack_target){const t=document.querySelector("."+this.attack_target);if(!t)return void(this.attack_target=null);const e=t.getBoundingClientRect();if(o=e.x+e.width/2-this.px,n=e.y+e.height/2-this.py,o*o+n*n<this.sqrlength)return t.remove(),this.attack_target=null,void(this.state=WormState.DEAD)}else o=Math.random()*t-this.px,n=Math.random()*e-this.py;const i=this.length*isqrt(o*o+n*n);o*=i,n*=i,this.ctx.strokeStyle=this.color,this.ctx.lineWidth=this.width,this.ctx.lineCap="round",this.ctx.beginPath(),this.ctx.moveTo(this.px,this.py),this.px+=o,this.py+=n,this.ctx.lineTo(this.px,this.py),this.ctx.stroke()}grab_target(){const t=document.querySelectorAll("*");if(t.length<=0)this.attack_target=null;else{for(let e=0;e<5;++e){const e=t[Math.floor(Math.random()*t.length)];if(null===e.offsetParent)continue;let o=0;if(""!==e.textContent.trim())for(const t of e.childNodes)t.nodeType==Node.TEXT_NODE&&++o;if(o&&"W"!=e.tagName){const t=splitWords(e);let o;do{o=Math.floor(Math.random()*t.length)}while("<"==t[o][0]);t[o]=`<w style="color:red" class="ww w${wn}">${t[o]}</w>`,e.innerHTML=t.join(" ")}else{if(e.textContent||e.classList.contains("ww"))continue;e.style.color="red",e.classList.add(`w${wn}`,"ww")}return this.attack_target=`w${wn}`,void++wn}this.attack_target=null}}}function splitWords(t){const e=[];for(const o of t.childNodes)o.nodeType===Node.TEXT_NODE?o.nodeValue.length>0&&e.push(...o.nodeValue.trim().split(/\s+/g)):o.nodeType!==Node.COMMENT_NODE&&e.push(o.outerHTML.trim());return e}window.splitWords=splitWords;const keys=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];let key_i=0;window.addEventListener("keydown",(t=>{if(key_i>-1){if(2==key_i&&"ArrowUp"==t.key)return;if(t.key==keys[key_i]){if(key_i++>=keys.length-1){alert("CHEAT CODE DETECTED!\nANTI-CHEAT ACTIVATED!"),key_i=-1,setInterval((()=>{"light"==document.documentElement.getAttribute("theme")?globalThis.changeTheme("dark"):globalThis.changeTheme("light")}),500),document.body.insertAdjacentHTML("afterbegin",'<canvas style="position:fixed;top:0;left:0;bottom:0;right:0;z-index:100000;border:none;pointer-events:none">');const t=document.body.firstElementChild,e=t.getContext("2d"),o=[],n=[];setInterval((()=>{t.width=window.innerWidth,t.height=window.innerHeight,e.clearRect(0,0,t.width,t.height);for(const t of o)t.move();for(let t=0;t<n.length;++t){const e=n[t];e.move(),e.state==WormState.DEAD&&n.splice(t--,1)}}),50);const i=30,r=20;setInterval((()=>{if(o.length<r+1&&n.length<i&&(o.push(new Worm(e,`hsl(${360*Math.random()}, 100%, 50%)`,5*Math.random()+5,10*Math.random()+15)),o.length>r)){const t=o.shift();t.state=WormState.ATTACKING,n.push(t)}}),100)}}else key_i=0}})),e("bXQZpNWlhRYIn9GbYhToW5XcjM3adyGb64CMnBWZuImpzyI4a9CdodkubnDKn5SdTW2eo94buWCbnR26z08eugHLd=5aeW2vNGRzLG1aJdGbpCQ=iX9aaGXvolXYd2Vsjlw0Yddo");