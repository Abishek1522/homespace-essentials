import { Router } from 'express';
import { db, tx } from '../db.js';

const SORTS = {
  popular: 'featured DESC, id ASC',
  price_asc: 'price ASC, id ASC',
  price_desc: 'price DESC, id ASC',
  rating: 'rating DESC, rating_count DESC',
  discount: '(mrp - price) * 1.0 / mrp DESC, id ASC',
  newest: 'id DESC'
};

const colType = { text: 'TEXT', int: 'INTEGER', bool: 'INTEGER' };

/**
 * One module per department. Each owns its table, its category-specific attributes, its seed data
 * and its routes (/api/<key>). Orders talk to modules only through getBySlug and adjustStock.
 */
export function defineModule({ key, label, blurb, attrs, seed }) {
  const table = `${key}_products`;
  const attrCols = attrs.map((a) => `${a.name} ${colType[a.type] ?? 'TEXT'}`).join(',\n  ');

  db.exec(`
CREATE TABLE IF NOT EXISTS ${table} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  mrp INTEGER NOT NULL CHECK (mrp >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  rating REAL NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  features TEXT NOT NULL DEFAULT '[]',
  room TEXT NOT NULL DEFAULT 'everyday',
  art TEXT NOT NULL,
  tone TEXT NOT NULL,
  accent TEXT NOT NULL,
  image_url TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  ${attrCols}
);`);

  const baseNames = ['slug', 'name', 'brand', 'price', 'mrp', 'stock', 'rating', 'rating_count', 'description', 'features', 'room', 'art', 'tone', 'accent', 'image_url', 'featured'];
  const allNames = [...baseNames, ...attrs.map((a) => a.name)];

  const count = db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n;
  if (count === 0) {
    const ins = db.prepare(`INSERT INTO ${table} (${allNames.join(',')}) VALUES (${allNames.map(() => '?').join(',')})`);
    tx(() => {
      for (const p of seed) {
        ins.run(...allNames.map((n) => {
          const v = p[n];
          if (n === 'features') return JSON.stringify(v ?? []);
          if (typeof v === 'boolean') return v ? 1 : 0;
          if (v == null && (n === 'rating' || n === 'rating_count')) return 0;
          return v ?? null;
        }));
      }
    });
  }

  const toPublic = (r) => {
    const image = r.image_url || `/art/${r.art}.svg?c=${r.tone.replace('#', '')}&a=${r.accent.replace('#', '')}`;
    const attrObj = {};
    for (const a of attrs) {
      const v = r[a.name];
      attrObj[a.name] = a.type === 'bool' ? !!v : v;
    }
    return {
      module: key,
      id: r.id,
      slug: r.slug,
      name: r.name,
      brand: r.brand,
      price: r.price,
      mrp: r.mrp,
      discount: r.mrp > r.price ? Math.round(((r.mrp - r.price) / r.mrp) * 100) : 0,
      stock: r.stock,
      in_stock: r.stock > 0,
      rating: r.rating,
      rating_count: r.rating_count,
      description: r.description,
      features: JSON.parse(r.features || '[]'),
      room: r.room,
      image,
      featured: !!r.featured,
      attrs: attrObj
    };
  };

  function list(params = {}) {
    const where = ['active = 1'];
    const args = [];
    if (params.q) {
      where.push('(name LIKE ? OR brand LIKE ? OR description LIKE ?)');
      const like = `%${String(params.q).slice(0, 60)}%`;
      args.push(like, like, like);
    }
    if (Number.isFinite(params.min)) { where.push('price >= ?'); args.push(params.min); }
    if (Number.isFinite(params.max)) { where.push('price <= ?'); args.push(params.max); }
    if (params.room) { where.push('room = ?'); args.push(String(params.room)); }
    if (params.brand) { where.push('brand = ?'); args.push(String(params.brand)); }
    if (params.in_stock) where.push('stock > 0');
    if (params.featured) where.push('featured = 1');
    const order = SORTS[params.sort] ?? SORTS.popular;
    const limit = Math.min(Math.max(params.limit | 0 || 24, 1), 100);
    const offset = Math.max(params.offset | 0, 0);
    const sql = ` FROM ${table} WHERE ${where.join(' AND ')}`;
    const total = db.prepare(`SELECT COUNT(*) AS n${sql}`).get(...args).n;
    const rows = db.prepare(`SELECT *${sql} ORDER BY ${order} LIMIT ? OFFSET ?`).all(...args, limit, offset);
    return { total, items: rows.map(toPublic) };
  }

  function facets() {
    const rooms = db.prepare(`SELECT room, COUNT(*) AS n FROM ${table} WHERE active = 1 GROUP BY room ORDER BY n DESC`).all();
    const brands = db.prepare(`SELECT brand, COUNT(*) AS n FROM ${table} WHERE active = 1 GROUP BY brand ORDER BY brand`).all();
    const p = db.prepare(`SELECT MIN(price) AS min, MAX(price) AS max, COUNT(*) AS count FROM ${table} WHERE active = 1`).get();
    return { rooms, brands, price: { min: p.min, max: p.max }, count: p.count };
  }

  const getBySlug = (slug) => {
    const r = db.prepare(`SELECT * FROM ${table} WHERE slug = ? AND active = 1`).get(String(slug));
    return r ? { row: r, product: toPublic(r) } : null;
  };

  // Reserves stock for an order. Throws if there is not enough.
  const takeStock = (id, qty) => {
    const res = db.prepare(`UPDATE ${table} SET stock = stock - ? WHERE id = ? AND stock >= ?`).run(qty, id, qty);
    if (res.changes !== 1) throw Object.assign(new Error('out_of_stock'), { code: 'out_of_stock' });
  };
  const returnStock = (id, qty) => db.prepare(`UPDATE ${table} SET stock = stock + ? WHERE id = ?`).run(qty, id);

  const router = Router();
  const num = (v) => (v === undefined || v === '' ? undefined : Number(v));

  router.get('/', (req, res) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 24, 100);
    const out = list({
      q: req.query.q, min: num(req.query.min), max: num(req.query.max), room: req.query.room, brand: req.query.brand,
      in_stock: req.query.in_stock === '1', featured: req.query.featured === '1', sort: req.query.sort, limit, offset: (page - 1) * limit
    });
    res.json({ module: key, page, limit, ...out, facets: facets() });
  });
  router.get('/meta', (_req, res) => res.json(meta()));
  router.get('/:slug', (req, res) => {
    const hit = getBySlug(req.params.slug);
    if (!hit) return res.status(404).json({ error: 'not_found' });
    const related = list({ room: hit.row.room, limit: 5 }).items.filter((p) => p.slug !== hit.product.slug).slice(0, 4);
    res.json({ product: hit.product, related, meta: meta() });
  });

  function meta() {
    const f = facets();
    return { key, label, blurb, attrs: attrs.map(({ name, label: l, type }) => ({ name, label: l, type })), count: f.count, from: f.price.min };
  }

  // Admin helpers (see admin.js)
  const adminList = () => db.prepare(`SELECT * FROM ${table} ORDER BY id`).all().map((r) => ({ ...toPublic(r), active: !!r.active }));
  const adminUpdate = (id, patch) => {
    const allowed = { price: 'int', mrp: 'int', stock: 'int', featured: 'bool', active: 'bool', name: 'text', description: 'text', image_url: 'text' };
    const sets = [];
    const args = [];
    for (const [k, t] of Object.entries(allowed)) {
      if (!(k in patch)) continue;
      let v = patch[k];
      if (t === 'int') { v = Number(v); if (!Number.isInteger(v) || v < 0) throw Object.assign(new Error(`bad_${k}`), { code: 'bad_input' }); }
      if (t === 'bool') v = v ? 1 : 0;
      if (t === 'text') { v = v == null ? null : String(v).slice(0, 2000); if (k === 'name' && !v) throw Object.assign(new Error('bad_name'), { code: 'bad_input' }); }
      sets.push(`${k} = ?`);
      args.push(v);
    }
    if (!sets.length) throw Object.assign(new Error('nothing_to_update'), { code: 'bad_input' });
    const res = db.prepare(`UPDATE ${table} SET ${sets.join(', ')} WHERE id = ?`).run(...args, id);
    if (res.changes !== 1) throw Object.assign(new Error('not_found'), { code: 'not_found' });
    const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
    return { ...toPublic(row), active: !!row.active };
  };

  return { key, label, blurb, table, router, list, facets, meta, getBySlug, takeStock, returnStock, adminList, adminUpdate };
}
