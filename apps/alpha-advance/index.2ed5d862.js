let e=localStorage.getItem("alpha-settings");e||(e="4/1/5/0:3/1/0/0:5/1/1/12/4",localStorage.setItem("alpha-settings",e));let t=localStorage.getItem("alpha-controls");t||(t="q,w,e,r   i,o,p",localStorage.setItem("alpha-controls",t)),document.addEventListener("DOMContentLoaded",(()=>{const a=document.querySelector.bind(document),o=document.querySelectorAll.bind(document),l=a("#settings");function n(e){const t=o("form .panel");e.split(":").map((e=>e.split("/"))).forEach(((e,a)=>{const o=t[a].querySelectorAll("input");e.forEach(((e,t)=>{const a=o[t];"checkbox"==a.type?a.checked=!!parseInt(e):a.value=e}))}))}function c(e){try{n(e)}catch(e){l.value="4/1/5/0:3/1/0/0:5/1/1/12/4",n(l.value)}}function r(){const e=Array.from(o("form .panel")).map((e=>Array.from(e.querySelectorAll("input")).map((e=>"checkbox"==e.type?e.checked+0:e.value)).join("/"))).join(":");localStorage.setItem("alpha-settings",e),l.value=e}l.value=e,c(e),l.addEventListener("change",(e=>{const t=e.target.value;c(t),localStorage.setItem("alpha-settings",t)})),a("#reset").addEventListener("click",(()=>{l.value="4/1/5/0:3/1/0/0:5/1/1/12/4",c(l.value),localStorage.setItem("alpha-settings",l.value)})),o("form input").forEach((e=>e.addEventListener("change",r)));const s=a("#controls");s.value=t,s.addEventListener("change",(e=>{const t=e.target.value;localStorage.setItem("alpha-controls",t)}))}));