const opening = document.getElementById("opening");
function closeOpening(){ if(opening){ opening.classList.add("closed"); setTimeout(()=>opening.remove(),500); } }

function countdown(){
  const target = new Date(APP_CONFIG.eventDateISO).getTime();
  const el = document.getElementById("countdown");
  if(!el) return;
  const tick=()=>{
    const diff=Math.max(0,target-Date.now());
    const d=Math.floor(diff/86400000), h=Math.floor(diff/3600000)%24, m=Math.floor(diff/60000)%60, s=Math.floor(diff/1000)%60;
    el.innerHTML=[["Days",d],["Hours",h],["Minutes",m],["Seconds",s]].map(x=>`<div><b>${String(x[1]).padStart(2,"0")}</b><span>${x[0]}</span></div>`).join("");
  };
  tick(); setInterval(tick,1000);
}

function rsvpUrl(){ return new URL("rsvp.html", window.location.href).href; }

function makeQR(){
  const box=document.getElementById("qrcode");
  if(!box) return;
  const url=rsvpUrl();
  box.innerHTML="";

  // Primary method: QRCode.js, if the CDN is available.
  if(typeof QRCode !== "undefined"){
    try{
      new QRCode(box,{text:url,width:220,height:220,colorDark:"#263746",colorLight:"#ffffff",correctLevel:QRCode.C});
      setupQRDownload(()=>{
        const canvas=box.querySelector("canvas");
        return canvas ? canvas.toDataURL("image/png") : null;
      });
      return;
    }catch(e){ console.warn("QRCode.js failed; using image fallback.",e); }
  }

  // Reliable visual fallback. The QR points directly to rsvp.html, never to the Sheet.
  const img=document.createElement("img");
  img.alt="QR code to RSVP";
  img.width=220; img.height=220;
  img.loading="eager";
  img.src="https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=12&data="+encodeURIComponent(url);
  box.appendChild(img);
  setupQRDownload(()=>img.src);
}

function setupQRDownload(getSource){
  const dl=document.getElementById("downloadQR");
  if(!dl) return;
  dl.onclick=async()=>{
    const source=getSource();
    if(!source) return;
    try{
      const response=await fetch(source);
      const blob=await response.blob();
      const objectUrl=URL.createObjectURL(blob);
      const a=document.createElement("a"); a.download="marcus-cloud-rsvp-qr.png"; a.href=objectUrl; a.click();
      setTimeout(()=>URL.revokeObjectURL(objectUrl),1000);
    }catch(e){
      // Some browsers block cross-origin downloads; open the QR image instead.
      window.open(source,"_blank","noopener");
    }
  };
}

function addCalendar(){
  const start="20260929T030000Z", end="20260929T050000Z";
  const url=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Marcus Cloud — Christening & 1st Birthday")}&dates=${start}/${end}&details=${encodeURIComponent("Christening & Birthday Celebration")}&location=${encodeURIComponent("Our Lady of the Miraculous Medal Parish, Calumpang, Molo, Iloilo City; Reception: Jollibee Molo")}`;
  window.open(url,"_blank");
}

document.addEventListener("DOMContentLoaded",()=>{countdown();makeQR();});
