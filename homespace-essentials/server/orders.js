import { Router } from 'express';
import { randomInt } from 'node:crypto';
import { db, tx } from './db.js';
import { byKey } from './modules/index.js';

export const CONFIG = {
  currency: 'INR',
  freeShippingOver: Number(process.env.FREE_SHIPPING_OVER ?? 2000),
  shippingFee: Number(process.env.SHIPPING_FEE ?? 99),
  returnDays: 7,
  payments: [
    { id: 'cod', label: 'Cash on delivery', enabled: true },
    { id: 'online', label: 'UPI or card', enabled: false, note: 'Not available yet' }
  ]
};

export const STATUSES = ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

const fail = (status, error, extra = {}) => Object.assign(new Error(error), { status, error, ...extra });

const normPhone = (v) => {
  const d = String(v ?? '').replace(/\D/g, '');
  return d.length > 10 ? d.slice(-10) : d;
};
const clean = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

// Prices always come from the database, never from the browser.
export function priceCart(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) throw fail(400, 'empty_cart');
  if (rawItems.length > 30) throw fail(400, 'too_many_items');
  const merged = new Map();
  for (const it of rawItems) {
    const mod = byKey[it?.module];
    const qty = Number(it?.qty);
    if (!mod || typeof it.slug !== 'string' || !Number.isInteger(qty) || qty < 1 || qty > 10) throw fail(400, 'bad_item', { item: it });
    const k = `${it.module}:${it.slug}`;
    merged.set(k, { module: it.module, slug: it.slug, qty: Math.min((merged.get(k)?.qty ?? 0) + qty, 10) });
  }
  const lines = [];
  for (const it of merged.values()) {
    const hit = byKey[it.module].getBySlug(it.slug);
    if (!hit) {
      lines.push({ ...it, unavailable: true, reason: 'not_found' });
      continue;
    }
    const p = hit.product;
    lines.push({
      module: it.module, slug: it.slug, id: p.id, name: p.name, brand: p.brand, image: p.image, price: p.price, mrp: p.mrp,
      qty: it.qty, stock: p.stock, unavailable: p.stock < it.qty, reason: p.stock < it.qty ? (p.stock === 0 ? 'out_of_stock' : 'low_stock') : null,
      line_total: p.price * it.qty
    });
  }
  const ok = lines.filter((l) => !l.unavailable);
  const subtotal = ok.reduce((s, l) => s + l.line_total, 0);
  const shipping = subtotal === 0 || subtotal >= CONFIG.freeShippingOver ? 0 : CONFIG.shippingFee;
  return { lines, subtotal, shipping, total: subtotal + shipping, blocked: lines.some((l) => l.unavailable) };
}

function newNumber() {
  const d = new Date();
  const ymd = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  for (let i = 0; i < 20; i++) {
    const n = `HS${ymd}-${randomInt(1000, 10000)}`;
    if (!db.prepare('SELECT 1 FROM orders WHERE number = ?').get(n)) return n;
  }
  throw fail(500, 'could_not_number_order');
}

function loadOrder(row) {
  const items = db.prepare('SELECT module, slug, name, price, qty, image FROM order_items WHERE order_id = ? ORDER BY id').all(row.id);
  const { id, ...rest } = row;
  return { ...rest, items: items.map((i) => ({ ...i, line_total: i.price * i.qty })) };
}

export function validateCustomer(c = {}) {
  const out = {
    name: clean(c.name, 80), phone: normPhone(c.phone), email: clean(c.email, 120).toLowerCase(), address: clean(c.address, 240),
    city: clean(c.city, 60), state: clean(c.state, 60), pincode: String(c.pincode ?? '').replace(/\D/g, '')
  };
  const errors = {};
  if (out.name.length < 2) errors.name = 'Enter your full name.';
  if (!/^[6-9]\d{9}$/.test(out.phone)) errors.phone = 'Enter a 10 digit mobile number.';
  if (out.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(out.email)) errors.email = 'Enter a valid email address.';
  if (out.address.length < 8) errors.address = 'Enter the full delivery address.';
  if (out.city.length < 2) errors.city = 'Enter your city.';
  if (out.state.length < 2) errors.state = 'Enter your state.';
  if (!/^[1-9]\d{5}$/.test(out.pincode)) errors.pincode = 'Enter a 6 digit pincode.';
  return { out, errors };
}

// Small in-memory limiter. Behind several instances, use the host's rate limiting too.
const hits = new Map();
const limit = (name, max, windowMs) => (req, res, next) => {
  const key = `${name}:${req.ip}`;
  const now = Date.now();
  const rec = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (rec.length >= max) return res.status(429).json({ error: 'too_many_requests' });
  rec.push(now);
  hits.set(key, rec);
  next();
};
setInterval(() => { const now = Date.now(); for (const [k, v] of hits) if (!v.some((t) => now - t < 900000)) hits.delete(k); }, 600000).unref();

export const router = Router();

router.get('/config', (_req, res) => res.json(CONFIG));

router.post('/cart/price', (req, res) => {
  try { res.json(priceCart(req.body?.items)); } catch (e) { res.status(e.status ?? 500).json({ error: e.error ?? 'server_error', item: e.item }); }
});

router.post('/orders', limit('order', 10, 15 * 60 * 1000), (req, res) => {
  try {
    const { out: customer, errors } = validateCustomer(req.body?.customer);
    if (Object.keys(errors).length) return res.status(422).json({ error: 'invalid_customer', fields: errors });
    const payment = req.body?.payment ?? 'cod';
    if (!CONFIG.payments.find((p) => p.id === payment && p.enabled)) return res.status(422).json({ error: 'payment_unavailable' });

    const order = tx(() => {
      const cart = priceCart(req.body?.items);
      if (cart.blocked) throw fail(409, 'items_unavailable', { lines: cart.lines.filter((l) => l.unavailable) });
      const number = newNumber();
      const info = db.prepare(`INSERT INTO orders (number, name, phone, email, address, city, state, pincode, payment, subtotal, shipping, total)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).run(number, customer.name, customer.phone, customer.email || null, customer.address, customer.city, customer.state,
        customer.pincode, payment, cart.subtotal, cart.shipping, cart.total);
      const orderId = Number(info.lastInsertRowid);
      const insItem = db.prepare('INSERT INTO order_items (order_id, module, product_id, slug, name, price, qty, image) VALUES (?,?,?,?,?,?,?,?)');
      for (const l of cart.lines) {
        byKey[l.module].takeStock(l.id, l.qty);
        insItem.run(orderId, l.module, l.id, l.slug, l.name, l.price, l.qty, l.image);
      }
      return loadOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId));
    });
    res.status(201).json({ order });
  } catch (e) {
    if (e.code === 'out_of_stock') return res.status(409).json({ error: 'items_unavailable' });
    if (e.status) return res.status(e.status).json({ error: e.error, lines: e.lines, item: e.item });
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});

router.get('/orders/:number', limit('lookup', 30, 15 * 60 * 1000), (req, res) => {
  const row = db.prepare('SELECT * FROM orders WHERE number = ?').get(String(req.params.number).toUpperCase());
  // Same answer for a wrong number and a wrong phone, so order numbers cannot be probed.
  if (!row || row.phone !== normPhone(req.query.phone)) return res.status(404).json({ error: 'not_found' });
  res.json({ order: loadOrder(row) });
});

export function adminOrders(status) {
  const rows = status && STATUSES.includes(status)
    ? db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY id DESC LIMIT 200').all(status)
    : db.prepare('SELECT * FROM orders ORDER BY id DESC LIMIT 200').all();
  return rows.map((r) => ({ id: r.id, ...loadOrder(r) }));
}

export function adminSetStatus(id, status) {
  if (!STATUSES.includes(status)) throw fail(400, 'bad_status');
  return tx(() => {
    const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!row) throw fail(404, 'not_found');
    if (row.status === 'cancelled') throw fail(409, 'order_cancelled');
    if (status === 'cancelled') {
      for (const it of db.prepare('SELECT module, product_id, qty FROM order_items WHERE order_id = ?').all(id)) byKey[it.module]?.returnStock(it.product_id, it.qty);
    }
    db.prepare("UPDATE orders SET status = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?").run(status, id);
    return loadOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(id));
  });
}

export function adminSummary() {
  const o = db.prepare("SELECT COUNT(*) AS orders, COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total END),0) AS revenue, SUM(status = 'placed') AS new_orders FROM orders").get();
  return { orders: o.orders, new_orders: o.new_orders ?? 0, revenue: o.revenue };
}
