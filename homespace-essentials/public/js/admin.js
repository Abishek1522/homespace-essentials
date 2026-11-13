import { $, $$, api, esc, money } from './app.js';

const root = $('#admin');
let token = (() => { try { return sessionStorage.getItem('hs-admin') ?? ''; } catch { return ''; } })();
let summary = null;
let tab = 'orders';

const call = (path, opts = {}) => api(`/api/admin${path}`, { ...opts, headers: { 'x-admin-token': token } });

function login(error = '') {
  root.innerHTML = `<form class="card" id="login" style="max-width:460px"><h2>Shop admin</h2>
    <p class="muted">Enter the admin token set on the server.</p>
    ${error ? `<p class="alert" role="alert">${esc(error)}</p>` : ''}
    <div class="field"><label for="t">Admin token</label><input class="input" id="t" type="password" autocomplete="current-password" required></div>
    <button class="btn" type="submit">Sign in</button></form>`;
  $('#login').addEventListener('submit', async (e) => {
    e.preventDefault();
    token = $('#t').value.trim();
    await boot();
  });
}

async function boot() {
  try {
    summary = await call('/summary');
    try { sessionStorage.setItem('hs-admin', token); } catch { /* ignore */ }
    paint();
  } catch (e) {
    try { sessionStorage.removeItem('hs-admin'); } catch { /* ignore */ }
    token = '';
    login(e.status === 401 ? 'That token is not correct.' : 'The server could not be reached.');
  }
}

function paint() {
  root.innerHTML = `
    <div class="stats"><div class="stat"><span class="muted">Orders</span><b>${summary.orders}</b></div><div class="stat"><span class="muted">New orders</span><b>${summary.new_orders}</b></div><div class="stat"><span class="muted">Revenue, excluding cancelled</span><b>${money(summary.revenue)}</b></div></div>
    <div class="admin-bar"><div class="tabs" style="margin:0">${[['orders', 'Orders'], ...summary.modules.map((m) => [m.key, m.label])].map(([k, l]) => `<button class="tab" type="button" data-tab="${k}" aria-current="${tab === k}">${esc(l)}</button>`).join('')}</div><button class="btn btn--ghost btn--sm" type="button" id="out" style="margin-left:auto">Sign out</button></div>
    <div id="pane" aria-live="polite"></div>`;
  $('#out').addEventListener('click', () => { try { sessionStorage.removeItem('hs-admin'); } catch { /* ignore */ } token = ''; login(); });
  $$('[data-tab]').forEach((b) => b.addEventListener('click', () => { tab = b.dataset.tab; paint(); }));
  (tab === 'orders' ? orders : products)();
}

async function orders() {
  const pane = $('#pane');
  pane.textContent = 'Loading orders…';
  const { orders: list } = await call('/orders');
  if (!list.length) { pane.innerHTML = '<div class="empty"><p>No orders yet.</p></div>'; return; }
  pane.innerHTML = list.map((o) => `<article class="order-card" data-id="${o.number}">
    <header><div><strong>${esc(o.number)}</strong> <span class="muted">${new Date(o.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span></div><strong>${money(o.total)}</strong></header>
    <div>${esc(o.name)} · ${esc(o.phone)}${o.email ? ` · ${esc(o.email)}` : ''}<br><span class="muted">${esc(o.address)}, ${esc(o.city)}, ${esc(o.state)} ${esc(o.pincode)}</span></div>
    <ul style="margin:0;padding-left:18px">${o.items.map((i) => `<li>${esc(i.name)} × ${i.qty} <span class="muted">(${money(i.line_total)})</span></li>`).join('')}</ul>
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><label class="sr" for="st-${esc(o.number)}">Status</label>
      <select class="select" id="st-${esc(o.number)}" style="width:auto" ${o.status === 'cancelled' ? 'disabled' : ''}>${summary.statuses.map((s) => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}</select>
      <button class="btn btn--sm" type="button" data-save="${esc(o.number)}" ${o.status === 'cancelled' ? 'disabled' : ''}>Update</button><span class="muted" data-msg></span></div>
  </article>`).join('');
  const byNumber = Object.fromEntries(list.map((o) => [o.number, o]));
  $$('[data-save]').forEach((b) => b.addEventListener('click', async () => {
    const card = b.closest('.order-card');
    const status = $('select', card).value;
    const msg = $('[data-msg]', card);
    if (status === 'cancelled' && !confirm('Cancel this order? Stock will be returned.')) return;
    try {
      await call(`/orders/${byNumber[b.dataset.save].id}`, { method: 'PATCH', body: { status } });
      msg.textContent = 'Updated';
      if (status === 'cancelled') { summary = await call('/summary'); paint(); }
    } catch (e) { msg.textContent = 'Could not update'; }
  }));
}

async function products() {
  const pane = $('#pane');
  pane.textContent = 'Loading products…';
  const { products: list } = await call(`/products/${tab}`);
  pane.innerHTML = `<div class="table-scroll"><table class="tbl"><thead><tr><th>Product</th><th>Price</th><th>MRP</th><th>Stock</th><th>Featured</th><th>Visible</th><th></th></tr></thead><tbody>${list.map((p) => `<tr data-id="${p.id}">
    <td><strong>${esc(p.name)}</strong><br><span class="muted">${esc(p.brand)}</span></td>
    <td><input type="number" min="0" name="price" value="${p.price}" aria-label="Price for ${esc(p.name)}"></td>
    <td><input type="number" min="0" name="mrp" value="${p.mrp}" aria-label="MRP for ${esc(p.name)}"></td>
    <td><input type="number" min="0" name="stock" value="${p.stock}" aria-label="Stock for ${esc(p.name)}"></td>
    <td><input type="checkbox" name="featured" ${p.featured ? 'checked' : ''} aria-label="Featured: ${esc(p.name)}"></td>
    <td><input type="checkbox" name="active" ${p.active ? 'checked' : ''} aria-label="Visible: ${esc(p.name)}"></td>
    <td><button class="btn btn--sm" type="button" data-save>Save</button> <span class="muted" data-msg></span></td></tr>`).join('')}</tbody></table></div>`;
  $$('[data-save]').forEach((b) => b.addEventListener('click', async () => {
    const tr = b.closest('tr');
    const msg = $('[data-msg]', tr);
    const g = (n) => $(`[name=${n}]`, tr);
    try {
      await call(`/products/${tab}/${tr.dataset.id}`, { method: 'PATCH', body: { price: Number(g('price').value), mrp: Number(g('mrp').value), stock: Number(g('stock').value), featured: g('featured').checked, active: g('active').checked } });
      msg.textContent = 'Saved';
    } catch { msg.textContent = 'Check the values'; }
  }));
}

if (token) await boot(); else login();
