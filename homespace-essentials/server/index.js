import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODULES, byKey } from './modules/index.js';
import { router as ordersRouter, CONFIG } from './orders.js';
import { router as adminRouter, ADMIN_TOKEN, ADMIN_TOKEN_IS_GENERATED } from './admin.js';
import { artSvg, sceneSvg, ART_TYPES } from './art.js';

const here = dirname(fileURLToPath(import.meta.url));
const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use((_req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'SAMEORIGIN',
    'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'"
  });
  next();
});
app.use(express.json({ limit: '50kb' }));

// ---- illustrations
app.get('/art/scene.svg', (_req, res) => res.type('image/svg+xml').set('Cache-Control', 'public, max-age=86400').send(sceneSvg()));
app.get('/art/:file', (req, res) => {
  const m = /^([a-z]+)\.svg$/.exec(req.params.file);
  if (!m || !ART_TYPES.includes(m[1])) return res.status(404).end();
  res.type('image/svg+xml').set('Cache-Control', 'public, max-age=86400').send(artSvg(m[1], req.query.c, req.query.a));
});

// ---- API: one router per department, plus a few cross-department routes
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/modules', (_req, res) => res.json({ modules: MODULES.map((m) => m.meta()), config: CONFIG }));
for (const m of MODULES) app.use(`/api/${m.key}`, m.router);

app.get('/api/products', (req, res) => {
  const cat = String(req.query.cat ?? 'all');
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 24, 100);
  const num = (v) => (v === undefined || v === '' ? undefined : Number(v));
  const params = { q: req.query.q, min: num(req.query.min), max: num(req.query.max), room: req.query.room, in_stock: req.query.in_stock === '1', featured: req.query.featured === '1', sort: req.query.sort };
  const targets = cat === 'all' ? MODULES : byKey[cat] ? [byKey[cat]] : null;
  if (!targets) return res.status(404).json({ error: 'unknown_category' });
  const base = targets.flatMap((m) => m.list({ ...params, room: undefined, limit: 100 }).items);
  const sorters = {
    price_asc: (a, b) => a.price - b.price, price_desc: (a, b) => b.price - a.price,
    discount: (a, b) => b.discount - a.discount, popular: (a, b) => Number(b.featured) - Number(a.featured)
  };
  base.sort(sorters[params.sort] ?? sorters.popular);
  const rooms = {};
  for (const p of base) rooms[p.room] = (rooms[p.room] ?? 0) + 1;
  const all = params.room ? base.filter((p) => p.room === params.room) : base;
  res.json({ cat, page, limit, total: all.length, items: all.slice((page - 1) * limit, page * limit), rooms });
});

app.use('/api', ordersRouter);
app.use('/api/admin', adminRouter);
app.use('/api', (_req, res) => res.status(404).json({ error: 'not_found' }));

// ---- site
app.use(express.static(resolve(here, '..', 'public'), { extensions: ['html'], maxAge: '1h' }));
app.use((_req, res) => res.status(404).sendFile(resolve(here, '..', 'public', '404.html')));

app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'bad_json' });
  console.error(err);
  res.status(500).json({ error: 'server_error' });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Homespace Essentials running on http://localhost:${port}`);
  if (ADMIN_TOKEN_IS_GENERATED) console.log(`Admin token for this run (set ADMIN_TOKEN to fix it): ${ADMIN_TOKEN}`);
});
