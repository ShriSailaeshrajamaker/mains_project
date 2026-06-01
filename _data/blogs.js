// _data/blogs.js
// Reads every site's product JSON from /products and flattens into blog entries.
// Eleventy generates one /<site>/blogs/<slug>/ page per product from this list.

const fs = require("fs");
const path = require("path");

// site key -> { json file in /products , display label , storefront file }
const SITES = {
  onlinefinds:   { file: "index.json",          label: "Online Finds",   store: "index.html" },
  dailyloot:     { file: "dailyloot.json",       label: "DailyLoot",      store: "@dailyloot.co.html" },
  justoneclick:  { file: "justoneclick.json",    label: "Just One Click", store: "@just.one_click.co.html" },
  phaseblank:    { file: "phaseblank.json",       label: "Phase Blank",    store: "@phase.blank.html" },
  cartedupdaily: { file: "cartedupdaily.json",    label: "CartedUpDaily",  store: "@cartedupdaily.html" }
};

function slugify(s) {
  return (s || "").toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// estimate read time from lead + body + verdict (~200 words/min, min 1)
function readTime() {
  return function (txt) {
    const words = (txt || "").trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  };
}

module.exports = function () {
  const all = [];
  const dir = path.join(__dirname, "..", "products");
  const seenPerSite = {}; // track slugs per site to avoid collisions
  const calcRead = readTime();

  for (const [site, meta] of Object.entries(SITES)) {
    const fp = path.join(dir, meta.file);
    if (!fs.existsSync(fp)) continue;
    let data;
    try { data = JSON.parse(fs.readFileSync(fp, "utf8")); }
    catch (e) { console.warn("Bad JSON in", meta.file, e.message); continue; }

    seenPerSite[site] = seenPerSite[site] || {};

    (data.products || []).forEach((p, i) => {
      if (!p || !p.name || !p.name.trim()) return; // skip nameless rows

      // base slug from the product's slug field, else from the name
      let base = (p.slug && p.slug.trim()) ? slugify(p.slug) : slugify(p.name);
      if (!base) base = "product"; // last-resort fallback so it's never empty

      // ensure uniqueness within this site (egg, egg-2, egg-3 ...)
      let slug = base;
      let n = 2;
      while (seenPerSite[site][slug]) { slug = base + "-" + n; n++; }
      seenPerSite[site][slug] = true;

      const ratingNum = parseFloat(p.rating);
      all.push({
        site,
        siteLabel: meta.label,
        slug,
        name: p.name,
        image: p.image || "",
        blogImage: p.blog_image || p.image || "",
        category: p.category || "",
        link: p.link || "#",
        price: p.price || "",
        was: p.was || "",
        rating: (!isNaN(ratingNum) && ratingNum > 0) ? ratingNum : 0,
        lead: p.lead || "",
        body: p.body || "",
        readMins: calcRead((p.lead || "") + " " + (p.body || "") + " " + (p.verdict || "")),
        pros: (p.pros || []).filter(Boolean),
        cons: (p.cons || []).filter(Boolean),
        verdict: p.verdict || ""
      });
    });
  }

  // attach up to 3 "related" products from the SAME site (for "More finds you'll like")
  const bySite = {};
  all.forEach(b => { (bySite[b.site] = bySite[b.site] || []).push(b); });
  all.forEach(b => {
    b.related = (bySite[b.site] || [])
      .filter(x => x.slug !== b.slug)
      .slice(0, 3)
      .map(x => ({ name: x.name, slug: x.slug, image: x.image, site: x.site }));
  });

  return all;
};
