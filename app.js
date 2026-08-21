/* =========================================================
   MARCUS CLOUD GAITERO
   CHRISTENING & 1ST BIRTHDAY
   MAIN APP.JS
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

  const target =
    new Date(APP_CONFIG.eventDateISO).getTime();

  const el =
    document.getElementById("countdown");

  if (!el) return;

  const tick = () => {

    const diff =
      Math.max(0, target - Date.now());

    const d =
      Math.floor(diff / 86400000);

    const h =
      Math.floor(diff / 3600000) % 24;

    const m =
      Math.floor(diff / 60000) % 60;

    const s =
      Math.floor(diff / 1000) % 60;


    el.innerHTML = [

      ["Days", d],

      ["Hours", h],

      ["Minutes", m],

      ["Seconds", s]

    ]

      .map(
        x =>
          `<div>
            <b>${String(x[1]).padStart(2, "0")}</b>
            <span>${x[0]}</span>
          </div>`
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


  /* -------------------------------------------------------
     PRIMARY METHOD — QRCode.js
  ------------------------------------------------------- */

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

    }

    catch (error) {

      console.warn(
        "QRCode.js failed. Using image fallback.",
        error
      );

    }
  }


  /* -------------------------------------------------------
     FALLBACK QR IMAGE
  ------------------------------------------------------- */

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
   DOWNLOAD QR
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


      setTimeout(
        () =>
          URL.revokeObjectURL(objectUrl),
        1000
      );

    }

    catch (error) {

      console.warn(
        "QR download failed. Opening image instead.",
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

function setupOrganizerContact() {

  const phone =
    APP_CONFIG?.organizerPhone || "";


  if (!phone) return;


  const buttons =
    document.querySelectorAll("a, button");


  buttons.forEach((button) => {

    const text =
      button.textContent
        .trim()
        .toLowerCase();


    if (
      text.includes("contact organizer")
    ) {

      /*
        If it is an <a>, set the telephone link.
      */

      if (
        button.tagName.toLowerCase() === "a"
      ) {

        button.href =
          "tel:" + phone;

        button.removeAttribute("onclick");

      }

      /*
        If it is a <button>, use tel:
      */

      else {

        button.onclick = function () {

          window.location.href =
            "tel:" + phone;

        };
      }
    }

  });
}


/* =========================================================
   GIFT / REGISTRY POPUP
========================================================= */

function openGiftModal() {

  const modal =
    document.getElementById("giftModal");

  if (!modal) return;


  modal.classList.remove("hidden");


  document.body.classList.add(
    "modal-open"
  );


  loadGiftList();
}


/* =========================================================
   CLOSE GIFT POPUP
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
   ----------------------------------------------------------
   EDIT YOUR GIFT LIST HERE
   ----------------------------------------------------------
  */

  const gifts = [

    {
      icon: "👕",
      name: "Baby Clothes",
      description:
        "Clothes for Marcus, size 12–18 months"
    },


    {
      icon: "🧸",
      name: "Toys",
      description:
        "Age-appropriate toys and learning toys"
    },


    {
      icon: "📚",
      name: "Baby Books",
      description:
        "Story books and educational books"
    },


    {
      icon: "🍼",
      name: "Baby Essentials",
      description:
        "Useful everyday items for Marcus"
    },


    {
      icon: "💰",
      name: "Cash Gift",
      description:
        "A cash gift is also sincerely appreciated"
    }

  ];


  /* -------------------------------------------------------
     CREATE GIFT LIST
  ------------------------------------------------------- */

  giftList.innerHTML =
    gifts
      .map(
        gift => `

          <div class="gift-item">

            <div class="gift-item-icon">
              ${gift.icon}
            </div>

            <div class="gift-item-info">

              <strong>
                ${gift.name}
              </strong>

              <span>
                ${gift.description}
              </span>

            </div>

          </div>

        `
      )
      .join("");


  /* -------------------------------------------------------
     ONLINE GIFT REGISTRY
  ------------------------------------------------------- */

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

  }

  else {

    if (onlineRegistry) {

      onlineRegistry.classList.add(
        "hidden"
      );
    }
  }
}


/* =========================================================
   CONTACT ORGANIZER FROM GIFT POPUP
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
   CLOSE GIFT POPUP
   WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
  "click",
  function (event) {

    const modal =
      document.getElementById("giftModal");


    if (!modal) return;


    if (
      event.target === modal
    ) {

      closeGiftModal();

    }

  }
);


/* =========================================================
   ESC KEY CLOSES GIFT POPUP
========================================================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Escape"
    ) {

      const modal =
        document.getElementById("giftModal");


      if (
        modal &&
        !modal.classList.contains("hidden")
      ) {

        closeGiftModal();

      }

    }

  }
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    countdown();

    makeQR();

    setupOrganizerContact();

    /*
      IMPORTANT:

      Do NOT call closeOpening() here.

      The "Open Invitation" button in index.html
      already calls closeOpening().
    */

  }
);
