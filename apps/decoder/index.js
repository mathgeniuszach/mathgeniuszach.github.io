const e={binary:{decode:e=>"",encode:e=>""}};window.addEventListener("DOMContentLoaded",(()=>{"d-auto"in localStorage||localStorage.setItem("d-auto","1");const d=!!localStorage.getItem("d-auto"),t=document.getElementById("auto"),n=document.getElementById("decoded"),o=document.getElementById("encoded");t.checked=d,document.getElementById("encode").addEventListener("click",(()=>{o.value=e.binary.encode(n.value)})),document.getElementById("decode").addEventListener("click",(()=>{n.value=e.binary.decode(o.value)}))}));