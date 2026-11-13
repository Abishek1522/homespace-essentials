import { Router } from 'express';
import { timingSafeEqual, randomBytes } from 'node:crypto';
import { byKey, MODULES } from './modules/index.js';
import { adminOrders, adminSetStatus, adminSummary, STATUSES } from './orders.js';

export const ADMIN_TOKEN = process.env.ADMIN_TOKEN || randomBytes(12).toString('hex');
export const ADMIN_TOKEN_IS_GENERATED = !process.env.ADMIN_TOKEN;

const safeEq = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

export const router = Router();

router.use((req, res, next) => {
  if (!safeEq(req.get('x-admin-token') ?? '', ADMIN_TOKEN)) return res.status(401).json({ error: 'unauthorized' });
  next();
});

router.get('/summary', (_req, res) => res.json({ ...adminSummary(), statuses: STATUSES, modules: MODULES.map((m) => ({ key: m.key, label: m.label })) }));
router.get('/orders', (req, res) => res.json({ orders: adminOrders(String(req.query.status ?? '')) }));
router.patch('/orders/:id', (req, res) => {
  try { res.json({ order: adminSetStatus(Number(req.params.id), req.body?.status) }); }
  catch (e) { res.status(e.status ?? 500).json({ error: e.error ?? 'server_error' }); }
});
router.get('/products/:module', (req, res) => {
  const m = byKey[req.params.module];
  if (!m) return res.status(404).json({ error: 'unknown_module' });
  res.json({ products: m.adminList(), meta: m.meta() });
});
router.patch('/products/:module/:id', (req, res) => {
  const m = byKey[req.params.module];
  if (!m) return res.status(404).json({ error: 'unknown_module' });
  try { res.json({ product: m.adminUpdate(Number(req.params.id), req.body ?? {}) }); }
  catch (e) { res.status(e.code === 'not_found' ? 404 : e.code === 'bad_input' ? 400 : 500).json({ error: e.message }); }
});
