import { $, api, esc, money, mountChrome, icons } from './app.js';

mountChrome('track');
const root = $('#order');
const qs = new URLSearchParams(location.search);
const FLOW = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];
const LABEL = { placed: 'Order placed', confirmed: 'Confirmed', packed: 'Packed', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };

const saved = (() => { try { return JSON.parse(sessionStorage.getItem('hs-last') ?? 'null'); } catch { return null; } })();
const number = (qs.get('n') ?? '').toUpperCase().slice(0, 20);

function lookupForm(error = '', keepN = number, keepP = '') {
  document.title = 'Track an order | Homespace Essentials';
  root.innerHTML = `<form class="card" id="lookup" style="max-width:520px" novalidate>
    <h2>Track an order</h2>
    <p class="muted">Enter the order number from your confirmation and the mobile number you used.</p>
    ${error ? `<p class="alert" role="alert">${esc(error)}</p>` : ''}
    <div class="field"><label for="n">Order number</label><input class="input" id="n" name="n" value="${esc(keepN)}" placeholder="HS261111-1234" autocomplete="off" required></div>
    <div class="field"><label for="p">Mobile number</label><input class="input" id="p" name="p" type="tel" inputmode="tel" autocomplete="tel" value="${esc(keepP)}" required></div>
    <button class="btn" type="submit">Track order</button>
  </form>`;
  $('#lookup').addEventListener('submit', (e) => {
    e.preventDefault();
    const n = $('#n').value.trim().toUpperCase();
    const p = $('#p').value.trim();
    if (!n || !p) return lookupForm('Enter both the order number and the mobile number.', n, p);
    load(n, p);
  });
}

async function load(n, phone) {
  root.setAttribute('aria-busy', 'true');
  try {
    const { order } = await api(`/api/orders/${encodeURIComponent(n)}?phone=${encodeURIComponent(phone)}`);
    try { sessionStorage.setItem('hs-last', JSON.stringify({ number: order.number, phone })); } catch { /* ignore */ }
    show(order);
  } catch (e) {
    lookupForm(e.status === 404 ? 'We could not find an order with that number and mobile number.' : e.status === 429 ? 'Too many attempts. Please wait a few minutes.' : 'Something went wrong. Please try again.', n, phone);
  } finally {
    root.removeAttribute('aria-busy');
  }
}

function show(o) {
  document.title = `Order ${o.number} | Homespace Essentials`;
  const placed = qs.get('placed') === '1';
  const idx = FLOW.indexOf(o.status);
  root.innerHTML = `
    <div style="display:grid;gap:24px;max-width:860px">
      ${placed ? `<div class="done">${icons.done}<div><h1 style="font-size:clamp(28px,3.4vw,44px)">Thank you, ${esc(o.name.split(' ')[0])}</h1><p class="muted">Your order is placed. Keep your order number and mobile number to track it.</p></div></div>` : `<h1 style="font-size:clamp(28px,3.4vw,44px)">Order ${esc(o.number)}</h1>`}
      <div class="card">
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px"><div><span class="label">Order number</span><div style="font-family:var(--font-display);font-size:30px">${esc(o.number)}</div></div><div style="text-align:right"><span class="label">Status</span><div style="font-weight:700;font-size:20px">${esc(LABEL[o.status] ?? o.status)}</div></div></div>
        ${o.status === 'cancelled' ? '<p class="alert">This order was cancelled.</p>' : `<ol class="timeline" aria-label="Order progress">${FLOW.map((s, i) => `<li class="${i <= idx ? 'is-done' : ''}"${i === idx ? ' aria-current="step"' : ''}>${LABEL[s]}</li>`).join('')}</ol>`}
      </div>
      <div class="card"><h2>Items</h2><div class="lines">${o.items.map((i) => `<div class="line" style="grid-template-columns:88px 1fr auto"><div class="line__img"><img src="${esc(i.image ?? '')}" alt="" width="88" height="66"></div><div><a class="line__name" href="/product?m=${encodeURIComponent(i.module)}&s=${encodeURIComponent(i.slug)}">${esc(i.name)}</a><div class="muted" style="font-size:14px">${money(i.price)} × ${i.qty}</div></div><div class="line__total">${money(i.line_total)}</div></div>`).join('')}</div>
        <dl class="summary" style="position:static;padding:0;background:none"><dl><div><dt>Subtotal</dt><dd>${money(o.subtotal)}</dd></div><div><dt>Delivery</dt><dd>${o.shipping ? money(o.shipping) : 'Free'}</dd></div><div class="total"><dt>Total, pay on delivery</dt><dd>${money(o.total)}</dd></div></dl></dl>
      </div>
      <div class="card"><h2>Delivery</h2><dl class="kv"><dt>Name</dt><dd>${esc(o.name)}</dd><dt>Mobile</dt><dd>${esc(o.phone)}</dd><dt>Address</dt><dd>${esc(o.address)}, ${esc(o.city)}, ${esc(o.state)} ${esc(o.pincode)}</dd><dt>Payment</dt><dd>${o.payment === 'cod' ? 'Cash on delivery' : esc(o.payment)}</dd><dt>Placed on</dt><dd>${new Date(o.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</dd></dl></div>
      <div><a class="btn btn--ghost" href="/shop">Continue shopping</a></div>
    </div>`;
}

if (number && saved?.number === number && saved.phone) await load(number, saved.phone);
else lookupForm();
