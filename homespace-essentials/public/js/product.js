import { $, api, esc, money, mountChrome, productCard, priceBlock, ratingLine, cart, toast, icons, failMessage, DEPT_LABEL } from './app.js';

const qs = new URLSearchParams(location.search);
const m = qs.get('m') ?? '';
const s = qs.get('s') ?? '';
mountChrome(m);

const root = $('#pdp');

function fmt(attr, v) {
  if (attr.type === 'bool') return v ? 'Yes' : 'No';
  if (attr.name.endsWith('_months')) return v === 0 ? 'No warranty' : `${v} months`;
  if (attr.name.endsWith('_kg')) return `${v} kg`;
  return v == null || v === '' ? 'Not listed' : String(v);
}

function stockLine(p) {
  if (p.stock === 0) return '<span class="stock stock--out">Out of stock</span>';
  if (p.stock <= 5) return `<span class="stock stock--low">Only ${p.stock} left</span>`;
  return '<span class="stock">In stock</span>';
}

async function show() {
  if (!/^[a-z]+$/.test(m) || !/^[a-z0-9-]+$/.test(s)) return notFound();
  let data, config;
  try {
    [data, config] = await Promise.all([api(`/api/${m}/${encodeURIComponent(s)}`), api('/api/config')]);
  } catch (e) {
    if (e.status === 404) return notFound();
    console.error(e);
    return failMessage(root, 'This product could not be loaded.');
  }
  const { product: p, related, meta } = data;
  document.title = `${p.name} | Homespace Essentials`;
  $('meta[name=description]')?.setAttribute('content', p.description);

  $('#crumbs').innerHTML = `<a href="/">Home</a><span>/</span><a href="/shop?cat=${esc(m)}">${esc(DEPT_LABEL[m] ?? meta.label)}</a><span>/</span><span aria-current="page">${esc(p.name)}</span>`;

  const rows = [['Brand', p.brand], ...meta.attrs.map((a) => [a.label, fmt(a, p.attrs[a.name])]), ['Best for', p.room.charAt(0).toUpperCase() + p.room.slice(1)]];
  const maxQty = Math.max(1, Math.min(10, p.stock));

  root.innerHTML = `
    <div class="pdp__gallery"><img src="${esc(p.image)}" alt="${esc(p.name)}" width="800" height="600"></div>
    <div class="pdp__info">
      <span class="label">${esc(p.brand)}</span>
      <h1>${esc(p.name)}</h1>
      ${ratingLine(p)}
      <div class="pdp__price">${priceBlock(p)}</div>
      <p class="muted" style="font-size:14px">Price includes GST. ${p.price >= config.freeShippingOver ? 'Free delivery on this item.' : `Free delivery on orders over ${money(config.freeShippingOver)}.`}</p>
      ${stockLine(p)}
      <p>${esc(p.description)}</p>
      <div class="pdp__buy">
        <div class="stepper" role="group" aria-label="Quantity">
          <button type="button" id="dec" aria-label="Decrease quantity">−</button><output id="qty" aria-live="polite">1</output><button type="button" id="inc" aria-label="Increase quantity">+</button>
        </div>
        <button class="btn" type="button" id="add" ${p.in_stock ? '' : 'disabled'}>${p.in_stock ? 'Add to cart' : 'Out of stock'}</button>
        ${p.in_stock ? '<button class="btn btn--ghost" type="button" id="buy">Buy now</button>' : ''}
      </div>
      <div class="box"><strong>Why you will like it</strong><ul class="ticks">${p.features.map((f) => `<li>${icons.tick}<span>${esc(f)}</span></li>`).join('')}</ul></div>
      <div class="box"><strong>Specifications</strong><table class="specs"><tbody>${rows.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table></div>
      <div class="box"><strong>Delivery and payment</strong><ul class="ticks"><li>${icons.tick}<span>Pay in cash when the order arrives</span></li><li>${icons.tick}<span>Track the order with your order number and phone number</span></li></ul></div>
    </div>`;

  let qty = 1;
  const out = $('#qty');
  const paint = () => { out.textContent = qty; $('#dec').disabled = qty <= 1; $('#inc').disabled = qty >= maxQty; };
  $('#dec').addEventListener('click', () => { qty = Math.max(1, qty - 1); paint(); });
  $('#inc').addEventListener('click', () => { qty = Math.min(maxQty, qty + 1); paint(); });
  paint();
  $('#add')?.addEventListener('click', () => { cart.add(m, p.slug, qty); toast(`<span>Added ${qty} × ${esc(p.name)}</span><a href="/cart">View cart</a>`); });
  $('#buy')?.addEventListener('click', () => { cart.add(m, p.slug, qty); location.href = '/checkout'; });

  if (related.length) {
    $('#related-wrap').hidden = false;
    $('#related').innerHTML = related.map(productCard).join('');
  }
}

function notFound() {
  document.title = 'Product not found | Homespace Essentials';
  root.innerHTML = '<div class="empty" style="grid-column:1/-1"><h1>Product not found</h1><p class="muted">This product may have been removed.</p><a class="btn" href="/shop">Browse all products</a></div>';
}

await show();
