"use strict";


/* =========================================================
   OPEN INVITATION
========================================================= */

function closeOpening() {

  const opening =
    document.getElementById(
      "opening"
    );

  if (!opening) {
    return;
  }

  opening.classList.add(
    "closed"
  );
}


/* =========================================================
   COUNTDOWN
========================================================= */

function countdown() {

  const container =
    document.getElementById(
      "countdown"
    );

  if (!container) {
    return;
  }


  const targetDate =
    APP_CONFIG &&
    APP_CONFIG.eventDateISO
      ? new Date(
          APP_CONFIG.eventDateISO
        )
      : new Date(
          "2026-09-29T11:00:00+08:00"
        );


  function update() {

    const now =
      new Date();

    const difference =
      targetDate.getTime() -
      now.getTime();


    if (difference <= 0) {

      container.innerHTML =
        `
        <div>
          <b>0</b>
          <span>Days</span>
        </div>

        <div>
          <b>0</b>
          <span>Hours</span>
        </div>

        <div>
          <b>0</b>
          <span>Minutes</span>
        </div>

        <div>
          <b>0</b>
          <span>Seconds</span>
        </div>
        `;

      return;
    }


    const days =
      Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
      );

    const hours =
      Math.floor(
        (
          difference /
          (1000 * 60 * 60)
        ) % 24
      );

    const minutes =
      Math.floor(
        (
          difference /
          (1000 * 60)
        ) % 60
      );

    const seconds =
      Math.floor(
        (
          difference /
          1000
        ) % 60
      );


    container.innerHTML =
      `
      <div>
        <b>${days}</b>
        <span>Days</span>
      </div>

      <div>
        <b>${hours}</b>
        <span>Hours</span>
      </div>

      <div>
        <b>${minutes}</b>
        <span>Minutes</span>
      </div>

      <div>
        <b>${seconds}</b>
        <span>Seconds</span>
      </div>
      `;
  }


  update();

  setInterval(
    update,
    1000
  );
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

  if (qrCreated) {
    return;
  }


  const container =
    document.getElementById(
      "qrcode"
    );

  if (!container) {
    return;
  }


  container.innerHTML = "";


  if (
    typeof QRCode ===
    "undefined"
  ) {

    setTimeout(
      function () {

        if (
          typeof QRCode !==
          "undefined"
        ) {

          makeQR();

        } else {

          createFallbackQR();
        }

      },
      900
    );

    return;
  }


  try {

    new QRCode(
      container,
      {
        text:
          rsvpUrl(),

        width:
          300,

        height:
          300,

        correctLevel:
          QRCode.CorrectLevel.H
      }
    );


    qrCreated =
      true;


    setTimeout(
      function () {

        const canvas =
          container.querySelector(
            "canvas"
          );

        const images =
          container.querySelectorAll(
            "img"
          );


        if (
          canvas &&
          images.length
        ) {

          images.forEach(
            function (image) {

              if (
                !image.classList.contains(
                  "qr-fallback-image"
                )
              ) {

                image.remove();
              }
            }
          );
        }

      },
      200
    );


    setupQRDownload();


  } catch (error) {

    console.error(
      "QR code error:",
      error
    );

    createFallbackQR();
  }
}


/* =========================================================
   QR FALLBACK
========================================================= */

function createFallbackQR() {

  const container =
    document.getElementById(
      "qrcode"
    );

  if (!container) {
    return;
  }


  container.innerHTML = "";


  const image =
    document.createElement(
      "img"
    );


  image.className =
    "qr-fallback-image";


  image.alt =
    "QR code to RSVP";


  image.src =
    "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
    encodeURIComponent(
      rsvpUrl()
    );


  container.appendChild(
    image
  );


  qrCreated =
    true;


  setupQRDownload();
}


/* =========================================================
   QR DOWNLOAD
========================================================= */

function setupQRDownload() {

  const button =
    document.getElementById(
      "downloadQR"
    );

  if (!button) {
    return;
  }


  button.onclick =
    function () {

      const container =
        document.getElementById(
          "qrcode"
        );

      if (!container) {
        return;
      }


      const canvas =
        container.querySelector(
          "canvas"
        );


      if (canvas) {

        const link =
          document.createElement(
            "a"
          );

        link.download =
          "Marcus-Cloud-RSVP-QR.png";

        link.href =
          canvas.toDataURL(
            "image/png"
          );

        link.click();

        return;
      }


      const image =
        container.querySelector(
          "img"
        );


      if (image) {

        window.open(
          image.src,
          "_blank"
        );
      }
    };
}


/* =========================================================
   LOAD PUBLIC EVENT SETTINGS
========================================================= */

async function loadEventSettings() {

  try {

    const url =
      APP_CONFIG
        .APPS_SCRIPT_WEB_APP_URL ||
      APP_CONFIG
        .webAppUrl;


    if (!url) {

      console.warn(
        "Apps Script URL not configured."
      );

      return;
    }


    const response =
      await fetch(
        url,
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body:
            JSON.stringify({
              action:
                "publicSettings"
            })
        }
      );


    const result =
      await response.json();


    if (
      !result ||
      !result.ok
    ) {

      console.warn(
        "Unable to load event settings.",
        result
      );

      return;
    }


    applyPublicSettings(
      result.settings || {}
    );


  } catch (error) {

    console.error(
      "Event settings error:",
      error
    );
  }
}


/* =========================================================
   APPLY PUBLIC SETTINGS
========================================================= */

function applyPublicSettings(
  settings
) {

  setText(
    "eventDateText",
    settings[
      "Event Date"
    ]
  );

  setText(
    "eventDateTextDetail",
    settings[
      "Event Date"
    ]
  );

  setText(
    "eventTimeText",
    settings[
      "Event Time"
    ]
  );

  setText(
    "eventTimeTextDetail",
    settings[
      "Event Time"
    ]
  );

  setText(
    "churchName",
    settings[
      "Church"
    ]
  );

  setText(
    "churchAddress",
    settings[
      "Church Address"
    ]
  );

  setText(
    "birthdayTheme",
    settings[
      "Birthday Theme"
    ]
  );

  setText(
    "birthdayTime",
    settings[
      "Reception Time"
    ]
  );

  setText(
    "receptionVenue",
    settings[
      "Reception Venue"
    ]
  );

  setText(
    "receptionAddress",
    settings[
      "Reception Address"
    ]
  );

  setText(
    "dressCode",
    settings[
      "Dress Code"
    ]
  );


  updateChurchMapLink(
    settings[
      "Church"
    ],
    settings[
      "Church Address"
    ]
  );


  updateReceptionMapLink(
    settings[
      "Reception Venue"
    ],
    settings[
      "Reception Address"
    ]
  );
}


/* =========================================================
   SET TEXT
========================================================= */

function setText(
  id,
  value
) {

  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  ) {
    return;
  }


  const element =
    document.getElementById(id);


  if (element) {

    element.textContent =
      String(value);
  }
}


/* =========================================================
   CHURCH MAP
========================================================= */

function updateChurchMapLink(
  church,
  address
) {

  const link =
    document.getElementById(
      "churchMapLink"
    );

  if (!link) {
    return;
  }


  const query =
    [
      church,
      address
    ]
      .filter(Boolean)
      .join(" ");


  if (!query) {
    return;
  }


  link.href =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(query);
}


/* =========================================================
   RECEPTION MAP
========================================================= */

function updateReceptionMapLink(
  venue,
  address
) {

  const link =
    document.getElementById(
      "receptionMapLink"
    );

  if (!link) {
    return;
  }


  const query =
    [
      venue,
      address
    ]
      .filter(Boolean)
      .join(" ");


  if (!query) {
    return;
  }


  link.href =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(query);
}


/* =========================================================
   ADD TO CALENDAR
========================================================= */

function addCalendar() {

  const title =
    "Marcus Cloud Gaitero - Christening & 1st Birthday";


  const details =
    "Christening and 1st Birthday celebration of Marcus Cloud Gaitero.";


  const location =
    "Our Lady of the Miraculous Medal Parish, Calumpang, Molo, Iloilo City";


  const start =
    "20260929T030000Z";

  const end =
    "20260929T080000Z";


  const url =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" +
    encodeURIComponent(title) +
    "&dates=" +
    start +
    "/" +
    end +
    "&details=" +
    encodeURIComponent(details) +
    "&location=" +
    encodeURIComponent(location);


  window.open(
    url,
    "_blank"
  );
}


/* =========================================================
   ORGANIZER CONTACT
========================================================= */

function contactOrganizer() {

  const phone =
    APP_CONFIG
      .organizerPhone ||
    "";


  if (!phone) {
    return;
  }


  window.location.href =
    "tel:" +
    phone;
}


function setupOrganizerContact() {

  const phone =
    APP_CONFIG
      .organizerPhone ||
    "";


  if (!phone) {
    return;
  }


  document
    .querySelectorAll(
      "[data-contact-organizer]"
    )
    .forEach(
      function (link) {

        link.href =
          "tel:" +
          phone;
      }
    );
}


/* =========================================================
   GIFTS
========================================================= */

const DEFAULT_GIFTS = [

  {
    icon: "👕",
    title: "Clothes",
    description:
      "Comfy outfits and cute little essentials"
  },

  {
    icon: "🧸",
    title: "Toys",
    description:
      "Educational and age-appropriate toys"
  },

  {
    icon: "📚",
    title: "Books",
    description:
      "Storybooks and learning books"
  },

  {
    icon: "🍼",
    title: "Baby Essentials",
    description:
      "Useful everyday items for Marcus"
  },

  {
    icon: "💌",
    title: "Monetary Gift",
    description:
      "A little blessing for Marcus' future"
  }

];


function renderGiftList() {

  const container =
    document.getElementById(
      "giftList"
    );

  if (!container) {
    return;
  }


  container.innerHTML =
    DEFAULT_GIFTS
      .map(
        function (gift) {

          return `
            <div class="gift-item">

              <div class="gift-item-icon">
                ${gift.icon}
              </div>

              <div class="gift-item-info">

                <strong>
                  ${gift.title}
                </strong>

                <span>
                  ${gift.description}
                </span>

              </div>

            </div>
          `;
        }
      )
      .join("");
}


/* =========================================================
   GIFT MODAL
========================================================= */

function openGiftModal() {

  const modal =
    document.getElementById(
      "giftModal"
    );

  if (!modal) {
    return;
  }


  renderGiftList();

  setupGiftRegistry();


  modal.classList.remove(
    "hidden"
  );

  document.body.classList.add(
    "modal-open"
  );
}


function closeGiftModal() {

  const modal =
    document.getElementById(
      "giftModal"
    );

  if (!modal) {
    return;
  }


  modal.classList.add(
    "hidden"
  );

  document.body.classList.remove(
    "modal-open"
  );
}


/* =========================================================
   ONLINE REGISTRY
========================================================= */

function setupGiftRegistry() {

  const wrapper =
    document.getElementById(
      "onlineRegistry"
    );

  const link =
    document.getElementById(
      "giftRegistryButtonOnline"
    );


  if (
    !wrapper ||
    !link
  ) {
    return;
  }


  const url =
    APP_CONFIG
      .giftRegistryUrl ||
    "";


  if (!url) {

    wrapper.classList.add(
      "hidden"
    );

    return;
  }


  link.href =
    url;


  wrapper.classList.remove(
    "hidden"
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

  if (!modal) {
    return;
  }


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


  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key ===
        "Escape"
      ) {

        closeGiftModal();
      }
    }
  );
}


/* =========================================================
   PHOTO GALLERY
========================================================= */

function openPhotoGallery() {

  const url =
    APP_CONFIG
      .photoGalleryUrl ||
    "";


  if (!url) {

    alert(
      "Photo gallery is not available yet."
    );

    return;
  }


  window.open(
    url,
    "_blank",
    "noopener"
  );
}


/* =========================================================
   PAGE START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    countdown();

    makeQR();

    setupOrganizerContact();

    setupGiftModalEvents();

    setupGiftRegistry();

    loadEventSettings();
  }
);
