const form = document.getElementById("rsvpForm");
const statusEl = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

function setStatus(msg, type = "") {
  if (!statusEl) return;

  statusEl.textContent = msg;
  statusEl.className = "status " + type;
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!form.reportValidity()) {
    return;
  }

  const appUrl = APP_CONFIG?.APPS_SCRIPT_WEB_APP_URL;

  if (!appUrl || appUrl.includes("PASTE_")) {
    setStatus(
      "The RSVP system is not connected yet. Please contact the organizer.",
      "error"
    );
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
  }

  setStatus("");

  const data = Object.fromEntries(
    new FormData(form).entries()
  );

  data.numberOfGuests = Number(data.numberOfGuests);
  data.action = "submit";

  try {
    const response = await fetch(appUrl, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(data)
    });

    const responseText = await response.text();

    console.log("RSVP server response:", responseText);

    if (!responseText) {
      throw new Error(
        "The RSVP server returned an empty response."
      );
    }

    let result;

    try {
      result = JSON.parse(responseText);
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
        result.message || "We could not save your RSVP.",
        "error"
      );

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit RSVP";
      }

      return;
    }

    // RSVP successfully submitted

    form.classList.add("hidden");

    const guestName = document.getElementById("guestName");
    const confirmation = document.getElementById("confirmation");
    const godparentThanks =
      document.getElementById("godparentThanks");

    if (guestName) {
      guestName.textContent = data.fullName;
    }

    if (confirmation) {
      confirmation.classList.remove("hidden");
    }

    if (
      data.godparentResponse ===
      "Yes, I would be honored!"
    ) {
      if (godparentThanks) {
        godparentThanks.classList.remove("hidden");
      }
    }

  } catch (error) {
    console.error("RSVP submission error:", error);

    setStatus(
      error.message ||
        "Connection error. Please try again or contact the organizer.",
      "error"
    );

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit RSVP";
    }
  }
});
