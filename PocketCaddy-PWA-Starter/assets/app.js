/* Pocket Caddy Web - client-side store (localStorage) + simple auto-class + preview */
const storeKey = "pc_items_v1";

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function loadItems(){
  try{ return JSON.parse(localStorage.getItem(storeKey) || "[]"); }
  catch(e){ return []; }
}
function saveItems(items){ localStorage.setItem(storeKey, JSON.stringify(items)); render(items); }

function classify(url, note=false){
  if(note) return "note";
  if(!url) return "site";
  const u = url.toLowerCase();
  const domain = (u.match(/^https?:\/\/([^/]+)/)?.[1] || "").toLowerCase();
  if(u.includes("youtu.be") || domain.includes("youtube.com")) return "video";
  if(u.match(/\.(png|jpg|jpeg|gif|webp|avif|svg)(\?|#|$)/)) return "image";
  if(/openai|claude|perplexity|huggingface|replicate|stability\.ai/.test(domain)) return "ai";
  if(/blender|unrealengine|quixel|polyhaven|sketchfab|mixamo|epicgames/.test(domain)) return "creative";
  if(/fx|vfx|sfx|sound|freesound|videvo|pixabay|mixkit|productioncrate/.test(domain)) return "sfxvfx";
  if(/github|gitlab|stack|npmjs|codesandbox|codepen/.test(domain)) return "code";
  return "site";
}

function ytThumb(url){
  try{
    const u = new URL(url);
    if(u.hostname.includes("youtu.be")) return `https://i.ytimg.com/vi/${u.pathname.slice(1)}/hqdefault.jpg`;
    if(u.hostname.includes("youtube.com")){
      const id = u.searchParams.get("v");
      if(id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    }
  }catch(e){}
  return null;
}
function favicon(domain){
  return `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(domain)}`;
}
function getDomain(url){
  try{ return new URL(url).hostname; } catch(e){ return ""; }
}

function mkItem({url, title, noteText}){
  const type = classify(url, !!noteText);
  const domain = url ? getDomain(url) : "";
  let thumb = null;
  if(type === "video") thumb = ytThumb(url);
  else if(type === "image") thumb = url;
  else if(domain) thumb = favicon(domain);

  return {
    id: Date.now() + "-" + Math.random().toString(36).slice(2,7),
    type, url: url || null, title: title || (url ? url : "Note"),
    noteText: noteText || null, domain, createdAt: new Date().toISOString(),
    thumb
  };
}

function addURL(url){
  if(!url) return toast("URL vide");
  // dedupe
  const items = loadItems();
  if(items.some(i => i.url === url)) return toast("Déjà présent");
  const it = mkItem({url});
  items.unshift(it);
  saveItems(items);
  toast("Ajouté");
}

function addNote(title){
  if(!title) return toast("Titre vide");
  const items = loadItems();
  const it = mkItem({title, noteText: ""});
  items.unshift(it);
  saveItems(items);
  toast("Note créée");
}

function removeItem(id){
  const items = loadItems().filter(i => i.id !== id);
  saveItems(items);
}

function render(items=loadItems()){
  const q = $("#search").value.trim().toLowerCase();
  const type = $("#filter-type").value;
  const root = $("#items");
  root.innerHTML = "";
  items
    .filter(i => type==="all" ? true : i.type===type)
    .filter(i => !q || (i.title?.toLowerCase().includes(q) || i.url?.toLowerCase().includes(q) || i.domain?.toLowerCase().includes(q)))
    .forEach(i => {
      const tpl = $("#card-template").content.cloneNode(true);
      const card = tpl.querySelector(".card");
      const img = tpl.querySelector("img");
      const title = tpl.querySelector(".title");
      const sub = tpl.querySelector(".sub");
      const open = tpl.querySelector(".open");
      const del = tpl.querySelector(".del");

      img.src = i.thumb || "/assets/icons/icon-192.png";
      title.textContent = i.title || i.url || "Sans titre";
      sub.textContent = (i.type.toUpperCase()) + (i.domain ? " • " + i.domain : "") + " • " + new Date(i.createdAt).toLocaleString();
      if(i.url){
        open.href = i.url;
        open.style.display = "inline-flex";
      } else {
        open.style.display = "none";
      }
      del.onclick = () => removeItem(i.id);
      root.appendChild(tpl);
    });
}

function toast(msg){
  let t = document.createElement("div");
  t.className = "toast glass";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=> t.classList.add("show"), 10);
  setTimeout(()=> t.classList.remove("show"), 1900);
  setTimeout(()=> t.remove(), 2400);
}

function handleCaptureParam(){
  try{
    const u = new URL(location.href);
    const cap = u.searchParams.get("url");
    if(cap){
      addURL(cap);
      // remove param after adding
      u.searchParams.delete("url");
      history.replaceState({}, "", u.pathname);
    }
  }catch(e){}
}

// Install prompt
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e)=>{
  e.preventDefault(); deferredPrompt = e;
  $("#btn-install").style.display = "inline-flex";
});
$("#btn-install").addEventListener("click", async ()=>{
  if(deferredPrompt){ deferredPrompt.prompt(); deferredPrompt = null; }
  else alert("Sur iPhone : Safari → Partager → 'Ajouter à l’écran d’accueil'");
});

// Events
$("#add-url").onclick = ()=> addURL($("#url-input").value.trim());
$("#add-note").onclick = ()=> addNote($("#note-title").value.trim());
$("#btn-export").onclick = (e)=>{
  e.preventDefault();
  const blob = new Blob([localStorage.getItem(storeKey) || "[]"], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "pocketcaddy_export.json";
  a.click();
};
$("#import-file").addEventListener("change", async (e)=>{
  const file = e.target.files?.[0]; if(!file) return;
  const text = await file.text();
  try{
    const data = JSON.parse(text);
    if(Array.isArray(data)){ saveItems(data); toast("Import ok"); }
    else toast("Fichier invalide");
  }catch{ toast("JSON invalide"); }
});
$("#btn-clear").onclick = ()=>{
  if(confirm("Supprimer tous les éléments ?")){ localStorage.removeItem(storeKey); render([]); }
};
$("#filter-type").onchange = ()=> render();
$("#search").oninput = ()=> render();

// SW
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("/service-worker.js").catch(()=>{});
}

handleCaptureParam();
render();
