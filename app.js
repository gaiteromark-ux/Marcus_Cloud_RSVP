const opening = document.getElementById("opening");

function closeOpening() {
  if (opening) {
    opening.classList.add("closed");
    setTimeout(() => opening.remove(), 500);
  }
}


// ==========================================
// COUNTDOWN
// ==========================================

function countdown() {
  const target = new Date(APP_CONFIG.eventDateISO).getTime();
  const el = document.getElementById("countdown");

  if (!el) return;

  const tick = () => {
    const diff = Math.max(0, target - Date.now());

    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000) % 24;
    const m = Math.floor(diff / 60000) % 60;
    const s = Math.floor(diff / 1000) % 60;

    el.innerHTML = [
      ["Days", d],
      ["Hours", h],
      ["Minutes", m],
      ["Seconds", s]
    ]
      .map(
        x =>
          `<div><b>${String(x[1]).padStart(2, "0")}</b><span>${x[0]}</span></div>`
      )
      .join("");
  };

  tick();
  setInterval(tick, 1000);
}


// ==========================================
// RSVP URL
// ==========================================

function rsvpUrl() {
  return new URL("rsvp.html", window.location.href).href;
}


// ==========================================
// QR CODE
// ==========================================

function makeQR() {
  const box = document.getElementById("qrcode");

  if (!box) return;

  const url = rsvpUrl();

  box.innerHTML = "";

  // Primary method: QRCode.js
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
        const canvas = box.querySelector("canvas");

        return canvas
          ? canvas.toDataURL("image/png")
          : null;
      });

      return;

    } catch (e) {
      console.warn(
        "QRCode.js failed; using image fallback.",
        e
      );
    }
  }

  // Reliable fallback
  const img = document.createElement("img");

  img.alt = "QR code to RSVP";
  img.width = 220;
  img.height = 220;
  img.loading = "eager";

  img.src =
    "https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=12&data=" +
    encodeURIComponent(url);

  box.appendChild(img);

  setupQRDownload(() => img.src);
}


// ==========================================
// DOWNLOAD QR
// ==========================================

function setupQRDownload(getSource) {
  const dl = document.getElementById("downloadQR");

  if (!dl) return;

  dl.onclick = async () => {
    const source = getSource();

    if (!source) return;

    try {
      const response = await fetch(source);
      const blob = await response.blob();

      const objectUrl =
        URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.download =
        "marcus-cloud-rsvp-qr.png";

      a.href = objectUrl;

      document.body.appendChild(a);

      a.click();

      a.remove();

      setTimeout(
        () => URL.revokeObjectURL(objectUrl),
        1000
      );

    } catch (e) {

      // Some browsers block cross-origin downloads.
      window.open(
        source,
        "_blank",
        "noopener"
      );

    }
  };
}


// ==========================================
// ADD TO GOOGLE CALENDAR
// ==========================================

function addCalendar() {

  const start = "20260929T030000Z";
  const end = "20260929T050000Z";

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


// ==========================================
// CONTACT ORGANIZER
// ==========================================

function setupOrganizerContact() {

  const phone =
    APP_CONFIG.organizerPhone;

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

      // Remove any existing click behavior
      // attached by previous code.

      if (
        button.tagName.toLowerCase() === "a"
      ) {

        button.href =
          "tel:" + phone;

        button.removeAttribute(
          "onclick"
        );

      } else {

        button.onclick = function () {

          window.location.href =
            "tel:" + phone;

        };

      }

    }

  });
}


// ==========================================
// GIFT / REGISTRY
// ==========================================

function openGiftRegistry() {

  /*
   * If an actual Gift / Registry URL has
   * been configured, open it.
   */

  if (
    APP_CONFIG.giftRegistryUrl &&
    APP_CONFIG.giftRegistryUrl.trim() !== ""
  ) {

    window.open(
      APP_CONFIG.giftRegistryUrl,
      "_blank",
      "noopener"
    );

    return;
  }


  /*
   * No registry URL yet.
   *
   * Show a friendly message instead of
   * the old "Gift/Registry details can
   * be added here in config.js" alert.
   */

  showGiftMessage();
}


// ==========================================
// GIFT / REGISTRY MESSAGE
// ==========================================

function showGiftMessage() {

  // Remove an existing popup if there is one.

  const oldModal =
    document.getElementById(
      "giftRegistryModal"
    );

  if (oldModal) {
    oldModal.remove();
  }


  const modal =
    document.createElement("div");

  modal.id =
    "giftRegistryModal";


  modal.innerHTML = `

    <div class="gift-modal-overlay"></div>

    <div class="gift-modal-box">

      <button
        type="button"
        class="gift-modal-close"
        aria-label="Close"
      >
        ×
      </button>

      <div class="gift-modal-icon">
        🎁
      </div>

      <h2>
        Gift / Registry
      </h2>

      <p>
        Your presence is already the greatest
        gift to Marcus and our family. 🤍
      </p>

      <p>
        If you would like to bless Marcus
        with a gift, please contact the
        organizer for details.
      </p>

      <button
        type="button"
        class="gift-contact-button"
      >
        📞 Contact Organizer
      </button>

    </div>

  `;


  document.body.appendChild(modal);


  // Close button

  const closeButton =
    modal.querySelector(
      ".gift-modal-close"
    );


  closeButton.addEventListener(
    "click",
    () => {
      modal.remove();
    }
  );


  // Click outside the box

  const overlay =
    modal.querySelector(
      ".gift-modal-overlay"
    );


  overlay.addEventListener(
    "click",
    () => {
      modal.remove();
    }
  );


  // Contact organizer

  const contactButton =
    modal.querySelector(
      ".gift-contact-button"
    );


  contactButton.addEventListener(
    "click",
    () => {

      const phone =
        APP_CONFIG.organizerPhone;

      if (!phone) {

        alert(
          "Organizer phone number is not configured."
        );

        return;
      }

      window.location.href =
        "tel:" + phone;

    }
  );


  // Allow ESC to close

  const escHandler = (event) => {

    if (event.key === "Escape") {

      modal.remove();

      document.removeEventListener(
        "keydown",
        escHandler
      );

    }

  };


  document.addEventListener(
    "keydown",
    escHandler
  );

}


// ==========================================
// SETUP GIFT / REGISTRY BUTTON
// ==========================================

function setupGiftRegistry() {

  const buttons =
    document.querySelectorAll("a, button");


  buttons.forEach((button) => {

    const text =
      button.textContent
        .trim()
        .toLowerCase();


    /*
     * Find the existing button based on
     * the words "Gift" and "Registry".
     */

    if (
      text.includes("gift") &&
      text.includes("registry")
    ) {

      /*
       * IMPORTANT:
       *
       * Using onclick replaces the old
       * placeholder alert that your current
       * button is showing.
       */

      button.onclick = function (event) {

        if (event) {
          event.preventDefault();
        }

        openGiftRegistry();

      };


      /*
       * If this is an <a>, remove the old
       * placeholder href so it doesn't
       * navigate somewhere else.
       */

      if (
        button.tagName.toLowerCase() === "a"
      ) {

        button.removeAttribute("href");

      }

    }

  });

}


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    countdown();

    makeQR();

    setupOrganizerContact();

    setupGiftRegistry();

    closeOpening();

  }
);

/* =========================================================
   GIFT / REGISTRY
========================================================= */

function openGiftModal() {

  const modal = document.getElementById("giftModal");

  if (!modal) return;

  modal.classList.remove("hidden");

  document.body.classList.add("modal-open");

  loadGiftList();
}


function closeGiftModal() {

  const modal = document.getElementById("giftModal");

  if (!modal) return;

  modal.classList.add("hidden");

  document.body.classList.remove("modal-open");
}


function loadGiftList() {

  const giftList =
    document.getElementById("giftList");

  const onlineRegistry =
    document.getElementById("onlineRegistry");

  const registryButton =
    document.getElementById("giftRegistryButtonOnline");


  if (!giftList) return;


  /*
    ========================================================
    GIFT LIST

    Edit these items whenever you want.
    ========================================================
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
    ========================================================
    CREATE GIFT LIST
    ========================================================
  */

  giftList.innerHTML =
    gifts.map(gift => `

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

    `).join("");


  /*
    ========================================================
    ONLINE REGISTRY

    Uses giftRegistryUrl from config.js
    ========================================================
  */

  const registryUrl =
    APP_CONFIG?.giftRegistryUrl || "";


  if (
    registryUrl &&
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
   CLOSE GIFT POPUP WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
  "click",
  function(event) {

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
   ESC KEY CLOSES POPUP
========================================================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Escape") {

      closeGiftModal();

    }

  }
);
