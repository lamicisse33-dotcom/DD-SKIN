document.getElementById('year')?.replaceChildren(String(new Date().getFullYear()));
let deferredInstallPrompt=null;
const installAppBtn=document.getElementById('installAppBtn');
const iosInstallBtn=document.getElementById('iosInstallBtn');
const androidInstallBtn=document.getElementById('androidInstallBtn');
const installModal=document.getElementById('installModal');
const ua=navigator.userAgent||'';
const isIOS=/iPhone|iPad|iPod/i.test(ua);
const isAndroid=/Android/i.test(ua);
const isStandalone=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
function show(el){if(el)el.hidden=false}
function hide(el){if(el)el.hidden=true}
function openGuide(){if(installModal)installModal.hidden=false}
function closeGuide(){if(installModal)installModal.hidden=true}
document.querySelectorAll('[data-install-close]').forEach(el=>el.addEventListener('click',closeGuide));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeGuide()});
async function installNow(){
  if(deferredInstallPrompt){
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt=null;
    hide(installAppBtn);hide(androidInstallBtn);
  }else if(isIOS&&!isStandalone){openGuide()}
}
installAppBtn?.addEventListener('click',installNow);
androidInstallBtn?.addEventListener('click',installNow);
iosInstallBtn?.addEventListener('click',openGuide);
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  deferredInstallPrompt=e;
  if(!isStandalone){show(installAppBtn);show(androidInstallBtn)}
});
window.addEventListener('appinstalled',()=>{
  deferredInstallPrompt=null;
  hide(installAppBtn);hide(iosInstallBtn);hide(androidInstallBtn);closeGuide();
});
if(!isStandalone){
  if(isIOS){show(iosInstallBtn);setTimeout(()=>{if(!sessionStorage.getItem('ddskin-ios-guide')){openGuide();sessionStorage.setItem('ddskin-ios-guide','1')}},1800)}
  else if(isAndroid){show(androidInstallBtn)}
}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));}
