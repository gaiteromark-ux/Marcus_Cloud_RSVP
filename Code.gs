/**
 * Marcus Cloud Gaitero RSVP backend
 *
 * IMPORTANT:
 * 1. Create the Google Sheet first.
 * 2. In Apps Script: Project Settings > Script Properties.
 * 3. Add SHEET_ID = your spreadsheet ID.
 * 4. Optionally add DASHBOARD_TOKEN = a long random secret.
 *
 * The spreadsheet ID is never sent to the browser.
 */

const HEADERS = [
  "Timestamp","Full Name","Contact Number","Email Address",
  "Number of Guests","Attendance","Godparent Response","Message"
];

function setupSheet() {
  const id = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
  if (!id) throw new Error("Missing SHEET_ID in Script Properties.");
  const ss = SpreadsheetApp.openById(id);
  let sh = ss.getSheetByName("RSVP");
  if (!sh) sh = ss.insertSheet("RSVP");
  sh.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
  sh.setFrozenRows(1);
  return sh;
}

function doGet(e) {
  return json_({ok:true, service:"Marcus Cloud RSVP", message:"RSVP endpoint is online."});
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    if (data.action !== "submit") return json_({ok:false,message:"Invalid request."});
    validate_(data);

    const sh = setupSheet();
    const rows = sh.getDataRange().getValues();
    const email = String(data.email).trim().toLowerCase();
    const phone = normalizePhone_(data.contactNumber);

    for (let i=1;i<rows.length;i++) {
      const rowEmail = String(rows[i][3] || "").trim().toLowerCase();
      const rowPhone = normalizePhone_(rows[i][2] || "");
      if (email && rowEmail === email || phone && rowPhone === phone) {
        return json_({ok:false,duplicate:true,message:"It looks like you have already submitted your RSVP."});
      }
    }

    sh.appendRow([
      new Date(), String(data.fullName).trim(), String(data.contactNumber).trim(),
      email, Number(data.numberOfGuests), String(data.attendance),
      String(data.godparentResponse), String(data.message || "").trim()
    ]);
    return json_({ok:true,message:"RSVP saved."});
  } catch(err) {
    return json_({ok:false,message:err.message || "Server error."});
  }
}

function validate_(d) {
  if (!d.fullName || String(d.fullName).trim().length < 2) throw new Error("Please enter your full name.");
  if (!/^[0-9+() .-]{7,20}$/.test(String(d.contactNumber || ""))) throw new Error("Please enter a valid contact number.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.email || ""))) throw new Error("Please enter a valid email address.");
  if (!Number.isInteger(Number(d.numberOfGuests)) || Number(d.numberOfGuests) < 1 || Number(d.numberOfGuests) > 50) throw new Error("Number of guests must be between 1 and 50.");
  if (!["Yes, I will attend","Sorry, I cannot attend"].includes(d.attendance)) throw new Error("Please select your attendance.");
  if (!["Yes, I would be honored!","I’m sorry, I cannot","I’d like to discuss it with the parents"].includes(d.godparentResponse)) throw new Error("Please select a godparent response.");
}

function normalizePhone_(v) { return String(v).replace(/[^\d]/g,"").replace(/^0/,"63"); }

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/*
 * Optional organizer API.
 * Use the dashboard in dashboard.html only if you understand that a shared
 * token in a public static page is not equivalent to Google-account auth.
 * For stronger privacy, host the dashboard inside Apps Script and restrict
 * access to your Google account/domain.
 */
function dashboard_(token) {
  const saved = PropertiesService.getScriptProperties().getProperty("DASHBOARD_TOKEN");
  if (!saved || token !== saved) throw new Error("Unauthorized.");
  const sh = setupSheet();
  const values = sh.getDataRange().getValues();
  return values;
}