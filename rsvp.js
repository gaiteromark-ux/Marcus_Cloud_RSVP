"use strict";


/* =========================================================
   ELEMENTS
========================================================= */

const form =
  document.getElementById(
    "rsvpForm"
  );

const statusEl =
  document.getElementById(
    "formStatus"
  );

const submitBtn =
  document.getElementById(
    "submitBtn"
  );


/* =========================================================
   GET APPS SCRIPT URL
========================================================= */

function getAppUrl() {

  if (
    typeof APP_CONFIG ===
    "undefined"
  ) {
    return "";
  }


  return (
    APP_CONFIG.APPS_SCRIPT_WEB_APP_URL ||
    APP_CONFIG.webAppUrl ||
    ""
  );
}


/* =========================================================
   STATUS MESSAGE
========================================================= */

function setStatus(
  message,
  type = ""
) {

  if (!statusEl) {
    return;
  }


  statusEl.textContent =
    message;


  statusEl.className =
    "status";


  if (type) {

    statusEl.classList.add(
      type
    );
  }
}


/* =========================================================
   SUBMIT RSVP
========================================================= */

form?.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    if (
      !form.reportValidity()
    ) {
      return;
    }


    const appUrl =
      getAppUrl();


    if (
      !appUrl ||
      appUrl.includes(
        "PASTE_"
      )
    ) {

      setStatus(
        "The RSVP system is not connected yet. Please contact the organizer.",
        "error"
      );

      return;
    }


    if (submitBtn) {

      submitBtn.disabled =
        true;

      submitBtn.textContent =
        "Sending...";
    }


    setStatus(
      "Sending your RSVP..."
    );


    const formData =
      new FormData(form);


    const data = {

      action:
        "submit",

      fullName:
        String(
          formData.get(
            "fullName"
          ) || ""
        ).trim(),

      contactNumber:
        String(
          formData.get(
            "contactNumber"
          ) || ""
        ).trim(),

      email:
        String(
          formData.get(
            "email"
          ) || ""
        ).trim(),

      numberOfGuests:
        Number(
          formData.get(
            "numberOfGuests"
          ) || 1
        ),

      attendance:
        String(
          formData.get(
            "attendance"
          ) || ""
        ),

      godparentResponse:
        String(
          formData.get(
            "godparentResponse"
          ) || ""
        ),

      message:
        String(
          formData.get(
            "message"
          ) || ""
        ).trim()
    };


    try {

      const response =
        await fetch(
          appUrl,
          {

            method:
              "POST",

            redirect:
              "follow",

            headers: {

              "Content-Type":
                "text/plain;charset=utf-8"

            },

            body:
              JSON.stringify(
                data
              )

          }
        );


      const responseText =
        await response.text();


      console.log(
        "RSVP server response:",
        responseText
      );


      if (!responseText) {

        throw new Error(
          "The RSVP server returned an empty response."
        );
      }


      let result;


      try {

        result =
          JSON.parse(
            responseText
          );

      } catch (error) {

        console.error(
          "Invalid RSVP server response:",
          responseText
        );


        throw new Error(
          "The RSVP server returned an invalid response."
        );
      }


      if (!result.ok) {

        setStatus(
          result.message ||
          "We could not save your RSVP.",
          "error"
        );

        return;
      }


      /* ===============================================
         SUCCESS
      ================================================ */

      showConfirmation(
        data
      );


    } catch (error) {

      console.error(
        "RSVP submission error:",
        error
      );


      if (
        error.message ===
        "Failed to fetch"
      ) {

        setStatus(
          "Unable to connect to the RSVP server. Please check the Google Apps Script deployment and try again.",
          "error"
        );

      } else {

        setStatus(
          error.message ||
          "Connection error. Please try again or contact the organizer.",
          "error"
        );
      }


    } finally {

      if (submitBtn) {

        submitBtn.disabled =
          false;

        submitBtn.textContent =
          "Submit RSVP";
      }

    }

  }
);


/* =========================================================
   SHOW CONFIRMATION
========================================================= */

function showConfirmation(
  data
) {

  const guestName =
    document.getElementById(
      "guestName"
    );

  const confirmation =
    document.getElementById(
      "confirmation"
    );

  const godparentThanks =
    document.getElementById(
      "godparentThanks"
    );


  if (guestName) {

    guestName.textContent =
      data.fullName;
  }


  if (
    data.godparentResponse ===
    "Yes, I would be honored!"
  ) {

    godparentThanks?.classList.remove(
      "hidden"
    );

  } else {

    godparentThanks?.classList.add(
      "hidden"
    );
  }


  form?.classList.add(
    "hidden"
  );


  confirmation?.classList.remove(
    "hidden"
  );


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  loadConfirmationSettings();
}


/* =========================================================
   LOAD LATEST EVENT SETTINGS
========================================================= */

async function loadConfirmationSettings() {

  const appUrl =
    getAppUrl();


  if (!appUrl) {
    return;
  }


  try {

    const response =
      await fetch(
        appUrl,
        {

          method:
            "POST",

          redirect:
            "follow",

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


    const responseText =
      await response.text();


    if (!responseText) {
      return;
    }


    let result;


    try {

      result =
        JSON.parse(
          responseText
        );

    } catch (error) {

      console.warn(
        "Invalid event settings response:",
        responseText
      );

      return;
    }


    if (
      !result.ok ||
      !result.settings
    ) {
      return;
    }


    const settings =
      result.settings;


    setText(
      "confirmationEventDate",
      settings[
        "Event Date"
      ]
    );


    setText(
      "confirmationChurchTime",
      settings[
        "Event Time"
      ]
    );


    setText(
      "confirmationChurch",
      settings[
        "Church"
      ]
    );


    setText(
      "confirmationReceptionTime",
      settings[
        "Reception Time"
      ]
    );


    setText(
      "confirmationReceptionVenue",
      settings[
        "Reception Venue"
      ]
    );


  } catch (error) {

    console.warn(
      "Unable to load event settings:",
      error
    );
  }
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
    document.getElementById(
      id
    );


  if (element) {

    element.textContent =
      String(value);
  }
}


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadConfirmationSettings();

  }
);
