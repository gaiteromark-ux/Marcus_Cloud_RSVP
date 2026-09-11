"use strict";

/* =========================================================
   MARCUS CLOUD GAITERO
   CHRISTENING & 1ST BIRTHDAY
   MAIN WEBSITE JAVASCRIPT
========================================================= */


/* =========================================================
   1. OPENING SCREEN
========================================================= */

function closeOpening() {

  const opening =
    document.getElementById("opening");

  if (!opening) {
    return;
  }

  opening.classList.add("closed");

  setTimeout(function () {

    opening.remove();

  }, 500);

}


/* =========================================================
   2. COUNTDOWN
========================================================= */

function countdown() {

  const container =
    document.getElementById("countdown");

  if (!container) {
    return;
  }


  if (
    typeof APP_CONFIG === "undefined" ||
    !APP_CONFIG.eventDateISO
  ) {

    console.warn(
      "Event date is not configured."
    );

    return;
  }


  const target =
    new Date(
      APP_CONFIG.eventDateISO
    ).getTime();


  if (Number.isNaN(target)) {

    console.warn(
      "Invalid event date."
    );

    return;
  }


  function updateCountdown() {

    const now =
      new Date().getTime();


    let distance =
      target - now;


    if (distance < 0) {
      distance = 0;
    }


    const days =
      Math.floor(
        distance /
        (1000 * 60 * 60 * 24)
      );


    const hours =
      Math.floor(
        (
          distance %
          (1000 * 60 * 60 * 24)
        ) /
        (1000 * 60 * 60)
      );


    const minutes =
      Math.floor(
        (
          distance %
          (1000 * 60 * 60)
        ) /
        (1000 * 60)
      );


    const seconds =
      Math.floor(
        (
          distance %
          (1000 * 60)
        ) /
        1000
      );


    const values = [

      {
        label: "Days",
        value: days
      },

      {
        label: "Hours",
        value: hours
      },

      {
        label: "Minutes",
        value: minutes
      },

      {
        label: "Seconds",
        value: seconds
      }

    ];


    container.innerHTML =
      values
        .map(function (item) {

          return `
            <div>

              <b>
                ${String(item.value).padStart(2, "0")}
              </b>

              <span>
                ${item.label}
              </span>

            </div>
          `;

        })
        .join("");

  }


  updateCountdown();


  setInterval(
    updateCountdown,
    1000
  );

}


/* =========================================================
   3. RSVP PAGE URL
========================================================= */

function rsvpUrl() {

  return new URL(
    "rsvp.html",
    window.location.href
  ).href;

}


/* =========================================================
   4. CREATE QR CODE
========================================================= */

let qrCreated = false;


function makeQR() {

  const qrContainer =
    document.getElementById("qrcode");


  if (!qrContainer) {
    return;
  }


  /*
    Prevent duplicate QR codes.
  */

  if (qrCreated) {
    return;
  }


  qrCreated = true;


  qrContainer.innerHTML = "";


  const url =
    rsvpUrl();


  /*
    Try QRCode.js first.
  */

  if (
    typeof QRCode !== "undefined"
  ) {

    try {

      new QRCode(
        qrContainer,
        {

          text: url,

          width: 240,

          height: 240,

          colorDark:
            "#1d2f46",

          colorLight:
            "#ffffff",

          correctLevel:
            QRCode.CorrectLevel.H

        }
      );


      /*
        QRCode.js sometimes creates BOTH:

        canvas
        img

        We only keep one so the QR
        does not appear twice.
      */

      setTimeout(
        function () {

          const canvas =
            qrContainer.querySelector(
              "canvas"
            );


          const generatedImages =
            qrContainer.querySelectorAll(
              "img:not(.qr-fallback-image)"
            );


          if (canvas) {

            generatedImages.forEach(
              function (image) {

                image.remove();

              }
            );


            canvas.style.display =
              "block";


            setupQRDownload(
              function () {

                try {

                  return canvas.toDataURL(
                    "image/png"
                  );

                } catch (error) {

                  return null;

                }

              }
            );


          } else {

            const image =
              qrContainer.querySelector(
                "img"
              );


            setupQRDownload(
              function () {

                if (image) {

                  return image.src;

                }

                return null;

              }
            );

          }

        },
        150
      );


      return;


    } catch (error) {

      console.warn(
        "QRCode.js failed.",
        error
      );

    }

  }


  /*
    If QRCode.js did not load,
    use an online QR fallback.
  */

  createFallbackQR(
    qrContainer,
    url
  );

}


/* =========================================================
   5. QR FALLBACK
========================================================= */

function createFallbackQR(
  qrContainer,
  url
) {

  qrContainer.innerHTML =
    "";


  const image =
    document.createElement(
      "img"
    );


  image.className =
    "qr-fallback-image";


  image.alt =
    "QR code to RSVP";


  image.width =
    240;


  image.height =
    240;


  image.src =
    "https://api.qrserver.com/v1/create-qr-code/" +
    "?size=500x500" +
    "&margin=12" +
    "&data=" +
    encodeURIComponent(url);


  qrContainer.appendChild(
    image
  );


  setupQRDownload(
    function () {

      return image.src;

    }
  );

}


/* =========================================================
   6. DOWNLOAD QR CODE
========================================================= */

function setupQRDownload(
  getSource
) {

  const button =
    document.getElementById(
      "downloadQR"
    );


  if (!button) {
    return;
  }


  button.onclick =
    async function () {


      const source =
        getSource();


      if (!source) {

        alert(
          "The QR code is not ready yet."
        );

        return;

      }


      /*
        QR created from canvas.
      */

      if (
        source.startsWith(
          "data:image/"
        )
      ) {

        const link =
          document.createElement(
            "a"
          );


        link.href =
          source;


        link.download =
          "marcus-cloud-rsvp-qr.png";


        document.body.appendChild(
          link
        );


        link.click();


        link.remove();


        return;

      }


      /*
        QR created from external image.
      */

      try {

        const response =
          await fetch(source);


        if (!response.ok) {

          throw new Error(
            "QR download failed."
          );

        }


        const blob =
          await response.blob();


        const objectUrl =
          URL.createObjectURL(
            blob
          );


        const link =
          document.createElement(
            "a"
          );


        link.href =
          objectUrl;


        link.download =
          "marcus-cloud-rsvp-qr.png";


        document.body.appendChild(
          link
        );


        link.click();


        link.remove();


        setTimeout(
          function () {

            URL.revokeObjectURL(
              objectUrl
            );

          },
          1000
        );


      } catch (error) {

        /*
          If browser blocks direct
          download, open the QR instead.
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
   7. LOAD CURRENT EVENT SETTINGS
   FROM GOOGLE APPS SCRIPT

   THIS IS WHAT MAKES THE UPDATED VENUE
   APPEAR ON THE PUBLIC INVITATION.
========================================================= */

async function loadEventSettings() {

  /*
    Accept either configuration name
    so it also works with older config.js.
  */

  let webAppUrl =
    "";


  if (
    typeof APP_CONFIG !==
    "undefined"
  ) {

    webAppUrl =
      APP_CONFIG
        .APPS_SCRIPT_WEB_APP_URL ||

      APP_CONFIG
        .webAppUrl ||

      "";

  }


  if (!webAppUrl) {

    console.warn(
      "Google Apps Script Web App URL is missing from config.js."
    );

    return;

  }


  try {

    const response =
      await fetch(
        webAppUrl,
        {

          method: "POST",

          redirect: "follow",

          headers: {

            "Content-Type":
              "text/plain;charset=utf-8"

          },

          body:
            JSON.stringify(
              {

                action:
                  "publicSettings"

              }
            )

        }
      );


    if (!response.ok) {

      throw new Error(
        "Server returned HTTP " +
        response.status
      );

    }


    const text =
      await response.text();


    let result;


    try {

      result =
        JSON.parse(text);

    } catch (error) {

      throw new Error(
        "Apps Script did not return valid JSON."
      );

    }


    if (!result.ok) {

      throw new Error(
        result.message ||
        "Unable to load event settings."
      );

    }


    applyPublicSettings(
      result.settings || {}
    );


    console.log(
      "Latest event settings loaded."
    );


  } catch (error) {

    console.error(
      "Failed to load current event settings:",
      error
    );


    /*
      IMPORTANT:

      If Apps Script cannot be reached,
      the fallback details already written
      in index.html remain visible.
    */

  }

}


/* =========================================================
   8. APPLY EVENT SETTINGS TO INVITATION
========================================================= */

function applyPublicSettings(
  settings
) {


  /* EVENT DATE */

  setText(
    "eventDateText",
    settings["Event Date"]
  );


  setText(
    "eventDateTextDetail",
    settings["Event Date"]
  );


  /* EVENT TIME */

  setText(
    "eventTimeText",
    settings["Event Time"]
  );


  setText(
    "eventTimeTextDetail",
    settings["Event Time"]
  );


  /* CHURCH */

  setText(
    "churchName",
    settings["Church"]
  );


  setText(
    "churchAddress",
    settings["Church Address"]
  );


  /* BIRTHDAY */

  setText(
    "birthdayTheme",
    settings["Birthday Theme"]
  );


  /* RECEPTION */

  setText(
    "receptionVenue",
    settings["Reception Venue"]
  );


  setText(
    "receptionAddress",
    settings["Reception Address"]
  );


  /* DRESS CODE */

  setText(
    "dressCode",
    settings["Dress Code"]
  );


  /*
    Automatically update the
    Reception Google Maps link.
  */

  updateReceptionMapLink(
    settings
  );


  /*
    Automatically update the
    Church Google Maps link.
  */

  updateChurchMapLink(
    settings
  );

}


/* =========================================================
   9. HELPER — CHANGE TEXT
========================================================= */

function setText(
  elementId,
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
    document.getElementById(
      elementId
    );


  if (!element) {

    return;

  }


  element.textContent =
    String(value).trim();

}


/* =========================================================
   10. RECEPTION GOOGLE MAPS LINK
========================================================= */

function updateReceptionMapLink(
  settings
) {

  const link =
    document.getElementById(
      "receptionMapLink"
    );


  if (!link) {
    return;
  }


  const venue =
    String(
      settings[
        "Reception Venue"
      ] || ""
    ).trim();


  const address =
    String(
      settings[
        "Reception Address"
      ] || ""
    ).trim();


  const query =
    [
      venue,
      address
    ]
      .filter(Boolean)
      .join(", ");


  if (!query) {
    return;
  }


  link.href =
    "https://www.google.com/maps/search/" +
    "?api=1" +
    "&query=" +
    encodeURIComponent(query);

}


/* =========================================================
   11. CHURCH GOOGLE MAPS LINK
========================================================= */

function updateChurchMapLink(
  settings
) {

  const link =
    document.getElementById(
      "churchMapLink"
    );


  if (!link) {
    return;
  }


  const church =
    String(
      settings["Church"] || ""
    ).trim();


  const address =
    String(
      settings[
        "Church Address"
      ] || ""
    ).trim();


  const query =
    [
      church,
      address
    ]
      .filter(Boolean)
      .join(", ");


  if (!query) {
    return;
  }


  link.href =
    "https://www.google.com/maps/search/" +
    "?api=1" +
    "&query=" +
    encodeURIComponent(query);

}


/* =========================================================
   12. ADD TO GOOGLE CALENDAR
========================================================= */

function addCalendar() {

  /*
    September 29, 2026
    11:00 AM Philippines
    = 03:00 UTC
  */

  const start =
    "20260929T030000Z";


  const end =
    "20260929T050000Z";


  const title =
    "Marcus Cloud — Christening & 1st Birthday";


  const details =
    "Please join us for Marcus Cloud's Christening & 1st Birthday Celebration.";


  const location =
    "Our Lady of the Miraculous Medal Parish, Calumpang, Molo, Iloilo City";


  const url =
    "https://calendar.google.com/calendar/render" +

    "?action=TEMPLATE" +

    "&text=" +
    encodeURIComponent(
      title
    ) +

    "&dates=" +
    encodeURIComponent(
      start +
      "/" +
      end
    ) +

    "&details=" +
    encodeURIComponent(
      details
    ) +

    "&location=" +
    encodeURIComponent(
      location
    );


  window.open(
    url,
    "_blank",
    "noopener"
  );

}


/* =========================================================
   13. CONTACT ORGANIZER
========================================================= */

function contactOrganizer() {

  let phone =
    "+639647544914";


  if (
    typeof APP_CONFIG !==
    "undefined" &&
    APP_CONFIG.organizerPhone
  ) {

    phone =
      APP_CONFIG.organizerPhone;

  }


  window.location.href =
    "tel:" + phone;

}


/* =========================================================
   14. SETUP CONTACT LINKS
========================================================= */

function setupOrganizerContact() {

  let phone =
    "+639647544914";


  if (
    typeof APP_CONFIG !==
    "undefined" &&
    APP_CONFIG.organizerPhone
  ) {

    phone =
      APP_CONFIG.organizerPhone;

  }


  const links =
    document.querySelectorAll(
      "[data-contact-organizer]"
    );


  links.forEach(
    function (link) {

      link.href =
        "tel:" + phone;

    }
  );

}


/* =========================================================
   15. GIFT LIST
========================================================= */

const DEFAULT_GIFT_LIST = [

  {
    icon: "👕",
    name: "Clothes",
    description:
      "Comfy outfits and cute little essentials"
  },

  {
    icon: "🧸",
    name: "Toys",
    description:
      "Educational and age-appropriate toys"
  },

  {
    icon: "📚",
    name: "Books",
    description:
      "Storybooks and learning books"
  },

  {
    icon: "🍼",
    name: "Baby Essentials",
    description:
      "Useful everyday items for Marcus"
  },

  {
    icon: "💌",
    name: "Monetary Gift",
    description:
      "A little blessing for Marcus' future"
  }

];


/* =========================================================
   16. RENDER GIFT LIST
========================================================= */

function renderGiftList() {

  const container =
    document.getElementById(
      "giftList"
    );


  if (!container) {
    return;
  }


  let gifts =
    DEFAULT_GIFT_LIST;


  /*
    If config.js has a custom gift list,
    use that instead.
  */

  if (
    typeof APP_CONFIG !==
      "undefined" &&

    Array.isArray(
      APP_CONFIG.giftList
    ) &&

    APP_CONFIG.giftList.length
  ) {

    gifts =
      APP_CONFIG.giftList;

  }


  container.innerHTML =
    "";


  gifts.forEach(
    function (gift) {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "gift-item";


      const icon =
        document.createElement(
          "div"
        );


      icon.className =
        "gift-item-icon";


      icon.textContent =
        gift.icon ||
        "🎁";


      const information =
        document.createElement(
          "div"
        );


      information.className =
        "gift-item-info";


      const title =
        document.createElement(
          "strong"
        );


      title.textContent =
        gift.name ||
        "Gift";


      const description =
        document.createElement(
          "span"
        );


      description.textContent =
        gift.description ||
        "";


      information.appendChild(
        title
      );


      if (
        gift.description
      ) {

        information.appendChild(
          description
        );

      }


      item.appendChild(
        icon
      );


      item.appendChild(
        information
      );


      container.appendChild(
        item
      );

    }
  );

}


/* =========================================================
   17. OPEN GIFT MODAL
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


/* =========================================================
   18. CLOSE GIFT MODAL
========================================================= */

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
   19. ONLINE GIFT REGISTRY
========================================================= */

function setupGiftRegistry() {

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


  let registryUrl =
    "";


  if (
    typeof APP_CONFIG !==
    "undefined"
  ) {

    registryUrl =
      String(
        APP_CONFIG
          .giftRegistryUrl ||
        ""
      ).trim();

  }


  /*
    Hide Online Registry button
    if no URL is configured.
  */

  if (!registryUrl) {

    wrapper.classList.add(
      "hidden"
    );


    button.removeAttribute(
      "href"
    );


    return;

  }


  button.href =
    registryUrl;


  wrapper.classList.remove(
    "hidden"
  );

}


/* =========================================================
   20. GIFT MODAL EVENTS
========================================================= */

function setupGiftModalEvents() {

  const modal =
    document.getElementById(
      "giftModal"
    );


  if (!modal) {
    return;
  }


  /*
    Click outside the popup
    to close it.
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
    ESC key closes popup.
  */

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key ===
          "Escape" &&

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
   21. PHOTO GALLERY
========================================================= */

function openPhotoGallery() {

  let galleryUrl =
    "";


  if (
    typeof APP_CONFIG !==
    "undefined"
  ) {

    galleryUrl =
      String(
        APP_CONFIG
          .photoGalleryUrl ||
        ""
      ).trim();

  }


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
   22. START WEBSITE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    /*
      Countdown
    */

    countdown();


    /*
      QR Code
    */

    makeQR();


    /*
      Organizer contact
    */

    setupOrganizerContact();


    /*
      Gift popup
    */

    setupGiftModalEvents();


    /*
      IMPORTANT:

      Get the latest venue/address
      from the Event Settings sheet.

      This means when the organizer
      changes the reception venue from
      the dashboard, the public
      invitation updates automatically.
    */

    loadEventSettings();

  }
);
