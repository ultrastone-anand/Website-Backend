
/* =========================================================
   GOOGLE TAG MANAGER LOADER
   CSP-compatible external JavaScript

   Container: GTM-NR3PXVZX
========================================================= */

(function (window, document, tag, layer, id) {
  "use strict";

  window[layer] = window[layer] || [];

  window[layer].push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });

  const firstScript =
    document.getElementsByTagName(tag)[0];

  const script =
    document.createElement(tag);

  const layerParameter =
    layer !== "dataLayer"
      ? "&l=" + layer
      : "";

  script.async = true;

  script.src =
    "https://www.googletagmanager.com/gtm.js?id=" +
    id +
    layerParameter;

  firstScript.parentNode.insertBefore(
    script,
    firstScript
  );
})(
  window,
  document,
  "script",
  "dataLayer",
  "GTM-NR3PXVZX"
);
