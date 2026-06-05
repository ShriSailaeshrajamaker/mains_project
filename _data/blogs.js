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

module.exports = function () {
  const all = [];
  const dir = path.join(__dirname, "..", "products");
  const seenPerSite = {}; // track slugs per site to avoid collisions

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

      const rating = p.rating || p.stars || p.review_rating || p.reviewScore || null;
      const reviews = p.reviews || p.reviewsCount || p.review_count || p.reviewCount || null;
      const readMins = p.readMins || p.read_mins || p.readMinutes || p.read_minutes || Math.max(1, Math.round(((p.body || "").split(/\s+/).filter(Boolean).length) / 200));

      all.push({
        site,
        siteLabel: meta.label,
        slug,
        name: p.name,
        image: p.image || "",
        blogImage: p.blog_image || p.blog_image_url || p.image || "",
        category: p.category || "",
        link: p.link || "#",
        lead: p.lead || "",
        body: p.body || "",
        price: p.price || null,
        was: p.was || null,
        rating: rating,
        reviews: reviews,
        readMins: readMins,
        pros: (p.pros || []).filter(Boolean),
        cons: (p.cons || []).filter(Boolean),
        verdict: p.verdict || ""
      });
    });
  }
  return all;
};
