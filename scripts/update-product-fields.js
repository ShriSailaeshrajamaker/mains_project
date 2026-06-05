const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'products');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

const defaults = [
  { slug: 'best-budget-digital-watch-everyday-use', price: '₹1,799', was: '₹2,299', rating: 4.3, reviews: 134 },
  { slug: 'elegant-bird-home-decor-showpiece', price: '₹999', was: '₹1,499', rating: 4.4, reviews: 89 },
  { slug: 'ceramic-pickle-jar-kitchen-storage', price: '₹749', was: '₹1,069', rating: 4.2, reviews: 58 },
  { slug: 'soap-dispenser-for-kitchen-cleaning', price: '₹549', was: '₹899', rating: 4.0, reviews: 64 },
  { slug: 'smart-egg-container-refrigerator-storage', price: '₹799', was: '₹1,199', rating: 4.3, reviews: 73 },
  { slug: 'trigger-trinity-2-mobile-gaming-accessory', price: '₹649', was: '₹999', rating: 4.0, reviews: 71 },
  { slug: 'premium-decorasia-spoons-dining-set', price: '₹899', was: '₹1,299', rating: 4.5, reviews: 52 },
  { slug: 'stackable-kitchen-storage-containers-organization', price: '₹1,099', was: '₹1,499', rating: 4.2, reviews: 46 },
  { slug: 'visconti-perfume-review-luxury-fragrance', price: '₹1,099', was: '₹1,799', rating: 4.1, reviews: 38 },
  { slug: 'animal-review', price: '₹499', was: '₹799', rating: 4.1, reviews: 33 },
  { slug: 'finaltestr', price: '₹699', was: '₹1,099', rating: 4.0, reviews: 27 }
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  let json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updated = false;

  if (!Array.isArray(json.products)) return;

  json.products = json.products.map((p, index) => {
    const slug = p.slug || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `product-${index}`);
    const def = defaults.find(d => d.slug === slug) || {
      price: '₹799',
      was: '₹999',
      rating: 4.2,
      reviews: 42
    };

    if (p.price == null) { p.price = def.price; updated = true; }
    if (p.was == null) { p.was = def.was; updated = true; }
    if (p.rating == null) { p.rating = def.rating; updated = true; }
    if (p.reviews == null) { p.reviews = def.reviews; updated = true; }
    if (p.readMins == null && typeof p.body === 'string') {
      const words = p.body.split(/\s+/).filter(Boolean).length;
      p.readMins = Math.max(1, Math.round(words / 200));
      updated = true;
    }
    return p;
  });

  if (updated) {
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
    console.log('Updated', file);
  }
});
