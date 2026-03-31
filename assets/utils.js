// Shared GPMF utilities — loaded globally via default.html
// window.GPMF.workerBase and window.GPMF.calendarUrl are injected
// by default.html from _config.yml values.
window.GPMF = window.GPMF || {};

/**
 * Fetch a URL and parse the JSON response.
 * Uses cache: "no-store" to always get fresh data.
 * @param {string} url
 * @returns {Promise<any>}
 */
GPMF.fetchJSON = async function (url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("HTTP " + res.status + " – " + url);
  return res.json();
};

/**
 * Escape a string for safe HTML insertion.
 * @param {string} s
 * @returns {string}
 */
GPMF.escapeHtml = function (s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c])
  );
};

/**
 * Fisher-Yates shuffle. Mutates and returns the array.
 * @param {Array} arr
 * @returns {Array}
 */
GPMF.shuffle = function (arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
