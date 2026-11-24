
/* =========================================================
   GOOGLE FONTS LOADER
   CSP-compatible external JavaScript
========================================================= */

(function () {
  "use strict";

  const fontLink = document.getElementById(
    "google-fonts-stylesheet"
  );

  if (!fontLink) {
    return;
  }

  const activateStylesheet = () => {
    fontLink.rel = "stylesheet";
  };

  // The preload may have completed before this
  // deferred script executes.
  if (fontLink.sheet) {
    activateStylesheet();
    return;
  }

  fontLink.addEventListener(
    "load",
    activateStylesheet,
    { once: true }
  );
})();
