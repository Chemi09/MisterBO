/*
Script to update product image_url in Supabase.
Usage:
  SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=... SITE_URL=https://your-site.com node scripts/update-product-images.js

This script updates products by category or name hint to use the official images placed in /public/images.
*/

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_URL = process.env.SITE_URL || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Aborting.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const mapping = {
  riz: `${SITE_URL}/images/riz.jpg`,
  curcuma: `${SITE_URL}/images/curcuma.jpg`,
  cafe: `${SITE_URL}/images/cafe.jpg`,
  pack: `${SITE_URL}/images/pack.jpg`,
};

function chooseImage(product) {
  const cat = (product.category || '').toLowerCase();
  const slug = (product.slug || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  if (cat.includes('riz') || slug.includes('riz') || name.includes('riz')) return mapping.riz;
  if (cat.includes('curcuma') || slug.includes('curcuma') || name.includes('curcuma')) return mapping.curcuma;
  if (cat.includes('cafe') || cat.includes('coffee') || slug.includes('cafe') || name.includes('cafe')) return mapping.cafe;
  if (cat.includes('pack') || slug.includes('pack') || name.includes('pack')) return mapping.pack;
  return null;
}

(async function main() {
  try {
    const { data: products, error } = await supabase.from('products').select('id, slug, name, category, image_url');
    if (error) throw error;
    const updates = [];
    for (const p of products) {
      const newUrl = chooseImage(p);
      if (newUrl && p.image_url !== newUrl) {
        updates.push({ id: p.id, image_url: newUrl });
      }
    }
    console.log(`Will update ${updates.length} products.`);
    for (const u of updates) {
      const { error } = await supabase.from('products').update({ image_url: u.image_url }).eq('id', u.id);
      if (error) console.error('Update error for', u.id, error.message);
      else console.log('Updated', u.id);
    }
    console.log('Done.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
