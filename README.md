# Marcus Cloud Gaitero — Christening & 1st Birthday RSVP

This project contains a mobile-friendly invitation, QR RSVP form, Google Apps Script backend, and organizer dashboard shell.

## 1. Create the Google Sheet

Create a new Google Sheet. Rename the first sheet to `RSVP` (the script can also create it automatically).

The first row must be:

`Timestamp | Full Name | Contact Number | Email Address | Number of Guests | Attendance | Godparent Response | Message`

## 2. Create the Google Apps Script backend

Open the Google Sheet → **Extensions → Apps Script**.

Delete the starter code and paste the entire contents of `Code.gs`.

Then open **Project Settings → Script Properties** and add:

- Property: `SHEET_ID`
- Value: the Google Sheet ID

The Sheet ID is the long string between `/d/` and `/edit` in the spreadsheet URL.

Optional:

- `DASHBOARD_TOKEN` = a long random secret if you later build an authenticated organizer API.

## 3. Deploy the backend

In Apps Script:

1. Click **Deploy → New deployment**.
2. Select **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone**.
5. Deploy.
6. Authorize the requested permissions.
7. Copy the Web app URL ending in `/exec`.

Do not put the Sheet ID or Google credentials in the website.

## 4. Connect the website

Open `config.js` and replace:

`PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE`

with the Web app `/exec` URL.

Example shape:

`https://script.google.com/macros/s/XXXXXXXXXXXX/exec`

## 5. Publish the invitation

The simplest free option is GitHub Pages:

1. Create a GitHub repository.
2. Upload all project files.
3. Enable **Settings → Pages**.
4. Publish from the main branch.
5. Open the published `index.html`.

You can also use another static host.

## 6. QR code

The QR code is generated from the RSVP page URL, not from the Google Sheet. Therefore changing the visual design does not change the destination as long as the RSVP page remains at the same URL.

On the invitation page, click **Download QR as PNG**.

Test the PNG with at least two phones before printing.

## 7. Test the complete flow

Submit a test RSVP.

Check the Google Sheet for a new row.

Then test:
- invalid email
- invalid phone
- duplicate email
- duplicate phone
- attendance = cannot attend
- all three godparent choices
- mobile layout
- QR scan from printed/digital image

## Security / privacy notes

Guest contact information is stored server-side in Google Sheets, not browser local storage.

The public invitation only contains the Apps Script web-app URL. The Sheet ID and Google credentials stay in Apps Script.

The static dashboard is deliberately only a shell. A truly private dashboard should be hosted behind Google authentication (for example, an Apps Script HTML service restricted to the organizer's Google account or Workspace domain). Do not put a Sheet API key, service-account private key, or spreadsheet ID in frontend JavaScript.

## Customization

Edit the event details in:
- `index.html`
- `rsvp.html`
- `config.js`

The backend column structure is controlled by `HEADERS` in `Code.gs`.

Replace the organizer phone and any optional gift/registry URL in `config.js`.
