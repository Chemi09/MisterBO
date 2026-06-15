-- Migration: Set product image_urls to official Mister Bo images by category
UPDATE products SET image_url = '/images/riz.jpg' WHERE LOWER(category) = 'riz';
UPDATE products SET image_url = '/images/curcuma.jpg' WHERE LOWER(category) = 'curcuma';
UPDATE products SET image_url = '/images/cafe.jpg' WHERE LOWER(category) IN ('cafe','coffee');
UPDATE products SET image_url = '/images/pack.jpg' WHERE LOWER(category) = 'pack';

-- Fallback: for names containing keywords
UPDATE products SET image_url = '/images/riz.jpg' WHERE LOWER(name) LIKE '%riz%';
UPDATE products SET image_url = '/images/curcuma.jpg' WHERE LOWER(name) LIKE '%curcuma%';
UPDATE products SET image_url = '/images/cafe.jpg' WHERE LOWER(name) LIKE '%cafe%';
