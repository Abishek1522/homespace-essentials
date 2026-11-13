// Product illustrations. Every product has an `art` type and a `tone` colour; /art/<type>.svg?c=<hex>&a=<hex>
// draws it. Each drawing sits on a 400x300 canvas. Swap in real photographs by setting a product's
// `image_url` (admin) or by dropping files into public/uploads and pointing image_url at them.

const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));

export function hex(v, fallback) {
  const s = String(v ?? '').replace('#', '');
  return /^[0-9a-fA-F]{6}$/.test(s) ? `#${s.toLowerCase()}` : fallback;
}

// mix toward white (amt > 0) or black (amt < 0)
export function shade(h, amt) {
  const n = parseInt(h.slice(1), 16);
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((x) => clamp(x + (t - x) * p));
  return '#' + ch.map((x) => x.toString(16).padStart(2, '0')).join('');
}

const INK = '#2a1d17';
const shadow = (cx = 200, rx = 120, y = 252) =>
  `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="9" fill="${INK}" opacity=".13"/>`;

const D = {
  // ---------- electronics ----------
  tv: (c, a) => `${shadow(200, 130)}
    <rect x="52" y="44" width="296" height="170" rx="9" fill="#1c1b1d"/>
    <rect x="59" y="51" width="282" height="156" rx="5" fill="${shade(c, 0.1)}"/>
    <circle cx="268" cy="96" r="19" fill="${shade(a, 0.55)}"/>
    <path d="M59 207V160l70-52 62 50 44-32 106 70v19z" fill="${shade(c, -0.25)}"/>
    <path d="M59 207v-20l92-58 70 56 45-30 75 52z" fill="${shade(c, -0.45)}"/>
    <path d="M170 214h60l12 30H158z" fill="#2b292c"/>
    <rect x="130" y="242" width="140" height="8" rx="4" fill="#1c1b1d"/>`,
  laptop: (c, a) => `${shadow(200, 150, 254)}
    <rect x="92" y="62" width="216" height="146" rx="10" fill="${shade(c, -0.35)}"/>
    <rect x="100" y="70" width="200" height="130" rx="4" fill="#f4f1ea"/>
    <rect x="100" y="70" width="200" height="16" fill="${shade(c, 0.15)}"/>
    <rect x="110" y="98" width="82" height="9" rx="4" fill="${a}"/>
    <rect x="110" y="114" width="120" height="6" rx="3" fill="#cfc8bb"/>
    <rect x="110" y="127" width="104" height="6" rx="3" fill="#cfc8bb"/>
    <rect x="212" y="98" width="78" height="86" rx="6" fill="${shade(c, 0.3)}"/>
    <path d="M62 214h276l-14 24H76z" fill="${c}"/>
    <rect x="164" y="214" width="72" height="7" rx="3.5" fill="${shade(c, -0.3)}"/>`,
  phone: (c, a) => `${shadow(200, 70)}
    <rect x="150" y="30" width="100" height="214" rx="22" fill="${c}"/>
    <rect x="156" y="36" width="88" height="202" rx="17" fill="#17171a"/>
    <rect x="160" y="44" width="80" height="186" rx="13" fill="${shade(a, 0.1)}"/>
    <path d="M160 230v-62l34-26 26 20 20-14v82z" fill="${shade(a, -0.3)}"/>
    <circle cx="214" cy="84" r="13" fill="${shade(a, 0.6)}"/>
    <rect x="186" y="49" width="28" height="7" rx="3.5" fill="#17171a"/>`,
  headphones: (c, a) => `${shadow(200, 110)}
    <path d="M96 168V136a104 104 0 0 1 208 0v32" fill="none" stroke="${shade(c, -0.3)}" stroke-width="18" stroke-linecap="round"/>
    <path d="M96 168V136a104 104 0 0 1 208 0v32" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/>
    <rect x="70" y="150" width="56" height="92" rx="26" fill="${shade(c, -0.15)}"/>
    <rect x="274" y="150" width="56" height="92" rx="26" fill="${shade(c, -0.15)}"/>
    <rect x="108" y="158" width="26" height="76" rx="13" fill="${a}"/>
    <rect x="266" y="158" width="26" height="76" rx="13" fill="${a}"/>
    <circle cx="98" cy="196" r="9" fill="${shade(c, 0.35)}"/><circle cx="302" cy="196" r="9" fill="${shade(c, 0.35)}"/>`,
  speaker: (c, a) => `${shadow(200, 92)}
    <rect x="138" y="52" width="124" height="190" rx="28" fill="${c}"/>
    <rect x="138" y="52" width="124" height="44" rx="22" fill="${shade(c, -0.2)}"/>
    <circle cx="200" cy="176" r="40" fill="${shade(c, -0.3)}"/>
    <circle cx="200" cy="176" r="28" fill="${shade(c, -0.5)}"/>
    <circle cx="200" cy="176" r="10" fill="${a}"/>
    <circle cx="170" cy="74" r="6" fill="${a}"/><circle cx="200" cy="74" r="6" fill="${shade(a, 0.5)}"/><circle cx="230" cy="74" r="6" fill="${shade(a, 0.5)}"/>
    <rect x="152" y="236" width="96" height="8" rx="4" fill="${INK}" opacity=".5"/>`,
  watch: (c, a) => `${shadow(200, 76)}
    <rect x="160" y="22" width="80" height="62" rx="14" fill="${c}"/>
    <rect x="160" y="216" width="80" height="62" rx="14" fill="${c}"/>
    <rect x="148" y="70" width="104" height="160" rx="34" fill="${shade(c, -0.4)}"/>
    <rect x="156" y="78" width="88" height="144" rx="28" fill="#141416"/>
    <rect x="162" y="84" width="76" height="132" rx="23" fill="${shade(a, -0.1)}"/>
    <circle cx="200" cy="130" r="26" fill="none" stroke="${shade(a, 0.6)}" stroke-width="7"/>
    <path d="M200 130V114M200 130l11 7" stroke="${shade(a, 0.7)}" stroke-width="5" stroke-linecap="round"/>
    <rect x="176" y="176" width="48" height="8" rx="4" fill="${shade(a, 0.5)}"/><rect x="184" y="192" width="32" height="6" rx="3" fill="${shade(a, 0.35)}"/>
    <rect x="248" y="124" width="9" height="26" rx="4.5" fill="${shade(c, -0.3)}"/>`,
  tablet: (c, a) => `${shadow(200, 130)}
    <rect x="86" y="44" width="228" height="176" rx="18" fill="${c}"/>
    <rect x="94" y="52" width="212" height="160" rx="11" fill="#17171a"/>
    <rect x="99" y="57" width="202" height="150" rx="8" fill="#f4f1ea"/>
    <rect x="109" y="67" width="86" height="64" rx="8" fill="${a}"/>
    <rect x="205" y="67" width="86" height="30" rx="8" fill="${shade(c, 0.35)}"/>
    <rect x="205" y="103" width="86" height="28" rx="8" fill="${shade(a, 0.5)}"/>
    <rect x="109" y="141" width="182" height="10" rx="5" fill="#cfc8bb"/><rect x="109" y="159" width="140" height="10" rx="5" fill="#cfc8bb"/>
    <circle cx="200" cy="185" r="6" fill="${shade(c, 0.3)}"/>`,
  fan: (c, a) => `${shadow(200, 100)}
    <ellipse cx="200" cy="238" rx="78" ry="14" fill="${shade(c, -0.25)}"/>
    <rect x="190" y="150" width="20" height="86" rx="6" fill="${shade(c, -0.1)}"/>
    <circle cx="200" cy="106" r="82" fill="${shade(a, 0.7)}" stroke="${shade(c, -0.2)}" stroke-width="8"/>
    <g fill="${a}" transform="translate(200 106)">
      <ellipse cx="0" cy="-32" rx="17" ry="34"/><ellipse cx="0" cy="-32" rx="17" ry="34" transform="rotate(120)"/><ellipse cx="0" cy="-32" rx="17" ry="34" transform="rotate(240)"/>
    </g>
    <circle cx="200" cy="106" r="53" fill="none" stroke="${shade(c, -0.2)}" stroke-width="2.5"/>
    <circle cx="200" cy="106" r="28" fill="none" stroke="${shade(c, -0.2)}" stroke-width="2.5"/>
    <circle cx="200" cy="106" r="12" fill="${shade(c, -0.3)}"/>`,

  // ---------- furniture ----------
  sofa: (c) => `${shadow(200, 160)}
    <rect x="70" y="84" width="260" height="92" rx="26" fill="${shade(c, -0.18)}"/>
    <rect x="44" y="124" width="46" height="102" rx="20" fill="${shade(c, -0.08)}"/>
    <rect x="310" y="124" width="46" height="102" rx="20" fill="${shade(c, -0.08)}"/>
    <rect x="74" y="146" width="252" height="66" rx="18" fill="${c}"/>
    <path d="M200 148v62" stroke="${shade(c, -0.25)}" stroke-width="3"/>
    <rect x="86" y="108" width="108" height="46" rx="14" fill="${shade(c, 0.12)}"/><rect x="206" y="108" width="108" height="46" rx="14" fill="${shade(c, 0.12)}"/>
    <rect x="62" y="226" width="12" height="20" rx="4" fill="${INK}"/><rect x="326" y="226" width="12" height="20" rx="4" fill="${INK}"/>
    <rect x="284" y="118" width="36" height="34" rx="9" fill="${shade(c, 0.45)}" transform="rotate(12 302 135)"/>`,
  bed: (c, a) => `${shadow(200, 160)}
    <rect x="62" y="56" width="276" height="118" rx="14" fill="${shade(a, -0.15)}"/>
    <rect x="76" y="70" width="248" height="92" rx="8" fill="${a}"/>
    <rect x="52" y="152" width="296" height="64" rx="12" fill="#f3efe6"/>
    <rect x="86" y="128" width="100" height="40" rx="14" fill="#fbf9f4" stroke="#d9d2c4" stroke-width="2"/>
    <rect x="214" y="128" width="100" height="40" rx="14" fill="#fbf9f4" stroke="#d9d2c4" stroke-width="2"/>
    <rect x="52" y="176" width="296" height="48" rx="12" fill="${c}"/>
    <rect x="52" y="176" width="296" height="12" rx="6" fill="${shade(c, 0.25)}"/>
    <rect x="52" y="224" width="296" height="16" rx="6" fill="${shade(a, -0.15)}"/>
    <rect x="58" y="236" width="14" height="12" rx="3" fill="${INK}"/><rect x="328" y="236" width="14" height="12" rx="3" fill="${INK}"/>`,
  diningtable: (c, a) => `${shadow(200, 160)}
    <rect x="48" y="128" width="40" height="86" rx="10" fill="${a}"/><rect x="48" y="168" width="52" height="14" rx="6" fill="${shade(a, -0.15)}"/>
    <rect x="312" y="128" width="40" height="86" rx="10" fill="${a}"/><rect x="300" y="168" width="52" height="14" rx="6" fill="${shade(a, -0.15)}"/>
    <rect x="62" y="206" width="9" height="40" rx="3" fill="${shade(a, -0.3)}"/><rect x="329" y="206" width="9" height="40" rx="3" fill="${shade(a, -0.3)}"/>
    <rect x="100" y="140" width="14" height="108" rx="4" fill="${shade(c, -0.25)}"/>
    <rect x="286" y="140" width="14" height="108" rx="4" fill="${shade(c, -0.25)}"/>
    <rect x="84" y="118" width="232" height="26" rx="8" fill="${c}"/>
    <rect x="84" y="118" width="232" height="9" rx="4.5" fill="${shade(c, 0.22)}"/>
    <rect x="172" y="104" width="56" height="16" rx="8" fill="${shade(a, 0.1)}"/>`,
  wardrobe: (c) => `${shadow(200, 120)}
    <rect x="96" y="34" width="208" height="210" rx="8" fill="${shade(c, -0.22)}"/>
    <rect x="104" y="42" width="94" height="194" rx="4" fill="${c}"/>
    <rect x="202" y="42" width="94" height="194" rx="4" fill="${shade(c, 0.06)}"/>
    <rect x="114" y="54" width="74" height="78" rx="3" fill="none" stroke="${shade(c, -0.2)}" stroke-width="2.5"/>
    <rect x="212" y="54" width="74" height="78" rx="3" fill="none" stroke="${shade(c, -0.2)}" stroke-width="2.5"/>
    <rect x="114" y="144" width="74" height="82" rx="3" fill="none" stroke="${shade(c, -0.2)}" stroke-width="2.5"/>
    <rect x="212" y="144" width="74" height="82" rx="3" fill="none" stroke="${shade(c, -0.2)}" stroke-width="2.5"/>
    <rect x="186" y="124" width="5" height="30" rx="2.5" fill="${INK}"/><rect x="209" y="124" width="5" height="30" rx="2.5" fill="${INK}"/>
    <rect x="108" y="244" width="14" height="10" rx="3" fill="${INK}"/><rect x="278" y="244" width="14" height="10" rx="3" fill="${INK}"/>`,
  desk: (c, a) => `${shadow(200, 160)}
    <rect x="260" y="150" width="64" height="94" rx="4" fill="${shade(c, -0.2)}"/>
    <rect x="266" y="158" width="52" height="38" rx="3" fill="${c}"/><rect x="266" y="200" width="52" height="38" rx="3" fill="${c}"/>
    <rect x="286" y="172" width="12" height="4" rx="2" fill="${INK}"/><rect x="286" y="214" width="12" height="4" rx="2" fill="${INK}"/>
    <rect x="78" y="150" width="9" height="96" rx="3" fill="${shade(c, -0.25)}"/>
    <rect x="62" y="136" width="276" height="16" rx="6" fill="${c}"/><rect x="62" y="136" width="276" height="6" rx="3" fill="${shade(c, 0.25)}"/>
    <rect x="104" y="92" width="100" height="44" rx="5" fill="#1c1b1d"/><rect x="109" y="97" width="90" height="34" rx="3" fill="${shade(a, 0.1)}"/>
    <rect x="146" y="128" width="16" height="8" fill="#1c1b1d"/>
    <path d="M256 136l16-46 24 8" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M292 94l28 4-10 20z" fill="${a}"/>`,
  bookshelf: (c, a) => `${shadow(200, 110)}
    <rect x="102" y="30" width="196" height="214" rx="5" fill="${shade(c, -0.25)}"/>
    <rect x="110" y="38" width="180" height="198" fill="${shade(c, -0.05)}"/>
    <rect x="110" y="94" width="180" height="7" fill="${c}"/><rect x="110" y="150" width="180" height="7" fill="${c}"/><rect x="110" y="206" width="180" height="7" fill="${c}"/>
    <g>
      <rect x="118" y="52" width="14" height="42" fill="${a}"/><rect x="134" y="60" width="12" height="34" fill="#e9e1cf"/><rect x="148" y="48" width="16" height="46" fill="${shade(a, -0.3)}"/><rect x="168" y="58" width="12" height="36" fill="#c8704a"/>
      <rect x="230" y="62" width="48" height="32" rx="3" fill="${shade(a, 0.4)}"/>
      <rect x="120" y="116" width="40" height="34" rx="3" fill="#e9e1cf"/><rect x="166" y="106" width="14" height="44" fill="${a}"/><rect x="182" y="112" width="14" height="38" fill="${shade(a, -0.35)}"/>
      <circle cx="244" cy="136" r="14" fill="${shade(a, 0.5)}"/><rect x="236" y="144" width="16" height="6" fill="${shade(c, -0.3)}"/>
      <rect x="120" y="170" width="16" height="36" fill="#c8704a"/><rect x="138" y="164" width="14" height="42" fill="${a}"/><rect x="154" y="176" width="16" height="30" fill="#e9e1cf"/>
      <rect x="214" y="180" width="66" height="26" rx="3" fill="${shade(a, -0.15)}"/>
    </g>
    <rect x="108" y="244" width="12" height="8" fill="${INK}"/><rect x="280" y="244" width="12" height="8" fill="${INK}"/>`,
  armchair: (c, a) => `${shadow(200, 110)}
    <rect x="116" y="50" width="168" height="126" rx="40" fill="${shade(c, -0.15)}"/>
    <rect x="92" y="118" width="40" height="92" rx="18" fill="${c}"/><rect x="268" y="118" width="40" height="92" rx="18" fill="${c}"/>
    <rect x="106" y="152" width="188" height="56" rx="18" fill="${shade(c, 0.1)}"/>
    <rect x="136" y="74" width="128" height="74" rx="26" fill="${shade(c, 0.18)}"/>
    <path d="M122 210l-16 40M278 210l16 40" stroke="${a}" stroke-width="9" stroke-linecap="round"/>
    <path d="M142 210l-8 38M258 210l8 38" stroke="${shade(a, -0.3)}" stroke-width="7" stroke-linecap="round"/>`,
  coffeetable: (c, a) => `${shadow(200, 130, 254)}
    <path d="M118 166l-22 80M282 166l22 80M168 176l-6 70M232 176l6 70" stroke="${shade(c, -0.35)}" stroke-width="9" stroke-linecap="round"/>
    <ellipse cx="200" cy="166" rx="128" ry="32" fill="${shade(c, -0.25)}"/>
    <ellipse cx="200" cy="158" rx="128" ry="32" fill="${c}"/>
    <ellipse cx="200" cy="158" rx="104" ry="24" fill="none" stroke="${shade(c, 0.25)}" stroke-width="2"/>
    <rect x="236" y="128" width="62" height="12" rx="2" fill="${a}"/><rect x="241" y="118" width="52" height="11" rx="2" fill="#e9e1cf"/>
    <path d="M142 150c-9-30 22-40 22-62 8 20 22 32 8 62z" fill="${shade(a, -0.1)}"/><ellipse cx="156" cy="152" rx="20" ry="7" fill="${shade(a, -0.35)}"/>`,

  // ---------- vessels ----------
  jars: (c, a) => {
    const jar = (x, w, h, lid) => `<rect x="${x}" y="${250 - h}" width="${w}" height="${h}" rx="9" fill="${c}"/>
      <rect x="${x}" y="${250 - h}" width="${w * 0.28}" height="${h}" rx="9" fill="#fff" opacity=".28"/>
      <rect x="${x - 3}" y="${250 - h - 18}" width="${w + 6}" height="20" rx="7" fill="${lid}"/>
      <rect x="${x + w / 2 - 12}" y="${250 - h - 27}" width="24" height="10" rx="5" fill="${shade(lid, -0.25)}"/>`;
    return `${shadow(200, 150)}${jar(70, 78, 112, a)}${jar(160, 80, 150, shade(a, -0.15))}${jar(252, 78, 128, a)}`;
  },
  bottle: (c, a) => `${shadow(200, 62)}
    <rect x="158" y="54" width="84" height="196" rx="30" fill="${c}"/>
    <rect x="166" y="62" width="20" height="180" rx="10" fill="#fff" opacity=".26"/>
    <rect x="170" y="30" width="60" height="30" rx="9" fill="${a}"/>
    <rect x="182" y="18" width="36" height="16" rx="8" fill="${shade(a, -0.3)}"/>
    <rect x="158" y="136" width="84" height="38" fill="${a}" opacity=".92"/>
    <circle cx="200" cy="155" r="9" fill="${shade(c, 0.5)}"/>`,
  dinnerset: (c, a) => `${shadow(200, 150)}
    <ellipse cx="148" cy="222" rx="94" ry="26" fill="${shade(c, -0.08)}"/><ellipse cx="148" cy="214" rx="94" ry="26" fill="#f6f2e9"/>
    <ellipse cx="148" cy="214" rx="68" ry="17" fill="#fff" stroke="${a}" stroke-width="3"/>
    <ellipse cx="148" cy="196" rx="94" ry="26" fill="#f6f2e9" stroke="${shade(c, -0.05)}" stroke-width="2"/>
    <ellipse cx="148" cy="196" rx="68" ry="17" fill="#fff" stroke="${a}" stroke-width="3"/>
    <path d="M242 160h104a52 52 0 0 1-104 0z" fill="#f6f2e9" stroke="${shade(c, -0.05)}" stroke-width="2"/>
    <path d="M250 172h88" stroke="${a}" stroke-width="4"/>
    <ellipse cx="294" cy="160" rx="52" ry="10" fill="#fff" stroke="${shade(c, -0.05)}" stroke-width="2"/>
    <path d="M262 208h64v10a32 14 0 0 1-64 0z" fill="#f6f2e9" stroke="${shade(c, -0.05)}" stroke-width="2"/>`,
  tumblers: (c, a) => {
    const t = (x, h, col) => `<path d="M${x} ${250 - h}h64l-9 ${h}h-46z" fill="${col}"/>
      <path d="M${x + 6} ${250 - h}h14l-5 ${h}h-9z" fill="#fff" opacity=".32"/>
      <rect x="${x - 2}" y="${248 - h}" width="68" height="8" rx="4" fill="${shade(col, 0.25)}"/>`;
    return `${shadow(200, 140)}${t(52, 120, c)}${t(134, 140, shade(c, 0.05))}${t(216, 120, c)}<rect x="290" y="176" width="58" height="8" rx="4" fill="${a}"/>`;
  },
  thali: (c, a) => `${shadow(200, 150)}
    <ellipse cx="200" cy="170" rx="156" ry="70" fill="${shade(c, -0.25)}"/>
    <ellipse cx="200" cy="162" rx="156" ry="70" fill="${c}"/>
    <ellipse cx="200" cy="162" rx="128" ry="54" fill="${shade(c, 0.12)}"/>
    ${[[110, 150], [160, 126], [240, 126], [290, 150], [140, 190], [260, 190]]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y + 5}" rx="30" ry="12" fill="${shade(c, -0.3)}"/><ellipse cx="${x}" cy="${y}" rx="30" ry="12" fill="${shade(c, 0.28)}"/><ellipse cx="${x}" cy="${y + 2}" rx="21" ry="7.5" fill="${a}" opacity=".85"/>`)
      .join('')}
    <ellipse cx="200" cy="162" rx="26" ry="10" fill="${shade(c, -0.1)}"/>`,
  jug: (c, a) => `${shadow(200, 96)}
    <path d="M122 70h126l8 14c8 54 14 104-16 156H130c-30-52-24-102-16-156z" fill="${c}"/>
    <path d="M132 86h24c-4 46-4 96 4 144h-18c-10-52-14-98-10-144z" fill="#fff" opacity=".28"/>
    <path d="M248 78h20c42 0 52 70 0 82" fill="none" stroke="${shade(c, -0.25)}" stroke-width="14" stroke-linecap="round"/>
    <path d="M110 74c16-12 40-8 56-14l-4 14z" fill="${shade(c, -0.15)}"/>
    <rect x="120" y="66" width="140" height="14" rx="7" fill="${shade(c, 0.2)}"/>
    <rect x="124" y="140" width="128" height="14" fill="${a}" opacity=".7"/>`,
  lunchbox: (c, a) => `${shadow(200, 110)}
    <rect x="108" y="190" width="184" height="52" rx="12" fill="${c}"/>
    <rect x="108" y="140" width="184" height="52" rx="12" fill="${shade(c, 0.12)}"/>
    <rect x="108" y="90" width="184" height="52" rx="12" fill="${c}"/>
    <rect x="102" y="60" width="196" height="34" rx="14" fill="${shade(c, -0.22)}"/>
    <path d="M132 40c0-16 136-16 136 0v22H132z" fill="${a}"/>
    <rect x="112" y="116" width="12" height="108" rx="5" fill="${INK}" opacity=".5"/><rect x="276" y="116" width="12" height="108" rx="5" fill="${INK}" opacity=".5"/>
    <rect x="124" y="98" width="30" height="8" rx="4" fill="#fff" opacity=".35"/>`,
  containers: (c, a) => {
    const k = (x, w, h) => `<rect x="${x}" y="${250 - h}" width="${w}" height="${h}" rx="10" fill="${c}"/>
      <rect x="${x + 8}" y="${250 - h + 8}" width="${w * 0.18}" height="${h - 16}" rx="6" fill="#fff" opacity=".3"/>
      <rect x="${x - 4}" y="${250 - h - 14}" width="${w + 8}" height="18" rx="8" fill="${a}"/>
      <rect x="${x + w / 2 - 10}" y="${250 - h - 22}" width="20" height="9" rx="4.5" fill="${shade(a, -0.3)}"/>`;
    return `${shadow(200, 150)}${k(36, 104, 72)}${k(158, 128, 104)}${k(310, 60, 54)}`;
  },

  // ---------- cooking ----------
  cooker: (c, a) => `${shadow(200, 118)}
    <rect x="96" y="112" width="208" height="130" rx="18" fill="${c}"/>
    <rect x="104" y="120" width="30" height="114" rx="10" fill="#fff" opacity=".22"/>
    <path d="M92 112c0-34 40-50 108-50s108 16 108 50z" fill="${shade(c, -0.18)}"/>
    <rect x="146" y="52" width="108" height="14" rx="7" fill="${INK}"/>
    <circle cx="200" cy="48" r="9" fill="${a}"/><rect x="196" y="34" width="8" height="12" rx="3" fill="${a}"/>
    <rect x="52" y="148" width="50" height="16" rx="8" fill="${INK}"/><rect x="298" y="148" width="50" height="16" rx="8" fill="${INK}"/>
    <rect x="180" y="118" width="40" height="8" rx="4" fill="${shade(c, 0.3)}"/>`,
  kadai: (c, a) => `${shadow(200, 130, 254)}
    <path d="M70 120h260c0 78-52 124-130 124S70 198 70 120z" fill="${shade(c, -0.1)}"/>
    <path d="M78 124h244c-6 56-46 94-122 94S84 180 78 124z" fill="${c}"/>
    <path d="M96 130c8 38 30 62 62 72" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".22" fill="none"/>
    <ellipse cx="200" cy="120" rx="130" ry="14" fill="${shade(c, -0.45)}"/>
    <ellipse cx="200" cy="120" rx="118" ry="9" fill="${shade(c, -0.6)}"/>
    <rect x="28" y="108" width="52" height="14" rx="7" fill="${a}"/><rect x="320" y="108" width="52" height="14" rx="7" fill="${a}"/>`,
  tawa: (c, a) => `${shadow(190, 140, 250)}
    <ellipse cx="180" cy="168" rx="140" ry="62" fill="${shade(c, -0.4)}"/>
    <ellipse cx="180" cy="158" rx="140" ry="62" fill="${c}"/>
    <ellipse cx="180" cy="158" rx="118" ry="49" fill="${shade(c, -0.22)}"/>
    <ellipse cx="160" cy="146" rx="60" ry="18" fill="#fff" opacity=".1"/>
    <path d="M300 130l82-30c6-2 12 4 10 10l-4 8c-2 4-6 6-10 6l-78 16z" fill="${a}"/>
    <circle cx="378" cy="106" r="3.5" fill="${INK}"/>`,
  cookwareset: (c, a) => `${shadow(200, 160)}
    <rect x="48" y="132" width="130" height="110" rx="12" fill="${c}"/><rect x="40" y="132" width="146" height="16" rx="7" fill="${shade(c, -0.2)}"/>
    <rect x="22" y="160" width="28" height="9" rx="4" fill="${a}"/><rect x="176" y="160" width="28" height="9" rx="4" fill="${a}"/>
    <rect x="196" y="90" width="106" height="152" rx="12" fill="${shade(c, 0.1)}"/><rect x="190" y="90" width="118" height="14" rx="7" fill="${shade(c, -0.15)}"/>
    <rect x="306" y="118" width="40" height="9" rx="4" fill="${a}"/>
    <path d="M214 90a36 18 0 0 1 70 0z" fill="#fff" opacity=".4"/><circle cx="249" cy="64" r="8" fill="${a}"/>
    <path d="M58 230h110" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".22"/>
    <ellipse cx="116" cy="130" rx="60" ry="7" fill="${shade(c, -0.45)}"/>`,
  mixer: (c, a) => `${shadow(200, 100)}
    <rect x="124" y="164" width="152" height="82" rx="16" fill="${c}"/>
    <rect x="132" y="172" width="22" height="66" rx="9" fill="#fff" opacity=".22"/>
    <circle cx="232" cy="206" r="18" fill="${shade(c, -0.3)}"/><circle cx="232" cy="206" r="9" fill="${a}"/><path d="M232 206v-9" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <rect x="166" y="198" width="26" height="8" rx="4" fill="${shade(c, 0.4)}"/>
    <path d="M150 164l8-92h84l8 92z" fill="#e8f0ee" opacity=".92" stroke="${shade(c, -0.1)}" stroke-width="3"/>
    <path d="M166 150l5-58M180 152l3-50" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>
    <path d="M200 164v-30" stroke="${shade(c, -0.4)}" stroke-width="6"/><path d="M186 140l14-6 14 6" stroke="${shade(c, -0.4)}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <rect x="144" y="52" width="112" height="24" rx="10" fill="${a}"/><rect x="190" y="40" width="20" height="14" rx="6" fill="${shade(a, -0.3)}"/>
    <path d="M258 90h24c14 0 14 38 0 38h-20" fill="none" stroke="${shade(c, -0.3)}" stroke-width="10" stroke-linecap="round"/>`,
  induction: (c, a) => `${shadow(200, 150)}
    <path d="M70 168h260l28 56H42z" fill="${shade(c, -0.15)}"/>
    <path d="M70 168h260l22 46H48z" fill="#18181b"/>
    <ellipse cx="200" cy="192" rx="86" ry="18" fill="none" stroke="${a}" stroke-width="4"/>
    <ellipse cx="200" cy="192" rx="58" ry="12" fill="none" stroke="${a}" stroke-width="3" opacity=".7"/>
    <ellipse cx="200" cy="192" rx="30" ry="6" fill="none" stroke="${a}" stroke-width="2.5" opacity=".5"/>
    <rect x="42" y="224" width="316" height="22" rx="8" fill="${c}"/>
    <circle cx="96" cy="235" r="6" fill="${shade(c, -0.4)}"/><circle cx="124" cy="235" r="6" fill="${shade(c, -0.4)}"/>
    <rect x="248" y="230" width="86" height="10" rx="4" fill="#18181b"/><rect x="254" y="233" width="28" height="4" rx="2" fill="${a}"/>
    <path d="M120 150h160l-10-60c-2-14-14-22-28-22h-84c-14 0-26 8-28 22z" fill="${shade(a, 0.1)}" opacity="0"/>`,
  kettle: (c, a) => `${shadow(200, 104)}
    <rect x="112" y="226" width="150" height="20" rx="9" fill="${shade(c, -0.35)}"/>
    <path d="M132 226l-12-98c-2-26 14-50 44-52h26c30 2 46 26 44 52l-12 98z" fill="${c}"/>
    <path d="M140 220l-8-84c-1-20 6-38 22-46" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".3" fill="none"/>
    <path d="M122 100c-26-4-52 8-60 30l22 6c6-14 22-20 40-18z" fill="${shade(c, -0.1)}"/>
    <path d="M254 90c36 4 38 70 6 96" fill="none" stroke="${a}" stroke-width="14" stroke-linecap="round"/>
    <rect x="160" y="62" width="64" height="20" rx="9" fill="${shade(c, -0.25)}"/><rect x="180" y="52" width="24" height="14" rx="6" fill="${a}"/>
    <rect x="176" y="156" width="14" height="52" rx="6" fill="#e8f0ee" opacity=".7"/><rect x="196" y="156" width="10" height="52" rx="5" fill="${a}" opacity=".6"/>`,
  airfryer: (c, a) => `${shadow(200, 104)}
    <rect x="112" y="36" width="176" height="208" rx="44" fill="${c}"/>
    <rect x="124" y="46" width="22" height="188" rx="11" fill="#fff" opacity=".2"/>
    <rect x="132" y="56" width="136" height="50" rx="22" fill="${shade(c, -0.35)}"/>
    <rect x="148" y="68" width="60" height="12" rx="6" fill="${a}"/><rect x="148" y="86" width="40" height="7" rx="3.5" fill="${shade(a, 0.4)}"/>
    <circle cx="238" cy="81" r="14" fill="${shade(c, 0.1)}"/><circle cx="238" cy="81" r="6" fill="${a}"/>
    <rect x="132" y="120" width="136" height="104" rx="18" fill="${shade(c, -0.2)}"/>
    <rect x="146" y="132" width="108" height="80" rx="12" fill="#17171a"/>
    <path d="M154 202c20-24 42-40 100-58v58z" fill="#fff" opacity=".07"/>
    <rect x="164" y="226" width="72" height="9" rx="4.5" fill="${INK}"/>`,
};

export const ART_TYPES = Object.keys(D);

export function artFragment(type, c, a) {
  const f = D[type] ?? D.containers;
  return f(c, a);
}

export function artSvg(type, c, a) {
  const main = hex(c, '#456f3a');
  const acc = hex(a, shade(main, -0.3));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img" aria-hidden="true">${artFragment(type, main, acc)}</svg>`;
}

// A living-room scene for the landing page hero.
export function sceneSvg() {
  const g = (type, c, a, x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${artFragment(type, c, a)}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 620" role="img" aria-hidden="true">
  <rect width="800" height="620" fill="#d6d0c3"/>
  <rect y="418" width="800" height="202" fill="#c3bba9"/>
  <rect y="414" width="800" height="8" fill="#b4ab98"/>
  <rect x="470" y="60" width="250" height="210" rx="6" fill="#efe9dc"/>
  <rect x="482" y="72" width="226" height="186" rx="3" fill="#bfd3c8"/>
  <path d="M482 258V190l60-44 50 36 36-24 80 60v40z" fill="#9db9a8"/>
  <path d="M595 72v186M482 165h226" stroke="#efe9dc" stroke-width="8"/>
  <ellipse cx="300" cy="506" rx="270" ry="40" fill="#456f3a" opacity=".18"/>
  ${g('bookshelf', '#8a5f3d', '#456f3a', -30, 130, 1.12)}
  ${g('sofa', '#456f3a', '#2a1d17', 190, 254, 1.42)}
  ${g('armchair', '#c8794f', '#2a1d17', 508, 250, 1.06)}
  ${g('coffeetable', '#8a5f3d', '#456f3a', 188, 410, 0.74)}
  <rect x="64" y="36" width="168" height="108" rx="4" fill="#efe9dc"/><rect x="72" y="44" width="152" height="92" fill="#456f3a" opacity=".85"/>
  <circle cx="176" cy="76" r="14" fill="#e5e1d8"/><path d="M72 136v-30l46-34 40 30 26-18 40 36v16z" fill="#2a1d17" opacity=".55"/>
</svg>`;
}
