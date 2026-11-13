# Homespace Essentials

An online store for electronics, furniture, vessels and cooking products. Visitors browse, add to a cart,
place a cash-on-delivery order and track it. The shop owner manages orders, prices and stock at `/admin`.

## Run it

```bash
npm install
ADMIN_TOKEN=pick-a-long-secret npm start     # http://localhost:3000
```

Needs Node 22.13 or newer (it uses the built-in `node:sqlite`). The first start creates `data/store.db` and fills it
with sample products.

## Structure

| Path | What it holds |
| --- | --- |
| `server/modules/electronics.js` `furniture.js` `vessels.js` `cooking.js` | One module per department: its own table, its own fields (warranty, material, capacity...), its sample products and its routes `/api/<department>` |
| `server/modules/_factory.js` | The shared module code (listing, filters, stock) |
| `server/orders.js` | Cart pricing, checkout, order tracking. Prices always come from the database, never from the browser |
| `server/admin.js` | Admin API, protected by the `x-admin-token` header |
| `server/art.js` | Placeholder product illustrations, drawn as SVG |
| `public/` | The website: landing page, shop, product, cart, checkout, order tracking, admin |

## Before you go live

1. **Replace the sample data.** Products, prices, stock and brands are placeholders. Edit them in `/admin` (price, MRP,
   stock, featured, visible) or in the module files for a larger catalogue. Delete `data/store.db` to reseed after editing a module file.
2. **Add real photographs.** Each product has an `image_url` column. Put photographs in `public/uploads/` and set the
   column to `/uploads/<file>`. Without one, the illustration is shown.
3. **Set `ADMIN_TOKEN`.** Without it the server makes a new random token each start and prints it in the log.
4. **Add your business details** (address, phone, email, GST number) to the footer in `public/js/app.js`.
5. **Payments.** Only cash on delivery is on. Online payment is listed as "not available yet" in `server/orders.js`
   and needs a payment provider (Razorpay, Cashfree, Stripe) before it can be switched on.
6. **Ratings** are hidden until a product has real ones. There is no review form yet.

## Hosting

The app is one Node process with a SQLite file, so it needs **a persistent disk**. Free tiers that wipe the disk on
every deploy will lose your orders.

- **Render, Railway or Fly.io:** deploy from the included `Dockerfile`, attach a volume at `/data`, set `ADMIN_TOKEN`.
- **A VPS:** `npm ci --omit=dev`, run `npm start` under `systemd` or `pm2`, put Nginx or Caddy in front for HTTPS.

Always serve it over HTTPS.

## Settings

`ADMIN_TOKEN`, `PORT`, `DB_PATH`, `FREE_SHIPPING_OVER` (default 2000), `SHIPPING_FEE` (default 99). See `.env.example`.
