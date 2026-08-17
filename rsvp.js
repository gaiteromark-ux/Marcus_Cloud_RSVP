const form=document.getElementById("rsvpForm");
const statusEl=document.getElementById("formStatus");
const submitBtn=document.getElementById("submitBtn");

function setStatus(msg,type=""){ statusEl.textContent=msg; statusEl.className="status "+type; }

form?.addEventListener("submit", async (e)=>{
  e.preventDefault();
  if(!form.reportValidity()) return;
  if(!APP_CONFIG.APPS_SCRIPT_WEB_APP_URL || APP_CONFIG.APPS_SCRIPT_WEB_APP_URL.includes("PASTE_")){
    setStatus("The RSVP system is not connected yet. Please contact the organizer.","error"); return;
  }
  submitBtn.disabled=true; submitBtn.textContent="Sending…"; setStatus("");
  const data=Object.fromEntries(new FormData(form).entries());
  data.numberOfGuests=Number(data.numberOfGuests);
  data.action="submit";
  try{
    const res=await fetch(APP_CONFIG.APPS_SCRIPT_WEB_APP_URL,{method:"POST",body:JSON.stringify(data)});
    const out=await res.json();
    if(!out.ok){
      setStatus(out.message || "We could not save your RSVP.","error");
      submitBtn.disabled=false; submitBtn.textContent="Submit RSVP"; return;
    }
    form.classList.add("hidden");
    document.getElementById("guestName").textContent=data.fullName;
    document.getElementById("confirmation").classList.remove("hidden");
    if(data.godparentResponse==="Yes, I would be honored!") document.getElementById("godparentThanks").classList.remove("hidden");
  }catch(err){
    setStatus("Connection error. Please try again or contact the organizer.","error");
    submitBtn.disabled=false; submitBtn.textContent="Submit RSVP";
  }
});