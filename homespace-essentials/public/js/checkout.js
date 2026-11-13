import { $, $$, api, esc, money, mountChrome, cart, failMessage } from './app.js';

mountChrome('');
const root = $('#checkout');

const FIELDS = ['name', 'phone', 'email', 'address', 'city', 'state', 'pincode'];

function showErrors(fields) {
  let first = null;
  for (const f of FIELDS) {
    const input = $(`#f-${f}`);
    const err = $(`#e-${f}`);
    const msg = fields?.[f];
    err.textContent = msg ?? '';
    if (msg) { input.setAttribute('aria-invalid', 'true'); first ??= input; } else input.removeAttribute('aria-invalid');
  }
  first?.focus();
}

async function start() {
  const items = cart.read();
  if (!items.length) { location.replace('/cart'); return; }
  let priced, config;
  try {
    [priced, config] = await Promise.all([api('/api/cart/price', { method: 'POST', body: { items } }), api('/api/config')]);
  } catch (e) {
    console.error(e);
    return failMessage(root, 'Checkout could not be loaded.');
  }
  if (priced.blocked || priced.lines.some((l) => l.reason === 'not_found')) { location.replace('/cart'); return; }

  const f = (id, label, attrs = '', extra = '') => `<div class="field"><label for="f-${id}">${label}</label>${extra || `<input class="input" id="f-${id}" name="${id}" ${attrs} aria-describedby="e-${id}">`}<div class="error" id="e-${id}" role="alert"></div></div>`;

  root.innerHTML = `
    <form class="form" id="form" novalidate>
      <div class="card">
        <h2>Delivery details</h2>
        ${f('name', 'Full name', 'autocomplete="name" required')}
        <div class="row2">
          ${f('phone', 'Mobile number', 'type="tel" inputmode="tel" autocomplete="tel" required')}
          ${f('email', 'Email (optional)', 'type="email" autocomplete="email"')}
        </div>
        ${f('address', 'Address', '', '<textarea class="input" id="f-address" name="address" rows="3" autocomplete="street-address" required aria-describedby="e-address"></textarea>')}
        <div class="row2">
          ${f('city', 'City', 'autocomplete="address-level2" required')}
          ${f('state', 'State', 'autocomplete="address-level1" required list="states"')}
        </div>
        <div class="row2">${f('pincode', 'Pincode', 'inputmode="numeric" maxlength="6" autocomplete="postal-code" required')}<div></div></div>
        <datalist id="states">${['Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Telangana', 'Maharashtra', 'Gujarat', 'Delhi', 'Uttar Pradesh', 'West Bengal', 'Rajasthan', 'Madhya Pradesh', 'Punjab', 'Haryana', 'Bihar', 'Odisha', 'Assam', 'Puducherry'].map((s) => `<option value="${s}">`).join('')}</datalist>
      </div>
      <div class="card">
        <h2>Payment</h2>
        ${config.payments.map((p) => `<label class="pay${p.enabled ? '' : ' pay--off'}"><input type="radio" name="payment" value="${p.id}" ${p.id === 'cod' ? 'checked' : ''} ${p.enabled ? '' : 'disabled'}><span><strong>${esc(p.label)}</strong><br><span class="muted" style="font-size:15px">${p.enabled ? 'Pay in cash when your order arrives.' : esc(p.note ?? 'Not available')}</span></span></label>`).join('')}
      </div>
      <div id="form-error"></div>
      <button class="btn" type="submit" id="place">Place order · ${money(priced.total)}</button>
    </form>
    <aside class="summary" aria-label="Order summary">
      <h2 style="font-size:24px">Your order</h2>
      <div class="lines">${priced.lines.map((l) => `<div style="display:grid;grid-template-columns:56px 1fr auto;gap:12px;align-items:center"><div class="line__img"><img src="${esc(l.image)}" alt="" width="56" height="42"></div><div style="font-size:15px"><div style="font-weight:600;line-height:1.3">${esc(l.name)}</div><div class="muted">Qty ${l.qty}</div></div><strong>${money(l.line_total)}</strong></div>`).join('')}</div>
      <dl>
        <div><dt>Subtotal</dt><dd>${money(priced.subtotal)}</dd></div>
        <div><dt>Delivery</dt><dd>${priced.shipping ? money(priced.shipping) : 'Free'}</dd></div>
        <div class="total"><dt>Total to pay on delivery</dt><dd>${money(priced.total)}</dd></div>
      </dl>
      <a class="link-arrow" href="/cart">Edit cart</a>
    </aside>`;

  // Clear a field's error as soon as the customer edits it.
  $('#form').addEventListener('input', (e) => {
    const id = e.target.id?.replace(/^f-/, '');
    if (!FIELDS.includes(id)) return;
    $(`#e-${id}`).textContent = '';
    e.target.removeAttribute('aria-invalid');
  });

  $('#form').addEventListener('submit', async (e) => {
    e.preventDefault();
    showErrors(null);
    $('#form-error').innerHTML = '';
    const btn = $('#place');
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Placing your order…';
    const v = Object.fromEntries(FIELDS.map((k) => [k, $(`#f-${k}`).value]));
    try {
      const { order } = await api('/api/orders', { method: 'POST', body: { customer: v, payment: $('input[name=payment]:checked')?.value ?? 'cod', items: cart.read() } });
      try { sessionStorage.setItem('hs-last', JSON.stringify({ number: order.number, phone: order.phone })); } catch { /* ignore */ }
      cart.clear();
      location.href = `/order?n=${encodeURIComponent(order.number)}&placed=1`;
    } catch (err) {
      btn.disabled = false;
      btn.textContent = label;
      const box = $('#form-error');
      if (err.status === 422 && err.data?.fields) { showErrors(err.data.fields); box.innerHTML = '<p class="alert" role="alert">Please fix the highlighted fields.</p>'; }
      else if (err.status === 409) box.innerHTML = '<p class="alert" role="alert">Some items are no longer available in the quantity you chose. <a href="/cart">Review your cart</a>.</p>';
      else if (err.status === 429) box.innerHTML = '<p class="alert" role="alert">Too many attempts. Please wait a few minutes and try again.</p>';
      else box.innerHTML = '<p class="alert" role="alert">Your order could not be placed. Nothing was charged. Please try again.</p>';
    }
  });
}

await start();
