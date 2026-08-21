/* =========================================================
   MARCUS CLOUD GAITERO
   MAIN INVITATION JAVASCRIPT
========================================================= */


/* =========================================================
   OPENING
========================================================= */

const opening = document.getElementById("opening");

function closeOpening() {
  if (!opening) return;

  opening.classList.add("closed");

  setTimeout(() => {
    if (opening) {
      opening.remove();
    }
  }, 500);
}


/* =========================================================
   COUNTDOWN
========================================================= */

function countdown() {

  const el =
    document.getElementById("countdown");

  if (!el) return;

  if (
    typeof APP_CONFIG === "undefined" ||
    !APP_CONFIG.eventDateISO
  ) {
    console.warn("Event date is not configured.");
    return;
  }

  const target =
    new Date(APP_CONFIG.eventDateISO).getTime();

  if (Number.isNaN(target)) {
    console.warn("Invalid event date.");
    return;
  }

  const tick = () => {

    const diff =
      Math.max(0, target - Date.now());

    const days =
      Math.floor(diff / 86400000);

    const hours =
      Math.floor(diff / 3600000) % 24;

    const minutes =
      Math.floor(diff / 60000) % 60;

    const seconds =
      Math.floor(diff / 1000) % 60;

    el.innerHTML = [
      ["Days", days],
      ["Hours", hours],
      ["Minutes", minutes],
      ["Seconds", seconds]
    ]
      .map(
        item => `
          <div>
            <b>${String(item[1]).padStart(2, "0")}</b>
            <span>${item[0]}</span>
          </div>
        `
      )
      .join("");
  };

  tick();

  setInterval(tick, 1000);
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

function makeQR() {

  const box =
    document.getElementById("qrcode");

  if (!box) return;

  const url =
    rsvpUrl();

  box.innerHTML = "";


  /* QRCode.js */

  if (typeof QRCode !== "undefined") {

    try {

      new QRCode(box, {

        text: url,

        width: 220,

        height: 220,

        colorDark: "#263746",

        colorLight: "#ffffff",

        correctLevel: QRCode.C

      });


      setupQRDownload(() => {

        const canvas =
          box.querySelector("canvas");

        return canvas
          ? canvas.toDataURL("image/png")
          : null;

      });

      return;

    } catch (error) {

      console.warn(
        "QRCode.js failed. Using fallback.",
        error
      );
    }
  }


  /* QR fallback */

  const img =
    document.createElement("img");

  img.alt =
    "QR code to RSVP";

  img.width = 220;

  img.height = 220;

  img.loading = "eager";

  img.src =
    "https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=12&data=" +
    encodeURIComponent(url);

  box.appendChild(img);

  setupQRDownload(() => img.src);
}


/* =========================================================
   QR DOWNLOAD
========================================================= */

function setupQRDownload(getSource) {

  const dl =
    document.getElementById("downloadQR");

  if (!dl) return;


  dl.onclick = async () => {

    const source =
      getSource();

    if (!source) return;


    try {

      const response =
        await fetch(source);

      const blob =
        await response.blob();

      const objectUrl =
        URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.download =
        "marcus-cloud-rsvp-qr.png";

      a.href =
        objectUrl;

      document.body.appendChild(a);

      a.click();

      a.remove();

      setTimeout(() => {

        URL.revokeObjectURL(objectUrl);

      }, 1000);

    } catch (error) {

      console.warn(
        "QR download failed.",
        error
      );

      window.open(
        source,
        "_blank",
        "noopener"
      );
    }
  };
}


/* =========================================================
   GOOGLE CALENDAR
========================================================= */

function addCalendar() {

  const start =
    "20260929T030000Z";

  const end =
    "20260929T050000Z";

  const url =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +

    `&text=${encodeURIComponent(
      "Marcus Cloud — Christening & 1st Birthday"
    )}` +

    `&dates=${start}/${end}` +

    `&details=${encodeURIComponent(
      "Christening & Birthday Celebration of Marcus Cloud Gaitero"
    )}` +

    `&location=${encodeURIComponent(
      "Our Lady of the Miraculous Medal Parish, Calumpang, Molo, Iloilo City; Reception: Jollibee Molo"
    )}`;

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
    APP_CONFIG?.organizerPhone || "";

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
   SETUP CONTACT ORGANIZER BUTTONS
========================================================= */

function setupOrganizerContact() {

  const phone =
    APP_CONFIG?.organizerPhone || "";

  if (!phone) return;

  const buttons =
    document.querySelectorAll("a, button");

  buttons.forEach(button => {

    const text =
      button.textContent
        .trim()
        .toLowerCase();

    if (
      text.includes("contact organizer")
    ) {

      if (
        button.tagName.toLowerCase() === "a"
      ) {

        button.href =
          "tel:" + phone;

        button.removeAttribute(
          "onclick"
        );

      } else {

        button.onclick =
          function(event) {

            event.preventDefault();

            contactOrganizer();

          };
      }
    }
  });
}


/* =========================================================
   GIFT / REGISTRY MODAL
========================================================= */

function openGiftModal() {

  const modal =
    document.getElementById("giftModal");

  if (!modal) {

    console.error(
      "Gift modal #giftModal was not found."
    );

    return;
  }

  loadGiftList();

  modal.classList.remove("hidden");

  document.body.classList.add(
    "modal-open"
  );
}


/* =========================================================
   CLOSE GIFT MODAL
========================================================= */

function closeGiftModal() {

  const modal =
    document.getElementById("giftModal");

  if (!modal) return;

  modal.classList.add("hidden");

  document.body.classList.remove(
    "modal-open"
  );
}


/* =========================================================
   GIFT LIST
========================================================= */

function loadGiftList() {

  const giftList =
    document.getElementById("giftList");

  const onlineRegistry =
    document.getElementById(
      "onlineRegistry"
    );

  const registryButton =
    document.getElementById(
      "giftRegistryButtonOnline"
    );

  if (!giftList) return;


  /*
     Use the gift list from config.js.

     If giftList is missing from config.js,
     these default items will be used.
  */

  const defaultGifts = [

    {
      icon: "💌",
      name: "Cash Gift",
      description:
        "For Marcus's future needs and little dreams."
    },

    {
      icon: "👕",
      name: "Baby Clothes",
      description:
        "Comfortable clothes for Marcus."
    },

    {
      icon: "🧸",
      name: "Toys & Books",
      description:
        "Age-appropriate toys, books, and learning materials."
    },

    {
      icon: "🍼",
      name: "Baby Essentials",
      description:
        "Useful everyday baby essentials."
    },

    {
      icon: "🧴",
      name: "Baby Care",
      description:
        "Baby care and hygiene products."
    }

  ];


  const gifts =
    Array.isArray(APP_CONFIG?.giftList) &&
    APP_CONFIG.giftList.length > 0

      ? APP_CONFIG.giftList

      : defaultGifts;


  /* Display Gift List */

  giftList.innerHTML =
    gifts
      .map(gift => {

        return `
          <div class="gift-item">

            <div class="gift-item-icon">
              ${gift.icon || "🎁"}
            </div>

            <div class="gift-item-info">

              <strong>
                ${gift.name || "Gift"}
              </strong>

              <span>
                ${gift.description || ""}
              </span>

            </div>

          </div>
        `;

      })
      .join("");


  /* Online Gift Registry */

  const registryUrl =
    APP_CONFIG?.giftRegistryUrl || "";


  if (
    registryUrl.trim() !== "" &&
    onlineRegistry &&
    registryButton
  ) {

    registryButton.href =
      registryUrl;

    onlineRegistry.classList.remove(
      "hidden"
    );

  } else {

    if (onlineRegistry) {

      onlineRegistry.classList.add(
        "hidden"
      );
    }
  }
}


/* =========================================================
   GIFT MODAL - OUTSIDE CLICK
========================================================= */

function setupGiftModalOutsideClick() {

  const modal =
    document.getElementById("giftModal");

  if (!modal) return;

  modal.addEventListener(
    "click",
    function(event) {

      if (
        event.target === modal
      ) {

        closeGiftModal();
      }
    }
  );
}


/* =========================================================
   GIFT MODAL - ESC KEY
========================================================= */

function setupGiftModalEscape() {

  document.addEventListener(
    "keydown",
    function(event) {

      if (
        event.key === "Escape"
      ) {

        closeGiftModal();
      }
    }
  );
}


/* =========================================================
   MESSENGER
========================================================= */

function openMessenger() {

  const messengerUrl =
    "https://www.facebook.com/messages/t/markangelou.gaitero";

  window.open(
    messengerUrl,
    "_blank",
    "noopener"
  );
}


/* =========================================================
   PHOTO GALLERY - GOOGLE DRIVE
========================================================= */

function openPhotoGallery() {

  const galleryUrl =
    APP_CONFIG?.photoGalleryUrl || "";

  if (!galleryUrl.trim()) {

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
   INITIALIZE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    countdown();

    makeQR();

    setupOrganizerContact();

    setupGiftModalOutsideClick();

    setupGiftModalEscape();

  }
);
