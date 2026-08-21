/* =========================================================
   MARCUS CLOUD GAITERO
   MAIN INVITATION JAVASCRIPT
========================================================= */


/* =========================================================
   OPENING
========================================================= */

const opening = document.getElementById("opening");

function closeOpening() {
  if (opening) {
    opening.classList.add("closed");

    setTimeout(() => {
      if (opening) {
        opening.remove();
      }
    }, 500);
  }
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

      /*
       * If it is an <a>, update its telephone link.
       */

      if (
        button.tagName.toLowerCase() === "a"
      ) {

        button.href =
          "tel:" + phone;

        button.removeAttribute(
          "onclick"
        );

      }

      /*
       * If it is a button, use contactOrganizer().
       */

      else {

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


  modal.classList.remove("hidden");

  document.body.classList.add(
    "modal-open"
  );


  loadGiftList();
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
   * ========================================================
   * EDIT YOUR GIFT LIST HERE
   * ========================================================
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


  /*
   * ========================================================
   * DISPLAY GIFT LIST
   * ========================================================
   */

  giftList.innerHTML =
    gifts
      .map(gift => {

        return `
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
        `;

      })
      .join("");


  /*
   * ========================================================
   * ONLINE GIFT REGISTRY
   * ========================================================
   *
   * Put your actual registry URL in config.js:
   *
   * giftRegistryUrl:
   * "https://your-registry-link.com"
   *
   */

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
   GIFT MODAL - OUTSIDE CLICK
========================================================= */

function setupGiftModalOutsideClick() {

  const modal =
    document.getElementById("giftModal");


  if (!modal) return;


  modal.addEventListener(
    "click",
    function(event) {

      /*
       * Only close if the user clicks
       * the dark overlay itself.
       */

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
