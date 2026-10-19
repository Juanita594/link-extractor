/* Utility module for extracting links and normalizing them.
   Exports a global `Extract` object with extractLinksAndText(text) and normalizeUrl(url).
   This file is browser-friendly and does not use modules to keep it simple.
*/
(function (global) {
  'use strict';

  function normalizeUrl(raw) {
    if (!raw) return '';
    let s = String(raw).trim();
    s = s.replace(/^[<("']+/, '').replace(/[>),.!?"']+$/g, '');
    return s;
  }

  function uniquePreserveOrder(arr) {
    const seen = new Set();
    const out = [];
    for (const x of arr) {
      const n = x.trim();
      if (!seen.has(n)) {
        seen.add(n);
        out.push(n);
      }
    }
    return out;
  }

  function extractLinksAndText(text) {
    if (!text || !text.trim()) return { links: [], remaining: '' };

    let working = String(text);
    const links = [];

    const anchorRegex = /<a\b[^>]*\bhref=(?:"|')([^"'<>]+)(?:"|')[^>]*>([\s\S]*?)<\/a>/gi;
    working = working.replace(anchorRegex, function (m, href) {
      links.push(normalizeUrl(href));
      return '';
    });

    const mdRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi;
    working = working.replace(mdRegex, function (m, _t, href) {
      links.push(normalizeUrl(href));
      return '';
    });

    const urlRegex = /((https?:\/\/|www\.)[^\s<>"'`]+)/gi;
    working = working.replace(urlRegex, function (m) {
      links.push(normalizeUrl(m));
      return '';
    });

    const remaining = working
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return { links: uniquePreserveOrder(links.filter(Boolean)), remaining };
  }

  global.Extract = { normalizeUrl, extractLinksAndText };
})(window);
