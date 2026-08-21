/* =========================================================
   MARCUS CLOUD INVITATION
   app.js
========================================================= */

"use strict";


/* =========================================================
   OPENING SCREEN
========================================================= */

function closeOpening() {

  const opening = document.getElementById("opening");

  if (!opening) return;

  opening.classList.add("closed");

  setTimeout(() => {
    opening.remove();
  }, 500);
}


/* =========================================================
   COUNTDOWN
========================================================= */

function countdown() {

  const el = document.getElementById("countdown");

  if (!el) return;

  if (
    typeof APP_CONFIG === "undefined" ||
    !APP_CONFIG.eventDateISO
  ) {
    console.warn("eventDateISO is not configured.");
    return;
  }

  const target =
    new Date(APP_CONFIG.eventDateISO).getTime();

  if (Number.isNaN(target)) {
    console.error("Invalid eventDateISO.");
    return;
  }


  function updateCountdown() {

    const difference =
      Math.max(0, target - Date.now());

    const days =
      Math.floor(difference / 86400000);

    const hours =
      Math.floor(difference / 3600000) % 24;

    const minutes =
      Math.floor(difference / 60000) % 60;

    const seconds =
      Math.floor(difference / 1000) % 60;


    const values = [
      ["Days", days],
      ["Hours", hours],
      ["Minutes", minutes],
      ["Seconds", seconds]
    ];


    el.innerHTML = values
      .map(([label, value]) => {

        return `
          <div>
            <b>${String(value).padStart(2, "0")}</b>
            <span>${label}</span>
          </div>
        `;

      })
      .join("");
  }


  updateCountdown();

  setInterval(updateCountdown, 1000);
}


/* =========================================================
   RSVP URL
========================================================= */

function rsvpUrl() {

  return new URL(
    "rsvp.html",
    window.location.href
  ).href;
}


/* =========================================================
   QR CODE
========================================================= */

let qrCreated = false;


function makeQR() {

  const box =
    document.getElementById("qrcode");

  if (!box) return;


  /*
    Prevent QR generation more than once.
    This fixes duplicate QR codes.
  */

  if (qrCreated) return;

  qrCreated = true;


  const url = rsvpUrl();

  box.innerHTML = "";


  /* -----------------------------------------------------
     QRCode.js
  ----------------------------------------------------- */

  if (typeof QRCode !== "undefined") {

    try {

      new QRCode(box, {

        text: url,

        width: 240,
        height: 240,

        colorDark: "#10264a",
        colorLight: "#ffffff",

        correctLevel: QRCode.C
      });


      /*
        QRCode.js can sometimes create BOTH:
        <canvas>
        <img>

        Keep only one.
      */

      setTimeout(() => {

        const canvas =
          box.querySelector("canvas");

        const images =
          box.querySelectorAll("img");


        if (canvas) {

          /*
            Keep the canvas and remove generated images.
          */

          images.forEach((img) => {
            img.remove();
          });


          canvas.style.display = "block";
          canvas.style.width = "100%";
          canvas.style.height = "100%";
          canvas.style.maxWidth = "240px";
          canvas.style.maxHeight = "240px";


          setupQRDownload(() => {

            try {

              return canvas.toDataURL(
                "image/png"
              );

            } catch (error) {

              console.error(
                "Unable to export QR canvas:",
                error
              );

              return null;
            }

          });

        } else {

          /*
            If browser generated only an image,
            keep the first image.
          */

          const img =
            box.querySelector("img");


          if (img) {

            img.style.display = "block";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.maxWidth = "240px";
            img.style.maxHeight = "240px";


            setupQRDownload(
              () => img.src
            );

          }

        }

      }, 100);


      return;

    } catch (error) {

      console.warn(
        "QRCode.js failed. Using fallback.",
        error
      );
    }
  }


  /* -----------------------------------------------------
     FALLBACK QR
  ----------------------------------------------------- */

  createFallbackQR(box, url);
}


/* =========================================================
   QR FALLBACK
========================================================= */

function createFallbackQR(box, url) {

  box.innerHTML = "";


  const img =
    document.createElement("img");


  img.alt =
    "QR code to RSVP";

  img.width = 240;
  img.height = 240;


  img.src =
    "https://api.qrserver.com/v1/create-qr-code/" +
    "?size=500x500" +
    "&margin=12" +
    "&data=" +
    encodeURIComponent(url);


  img.style.display = "block";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.maxWidth = "240px";
  img.style.maxHeight = "240px";


  box.appendChild(img);


  setupQRDownload(
    () => img.src
  );
}


/* =========================================================
   DOWNLOAD QR
========================================================= */

function setupQRDownload(getSource) {

  const button =
    document.getElementById("downloadQR");

  if (!button) return;


  /*
    Replace onclick so the handler
    cannot accidentally be attached twice.
  */

  button.onclick = async function () {

    const source = getSource();

    if (!source) {

      alert(
        "The QR code is not ready yet."
      );

      return;
    }


    try {

      /*
        Data URL from canvas.
      */

      if (
        source.startsWith("data:image/")
      ) {

        const link =
          document.createElement("a");

        link.download =
          "marcus-cloud-rsvp-qr.png";

        link.href = source;

        document.body.appendChild(link);

        link.click();

        link.remove();

        return;
      }


      /*
        Remote image.
      */

      const response =
        await fetch(source);


      if (!response.ok) {

        throw new Error(
          "Unable to download QR."
        );
      }


      const blob =
        await response.blob();


      const objectUrl =
        URL.createObjectURL(blob);


      const link =
        document.createElement("a");


      link.download =
        "marcus-cloud-rsvp-qr.png";

      link.href =
        objectUrl;


      document.body.appendChild(link);

      link.click();

      link.remove();


      setTimeout(() => {

        URL.revokeObjectURL(
          objectUrl
        );

      }, 1000);


    } catch (error) {

      console.warn(
        "Direct QR download failed.",
        error
      );


      /*
        Browser fallback.
      */

      window.open(
        source,
        "_blank",
        "noopener"
      );
    }
  };
}


/* =========================================================
   ADD TO GOOGLE CALENDAR
========================================================= */

function addCalendar() {

  const start =
    "20260929T030000Z";

  const end =
    "20260929T050000Z";


  const title =
    "Marcus Cloud — Christening & 1st Birthday";


  const details =
    "Christening & Birthday Celebration";


  const location =
    "Our Lady of the Miraculous Medal Parish, " +
    "Calumpang, Molo, Iloilo City; " +
    "Reception: Jollibee Molo";


  const url =
    "https://calendar.google.com/calendar/render" +

    "?action=TEMPLATE" +

    "&text=" +
    encodeURIComponent(title) +

    "&dates=" +
    encodeURIComponent(
      start + "/" + end
    ) +

    "&details=" +
    encodeURIComponent(details) +

    "&location=" +
    encodeURIComponent(location);


  window.open(
    url,
    "_blank",
    "noopener"
  );
}


/* =========================================================
   CONTACT ORGANIZER
========================================================= */

function contactOrganizer() {

  const phone =
    typeof APP_CONFIG !== "undefined"
      ? APP_CONFIG.organizerPhone
      : "";


  if (!phone) {

    alert(
      "Organizer contact number is not configured."
    );

    return;
  }


  window.location.href =
    "tel:" + phone;
}


/* =========================================================
   ORGANIZER BUTTONS
========================================================= */

function setupOrganizerContact() {

  if (
    typeof APP_CONFIG === "undefined"
  ) {
    return;
  }


  const phone =
    APP_CONFIG.organizerPhone;


  if (!phone) return;


  const elements =
    document.querySelectorAll(
      "a, button"
    );


  elements.forEach((element) => {

    const text =
      element.textContent
        .trim()
        .toLowerCase();


    if (
      !text.includes(
        "contact organizer"
      )
    ) {
      return;
    }


    if (
      element.tagName.toLowerCase() ===
      "a"
    ) {

      element.href =
        "tel:" + phone;
    }
  });
}


/* =========================================================
   GIFT / REGISTRY MODAL
========================================================= */

function openGiftModal() {

  const modal =
    document.getElementById(
      "giftModal"
    );


  if (!modal) {

    console.error(
      "giftModal was not found."
    );

    return;
  }


  renderGiftList();

  setupOnlineRegistry();


  modal.classList.remove(
    "hidden"
  );


  document.body.classList.add(
    "modal-open"
  );
}


/* =========================================================
   CLOSE GIFT MODAL
========================================================= */

function closeGiftModal() {

  const modal =
    document.getElementById(
      "giftModal"
    );


  if (!modal) return;


  modal.classList.add(
    "hidden"
  );


  document.body.classList.remove(
    "modal-open"
  );
}


/* =========================================================
   RENDER GIFT LIST
========================================================= */

function renderGiftList() {

  const container =
    document.getElementById(
      "giftList"
    );


  if (!container) return;


  container.innerHTML = "";


  const gifts =
    typeof APP_CONFIG !== "undefined" &&
    Array.isArray(APP_CONFIG.giftList)

      ? APP_CONFIG.giftList

      : [];


  if (!gifts.length) {

    container.innerHTML = `
      <p class="gift-empty">
        Gift suggestions will be added soon.
      </p>
    `;

    return;
  }


  gifts.forEach((gift) => {

    const item =
      document.createElement("div");


    item.className =
      "gift-item";


    const icon =
      document.createElement("div");

    icon.className =
      "gift-item-icon";

    icon.textContent =
      gift.icon || "🎁";


    const info =
      document.createElement("div");

    info.className =
      "gift-item-info";


    const name =
      document.createElement("strong");

    name.textContent =
      gift.name || "Gift";


    const description =
      document.createElement("p");

    description.textContent =
      gift.description || "";


    info.appendChild(name);

    if (gift.description) {

      info.appendChild(
        description
      );
    }


    item.appendChild(icon);

    item.appendChild(info);


    container.appendChild(item);
  });
}


/* =========================================================
   ONLINE GIFT REGISTRY
========================================================= */

function setupOnlineRegistry() {

  const wrapper =
    document.getElementById(
      "onlineRegistry"
    );


  const button =
    document.getElementById(
      "giftRegistryButtonOnline"
    );


  if (
    !wrapper ||
    !button
  ) {
    return;
  }


  const url =
    typeof APP_CONFIG !== "undefined"
      ? String(
          APP_CONFIG.giftRegistryUrl || ""
        ).trim()
      : "";


  if (!url) {

    wrapper.classList.add(
      "hidden"
    );

    button.removeAttribute(
      "href"
    );

    return;
  }


  button.href = url;


  wrapper.classList.remove(
    "hidden"
  );
}


/* =========================================================
   PHOTO GALLERY
========================================================= */

function openPhotoGallery() {

  const galleryUrl =
    typeof APP_CONFIG !== "undefined"
      ? String(
          APP_CONFIG.photoGalleryUrl || ""
        ).trim()
      : "";


  if (!galleryUrl) {

    alert(
      "The photo gallery is not available yet."
    );

    return;
  }


  window.open(
    galleryUrl,
    "_blank",
    "noopener"
  );
}


/* =========================================================
   MODAL EVENTS
========================================================= */

function setupGiftModalEvents() {

  const modal =
    document.getElementById(
      "giftModal"
    );


  if (!modal) return;


  /*
    Close when clicking outside
    the modal card.
  */

  modal.addEventListener(
    "click",
    function (event) {

      if (
        event.target === modal
      ) {

        closeGiftModal();
      }
    }
  );


  /*
    ESC key closes modal.
  */

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape" &&
        !modal.classList.contains(
          "hidden"
        )
      ) {

        closeGiftModal();
      }
    }
  );
}


/* =========================================================
   INITIALIZE PAGE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    countdown();

    makeQR();

    setupOrganizerContact();

    setupGiftModalEvents();

  }
);
