import { $, $$, api, esc, mountChrome, productCard, failMessage, DEPT_ORDER, DEPT_LABEL } from './app.js';

const qs = new URLSearchParams(location.search);
const state = {
  cat: DEPT_ORDER.includes(qs.get('cat')) ? qs.get('cat') : 'all',
  q: (qs.get('q') ?? '').slice(0, 60), room: qs.get('room') ?? '', min: qs.get('min') ?? '', max: qs.get('max') ?? '',
  sort: ['popular', 'price_asc', 'price_desc', 'discount'].includes(qs.get('sort')) ? qs.get('sort') : 'popular',
  in_stock: qs.get('in_stock') === '1', page: 1
};
const LIMIT = 12;

mountChrome(state.cat === 'all' ? '' : state.cat);

// Filters stay open on desktop and start closed on a phone.
$('#fbox').open = matchMedia('(min-width: 961px)').matches;

const grid = $('#grid');
const count = $('#count');
const heading = $('#heading');
const blurb = $('#blurb');
const more = $('#more');
let blurbs = {};

function renderTabs() {
  $('#tabs').innerHTML = ['all', ...DEPT_ORDER].map((k) =>
    `<button class="tab" type="button" data-cat="${k}" aria-current="${state.cat === k}">${k === 'all' ? 'All products' : DEPT_LABEL[k]}</button>`).join('');
}

function syncForm() {
  $('#min').value = state.min; $('#max').value = state.max; $('#in_stock').checked = state.in_stock; $('#sort').value = state.sort;
}

function query(page) {
  const p = new URLSearchParams({ cat: state.cat, sort: state.sort, page, limit: LIMIT });
  for (const k of ['q', 'room', 'min', 'max']) if (state[k]) p.set(k, state[k]);
  if (state.in_stock) p.set('in_stock', '1');
  return p;
}

function pushUrl() {
  const p = new URLSearchParams();
  if (state.cat !== 'all') p.set('cat', state.cat);
  for (const k of ['q', 'room', 'min', 'max']) if (state[k]) p.set(k, state[k]);
  if (state.sort !== 'popular') p.set('sort', state.sort);
  if (state.in_stock) p.set('in_stock', '1');
  history.replaceState(null, '', p.toString() ? `/shop?${p}` : '/shop');
}

function paintHeading() {
  const name = state.cat === 'all' ? 'All products' : DEPT_LABEL[state.cat];
  heading.textContent = state.q ? `Results for “${state.q}”` : name;
  blurb.textContent = state.q ? `Searching ${state.cat === 'all' ? 'every department' : name}.` : (state.cat === 'all' ? 'Electronics, furniture, vessels and cooking products in one place.' : blurbs[state.cat] ?? '');
  document.title = `${state.q ? `${state.q}: search` : name} | Homespace Essentials`;
  $('#crumb-current').textContent = name;
}

async function load(append = false) {
  if (!append) state.page = 1;
  more.hidden = true;
  if (!append) grid.setAttribute('aria-busy', 'true');
  try {
    const data = await api(`/api/products?${query(state.page)}`);
    if (!append) {
      grid.innerHTML = '';
      const rooms = Object.entries(data.rooms).sort((a, b) => b[1] - a[1]);
      $('#rooms').innerHTML = rooms.map(([r, n]) => `<button class="chip" type="button" data-room="${esc(r)}" aria-pressed="${state.room === r}">${esc(r)} (${n})</button>`).join('') || '<span class="muted">No rooms</span>';
    }
    if (!data.total) {
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><h2>Nothing matches</h2><p class="muted">Try a different search or clear the filters.</p><button class="btn" type="button" id="clear">Clear filters</button></div>`;
    } else {
      grid.insertAdjacentHTML('beforeend', data.items.map(productCard).join(''));
    }
    const shown = grid.querySelectorAll('.pcard').length;
    count.textContent = data.total ? `Showing ${shown} of ${data.total} ${data.total === 1 ? 'product' : 'products'}` : '0 products';
    more.hidden = shown >= data.total;
  } catch (e) {
    console.error(e);
    failMessage(grid, 'Products could not be loaded.');
  } finally {
    grid.removeAttribute('aria-busy');
  }
  pushUrl();
}

function reset() {
  Object.assign(state, { q: '', room: '', min: '', max: '', in_stock: false, sort: 'popular' });
  syncForm();
  paintHeading();
  load();
}

$('#tabs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-cat]');
  if (!b) return;
  Object.assign(state, { cat: b.dataset.cat, room: '' });
  renderTabs(); paintHeading(); load();
  mountActive();
});
$('#rooms').addEventListener('click', (e) => {
  const b = e.target.closest('[data-room]');
  if (!b) return;
  state.room = state.room === b.dataset.room ? '' : b.dataset.room;
  load();
});
$('#filters').addEventListener('change', () => {
  const clean = (v) => (v === '' || !Number.isFinite(Number(v)) || Number(v) < 0 ? '' : String(Math.floor(Number(v))));
  state.min = clean($('#min').value); state.max = clean($('#max').value); state.in_stock = $('#in_stock').checked;
  load();
});
$('#filters').addEventListener('submit', (e) => e.preventDefault());
$('#sort').addEventListener('change', () => { state.sort = $('#sort').value; load(); });
more.addEventListener('click', () => { state.page += 1; load(true); });
document.addEventListener('click', (e) => { if (e.target.id === 'clear' || e.target.id === 'reset') reset(); });

function mountActive() {
  for (const a of $$('.nav a')) {
    if (a.getAttribute('href') === `/shop?cat=${state.cat}`) a.setAttribute('aria-current', 'page'); else if (a.getAttribute('href')?.startsWith('/shop?cat=')) a.removeAttribute('aria-current');
  }
}

try {
  const mods = await api('/api/modules');
  blurbs = Object.fromEntries(mods.modules.map((m) => [m.key, m.blurb]));
} catch { /* the blurb is optional */ }
renderTabs(); syncForm(); paintHeading(); await load();
