// _data/chrome.js
// For each site, read its REAL storefront HTML and split it into:
//   head   = everything from <!doctype> up to and including </head>
//   top    = body start through the end of the HERO (before the product area)
//   bottom = promo/trust/whatsapp/footer block (after the product grid)
// The blog template reuses head + top + (blog content) + bottom, so blogs
// look identical to the storefront — same fonts, colours, navbar, footer.

const fs = require("fs");
const path = require("path");

const STORE_FILES = {
  onlinefinds:   "index.html",
  dailyloot:     "@dailyloot.co.html",
  justoneclick:  "@just.one_click.co.html",
  phaseblank:    "@phase.blank.html",
  cartedupdaily: "@cartedupdaily.html"
};

function extract(html) {
  // normalise newlines
  html = html.replace(/\r\n/g, "\n");

  // HEAD: up to and including </head>
  const headEnd = html.indexOf("</head>");
  const head = html.slice(0, headEnd + "</head>".length);

  // TOP: from <body...> up to the SEARCH section (so the blog gets the
  // banner + navbar + hero, but NOT the search box / category tabs, which
  // rely on storefront JS that doesn't run on the blog page).
  const bodyStart = html.search(/<body[^>]*>/i);
  const bodyTag = html.match(/<body[^>]*>/i)[0];
  let cut = html.indexOf('class="search-wrapper"');
  if (cut === -1) cut = html.indexOf('id="productGrid"'); // fallback
  let divStart = html.lastIndexOf("<div", cut);
  let commentStart = html.lastIndexOf("<!-- SEARCH", divStart);
  const topEndIdx = commentStart !== -1 ? commentStart : divStart;
  const top = html.slice(bodyStart + bodyTag.length, topEndIdx);

  // BOTTOM: from the PROMO block (or trust bar) to </body>.
  let promoIdx = html.indexOf('class="promo-block"');
  let promoDiv = promoIdx !== -1 ? html.lastIndexOf("<div", promoIdx) : -1;
  let promoComment = promoDiv !== -1 ? html.lastIndexOf("<!-- PROMO", promoDiv) : -1;
  let bottomStart = promoComment !== -1 ? promoComment : (promoDiv !== -1 ? promoDiv : html.indexOf('class="trust-bar"'));
  const bodyEnd = html.indexOf("</body>");
  let bottom = html.slice(bottomStart, bodyEnd);
  // strip any <script>...</script> from the bottom (storefront JS not needed on blog)
  bottom = bottom.replace(/<script[\s\S]*?<\/script>/gi, "");

  return { head, bodyTag, top, bottom };
}

module.exports = function () {
  const out = {};
  const root = path.join(__dirname, "..");
  for (const [site, file] of Object.entries(STORE_FILES)) {
    const fp = path.join(root, file);
    if (!fs.existsSync(fp)) { out[site] = null; continue; }
    try {
      out[site] = extract(fs.readFileSync(fp, "utf8"));
    } catch (e) {
      console.warn("chrome extract failed for", site, e.message);
      out[site] = null;
    }
  }
  return out;
};
