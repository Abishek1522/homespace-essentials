import { $, api, esc, money, mountChrome, cart, failMessage } from './app.js';

mountChrome('');
const root = $('#cart');
let config = { freeShippingOver: 2000, shippingFee: 99 };
let notice = '';

const productHref = (l) => `/product?m=${encodeURIComponent(l.module)}&s=${encodeURIComponent(l.slug)}`;

async function render() {
  const items = cart.read();
  if (!items.length) {
    root.innerHTML = `<div class="empty" style="grid-column:1/-1"><h2>Your cart is empty</h2><p class="muted">Add something from any of the four departments.</p><a class="btn" href="/shop">Start shopping</a></div>`;
    return;
  }
  let priced;
  try {
    [priced, config] = await Promise.all([api('/api/cart/price', { method: 'POST', body: { items } }), api('/api/config')]);
  } catch (e) {
    console.error(e);
    return failMessage(root, 'Your cart could not be loaded.');
  }

  // A product that no longer exists is removed from the cart.
  const gone = priced.lines.filter((l) => l.reason === 'not_found');
  if (gone.length) {
    for (const g of gone) cart.remove(g.module, g.slug);
    notice = 'An item that is no longer sold was removed from your cart.';
    return render();
  }

  const n = priced.lines.reduce((s, l) => s + l.qty, 0);
  const left = Math.max(0, config.freeShippingOver - priced.subtotal);
  const pct = Math.min(100, Math.round((priced.subtotal / config.freeShippingOver) * 100));

  root.innerHTML = `
    <div>
      ${notice ? `<p class="notice" role="status" style="margin-bottom:12px">${esc(notice)}</p>` : ''}
      <div class="lines">${priced.lines.map((l) => `
        <div class="line${l.unavailable ? ' line--bad' : ''}">
          <a class="line__img" href="${productHref(l)}" tabindex="-1" aria-hidden="true"><img src="${esc(l.image)}" alt="" width="112" height="84"></a>
          <div>
            <a class="line__name" href="${productHref(l)}">${esc(l.name)}</a>
            <div class="muted" style="font-size:14px">${esc(l.brand)} · ${money(l.price)} each</div>
            ${l.unavailable ? `<div class="line__warn" role="alert">${l.reason === 'out_of_stock' ? 'Out of stock. Remove it to continue.' : `Only ${l.stock} left. Reduce the quantity to continue.`}</div>` : ''}
            <div class="line__ctl">
              <div class="stepper" role="group" aria-label="Quantity for ${esc(l.name)}">
                <button type="button" data-dec data-m="${esc(l.module)}" data-s="${esc(l.slug)}" data-q="${l.qty}" aria-label="Decrease quantity" ${l.qty <= 1 ? 'disabled' : ''}>−</button>
                <output>${l.qty}</output>
                <button type="button" data-inc data-m="${esc(l.module)}" data-s="${esc(l.slug)}" data-q="${l.qty}" aria-label="Increase quantity" ${l.qty >= Math.min(10, l.stock) ? 'disabled' : ''}>+</button>
              </div>
              <button class="linkbtn" type="button" data-rm data-m="${esc(l.module)}" data-s="${esc(l.slug)}">Remove</button>
            </div>
          </div>
          <div class="line__total">${money(l.line_total)}</div>
        </div>`).join('')}</div>
    </div>
    <aside class="summary" aria-label="Order summary">
      <h2 style="font-size:24px">Order summary</h2>
      ${priced.shipping > 0 ? `<div><p style="font-size:15px">Add <strong>${money(left)}</strong> more for free delivery.</p><div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Progress to free delivery"><i style="width:${pct}%"></i></div></div>` : '<p class="notice" style="font-size:15px">Your order qualifies for free delivery.</p>'}
      <dl>
        <div><dt>Subtotal (${n} ${n === 1 ? 'item' : 'items'})</dt><dd>${money(priced.subtotal)}</dd></div>
        <div><dt>Delivery</dt><dd>${priced.shipping ? money(priced.shipping) : 'Free'}</dd></div>
        <div class="total"><dt>Total</dt><dd>${money(priced.total)}</dd></div>
      </dl>
      <a class="btn btn--block" href="/checkout" ${priced.blocked ? 'aria-disabled="true" tabindex="-1"' : ''}>Go to checkout</a>
      <p class="muted" style="font-size:14px">Pay in cash when your order arrives.</p>
      <a class="link-arrow" href="/shop">Keep shopping</a>
    </aside>`;
  notice = '';
}

root.addEventListener('click', async (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  const { m, s, q } = b.dataset;
  if (b.hasAttribute('data-inc')) cart.setQty(m, s, Number(q) + 1);
  else if (b.hasAttribute('data-dec')) cart.setQty(m, s, Number(q) - 1);
  else if (b.hasAttribute('data-rm')) cart.remove(m, s);
  else return;
  await render();
});

await render();
