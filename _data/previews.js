// _data/previews.js
// Reads preview_product.json (a scratch file the CMS "Preview" collection writes to)
// and produces /previews/<site>/<slug>/ pages — identical to blogs, but isolated.
// This never touches your real /blogs/ content.

const fs = require("fs");
const path = require("path");

const SITE_LABELS = {
  onlinefinds:   "Online Finds",
  dailyloot:     "DailyLoot",
  justoneclick:  "Just One Click",
  phaseblank:    "Phase Blank",
  cartedupdaily: "CartedUpDaily"
};

function slugify(s) {
  return (s || "").toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

module.exports = function () {
  const fp = path.join(__dirname, "..", "preview_product.json");
  if (!fs.existsSync(fp)) return [];

  let data;
  try { data = JSON.parse(fs.readFileSync(fp, "utf8")); }
  catch (e) { console.warn("Bad JSON in preview_product.json", e.message); return []; }

  const products = data.products || [];
  const out = [];
  const seen = {};

  products.forEach((p) => {
    if (!p || !p.name || !p.name.trim()) return;

    // which site this preview belongs to (defaults to onlinefinds)
    const site = SITE_LABELS[p.site] ? p.site : "onlinefinds";

    let base = (p.slug && p.slug.trim()) ? slugify(p.slug) : slugify(p.name);
    if (!base) base = "product";
    let slug = base, n = 2;
    while (seen[site + "/" + slug]) { slug = base + "-" + n; n++; }
    seen[site + "/" + slug] = true;

    const rating = p.rating || p.stars || null;
    const reviews = p.reviews || p.reviewsCount || null;
    const readMins = p.readMins || p.read_mins ||
      Math.max(1, Math.round(((p.body || "").split(/\s+/).filter(Boolean).length) / 200));

    out.push({
      site,
      siteLabel: SITE_LABELS[site],
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

  return out;
};
