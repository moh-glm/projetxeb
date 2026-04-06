const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const db      = require('../db');

// ── Multer configuration ──────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ── GET /api/products ─────────────────────────────────────────────────────────
// Optional query param: ?search=<term>
// Products whose name STARTS WITH the term are returned first,
// followed by products that simply CONTAIN the term.
router.get('/', async (req, res) => {
  try {
    const search = (req.query.search || '').trim();

    let products;
    if (search) {
      const [startsWith] = await db.execute(
        'SELECT * FROM products WHERE name LIKE ? ORDER BY name ASC',
        [search + '%']
      );
      const [others] = await db.execute(
        'SELECT * FROM products WHERE name LIKE ? AND name NOT LIKE ? ORDER BY name ASC',
        ['%' + search + '%', search + '%']
      );
      products = [...startsWith, ...others];
    } else {
      [products] = await db.execute(
        'SELECT * FROM products ORDER BY created_at DESC'
      );
    }

    res.json(products);
  } catch (err) {
    console.error('GET /api/products error:', err);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// ── POST /api/products ────────────────────────────────────────────────────────
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Server-side validation
    const errors = {};
    if (!name || !name.trim())               errors.name        = 'Product name is required';
    if (!description || !description.trim()) errors.description = 'Description is required';
    if (!price) {
      errors.price = 'Price is required';
    } else if (isNaN(price) || parseFloat(price) <= 0) {
      errors.price = 'Price must be a positive number';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: Object.values(errors).join('. ') });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.execute(
      'INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)',
      [name.trim(), description.trim(), parseFloat(price), imageUrl]
    );

    res.status(201).json({
      message: 'Product added successfully',
      product: {
        id:          result.insertId,
        name:        name.trim(),
        description: description.trim(),
        price:       parseFloat(price),
        image_url:   imageUrl,
      },
    });
  } catch (err) {
    console.error('POST /api/products error:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

module.exports = router;
