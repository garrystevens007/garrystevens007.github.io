/* Momoni desktop app screens, drawn in HTML/CSS for the portfolio mockups.
   Invented demo data (persona "Dina"). English UI. Momoni tokens.
   Usage: MomoniScreens.render(el, 'dashboard' | 'flow' | 'calendar' | 'transactions' | 'statement' | 'plan', { dark, safe })
   The screen is drawn at 1440×900 and scaled to the width of `el` (keep el at 16:10). */
(function () {
  'use strict';

  var LIGHT = { bg: '#FFF8F4', side: '#FFFFFF', card: '#FFFFFF', el: '#FFF1EA', fg: '#1F1A17', mu: '#5E534C', bd: '#EBDDD3', bds: '#DCC8BA', pr: '#B5531A', acc: '#F2762E', accFg: '#1F1A17', ok: '#15803D', okBg: '#DCFCE7', warn: '#A16207', track: '#FBEAE0', mid: '#1F1A17', bar: '#F7BE9C', barBig: '#F2762E', tile: 'transparent' };
  var DARK = { bg: '#141110', side: '#1F1A17', card: '#2A2420', el: '#332B26', fg: '#FFF8F3', mu: '#C9BCB2', bd: '#3A322D', bds: '#54483F', pr: '#F59B62', acc: '#F2762E', accFg: '#1F1A17', ok: '#4ADE80', okBg: '#123224', warn: '#F5B83D', track: '#3A322D', mid: '#C9BCB2', bar: '#7A3A12', barBig: '#F2762E', tile: '#FFF1EA' };

  var CATS = [
    ['Rent & home', '#8B6A3E', 750000, 1], ['Food & hangouts', '#1FA97A', 612500, 12], ['Transport & e-wallet', '#F06A2A', 318000, 8],
    ['Shopping', '#F5B400', 247010, 4], ['Subscriptions', '#6D4AFF', 214990, 3], ['Fun', '#E5484D', 120000, 3]
  ];
  var DAYS = [62, 85, 40, 0, 218, 256, 54, 790, 72, 38, 0, 65, 260, 88, 47, 102, 60, 25];
  var ICON = {
    dash: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z', trx: 'M6 3h12v18H6zM9 8h6M9 12h6M9 16h4', up: 'M6 3h9l4 4v14H6zM12 17v-6M9 13l3-3 3 3',
    bud: 'M4 11a7 6 0 0 1 14 0v2a3 3 0 0 1-2 3l-1 3h-3l-1-2h-2l-1 2H5l-1-4a4 4 0 0 1 0-4z', bank: 'M3 10l9-6 9 6M5 10v8M19 10v8M9 10v8M15 10v8M3 20h18', more: 'M5 12h.01M12 12h.01M19 12h.01',
    flow: 'M4 6c6 0 6 12 16 12M4 18c6 0 6-12 16-12', cal: 'M4 5h16v15H4zM4 10h16M9 3v4M15 3v4'
  };
  var MASCOT_BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/app-screens\.js.*$/, '') : 'assets/';

  function rp(n) { var neg = n < 0; n = Math.round(Math.abs(n)); return (neg ? '−' : '') + 'Rp ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function short(n) { return n >= 1e6 ? 'Rp ' + (Math.round(n / 1e4) / 100).toString() + ' m' : 'Rp ' + Math.round(n / 1000) + 'k'; }
  function pct(n) { return (Math.round(n * 1000) / 10).toString() + '%'; }
  function svg(d, s, w) { return '<svg width="' + (s || 15) + '" height="' + (s || 15) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.8) + '" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>'; }

  function sidebar(c, sc) {
    var dash = sc === 'dashboard' || sc === 'flow' || sc === 'calendar';
    var groups = [
      ['Dashboard', ICON.dash, [], dash ? '*' : ''],
      ['Transactions', ICON.trx, sc === 'transactions' ? ['Transactions', 'Merchants', 'Categories'] : [], sc === 'transactions' ? 'Transactions' : ''],
      ['Upload & statements', ICON.up, sc === 'statement' ? ['Upload', 'Statements'] : [], sc === 'statement' ? 'Upload' : ''],
      ['Budget & plan', ICON.bud, sc === 'plan' ? ['Budget', 'Plan', 'Schedule'] : [], sc === 'plan' ? 'Plan' : ''],
      ['Wealth & goals', ICON.bank, [], ''],
      ['More', ICON.more, [], '']
    ];
    var on = 'background:' + c.acc + ';color:' + c.accFg + ';font-weight:800;';
    var h = '<div class="ms-side" style="background:' + c.side + ';border-right:1px solid ' + c.bd + '">';
    h += '<div class="ms-brand"><span class="ms-tile" style="background:' + c.tile + '"><img src="' + MASCOT_BASE + 'momoni-mark-simple.svg" alt="" width="28" height="30"></span>';
    h += '<span class="ms-brandtext"><b>Momoni</b><br><small style="color:' + c.mu + '">Personal finance</small></span>';
    h += '<span style="color:' + c.mu + '">' + svg('M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4', 14, 2) + '</span></div>';
    groups.forEach(function (g) {
      var hasSub = g[0] !== 'Dashboard';
      var chev = hasSub ? svg(g[2].length ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6', 12, 2) : '';
      h += '<div class="ms-nav" style="' + (g[3] === '*' ? on : 'color:' + c.fg) + '">' + svg(g[1]) + '<span>' + g[0] + '</span><span class="ms-chev">' + chev + '</span></div>';
      g[2].forEach(function (s) { h += '<div class="ms-sub" style="' + (g[3] === s ? on : 'color:' + c.fg) + '">' + s + '</div>'; });
    });
    h += '<div style="flex:1"></div><div style="border-top:1px solid ' + c.bd + ';padding-top:8px"><div class="ms-nav" style="color:' + c.fg + '">' + svg('M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z') + '<span>Settings</span></div><div class="ms-nav" style="color:' + c.fg + '">' + svg('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.5M12 17h.01') + '<span>Help</span></div></div>';
    return h + '</div>';
  }

  function card(c, extra) { return 'background:' + c.card + ';border:1px solid ' + c.bd + ';border-radius:16px;box-sizing:border-box;' + (extra || ''); }
  function pill(c, extra) { return 'display:inline-flex;align-items:center;padding:6px 11px;border-radius:10px;border:1px solid ' + c.bd + ';background:' + c.card + ';font-size:12px;white-space:nowrap;' + (extra || ''); }
  function seg(c, items, active) {
    return '<span style="display:inline-flex;padding:3px;border-radius:10px;background:' + c.el + ';font-size:12px">' + items.map(function (t) {
      return '<span style="padding:5px 10px;border-radius:8px;' + (t === active ? 'background:' + c.card + ';box-shadow:0 1px 2px rgba(0,0,0,.08)' : 'color:' + c.mu) + '">' + t + '</span>';
    }).join('') + '</span>';
  }
  function head(c, title, sub, right, crumb) {
    return '<div class="ms-head">' + '<div style="flex:1;min-width:0">' + (crumb ? '<div style="font-size:11px;color:' + c.mu + ';margin-bottom:8px">' + crumb + '</div>' : '') +
      '<div class="ms-title">' + title + '</div>' + (sub ? '<div style="font-size:11.5px;color:' + c.mu + ';margin-top:3px">' + sub + '</div>' : '') + '</div>' + (right || '') + '</div>';
  }
  function dashTabs(c, sc) {
    var on = 'background:' + c.acc + ';color:' + c.accFg + ';font-weight:800;';
    return '<div style="' + card(c, 'display:inline-flex;align-self:flex-start;gap:4px;padding:4px;border-radius:14px') + '">' +
      [['dashboard', 'Overview', ICON.dash], ['flow', 'Flow', ICON.flow], ['calendar', 'Calendar', ICON.cal]].map(function (d) {
        return '<span style="display:inline-flex;align-items:center;gap:6px;padding:6px 13px;border-radius:10px;font-size:13px;font-weight:600;' + (sc === d[0] ? on : '') + '">' + svg(d[2], 14, 2) + d[1] + '</span>';
      }).join('') + '</div>';
  }
  function dashRight(c) {
    return '<div style="display:flex;align-items:center;gap:10px">' + seg(c, ['By transaction', 'By statement'], 'By transaction') + '<span>‹</span><span style="' + pill(c) + '">November 2026 ⌄</span><span style="color:' + c.mu + '">›</span><span style="' + pill(c) + '">? Help</span></div>';
  }
  var TOT = 2262500;

  function overview(c, safe) {
    var h = '<div style="' + card(c, 'padding:14px 18px;display:flex;align-items:center;gap:14px') + '"><img src="' + MASCOT_BASE + 'momo-senang-avatar.svg" alt="" width="46" height="46">' +
      '<div style="flex:1;min-width:0"><div class="ms-h" style="font-size:18px">So far you have spent <span style="color:' + c.pr + '">Rp 2.26 m</span> in November, 67% of your budget.</div><div style="color:' + c.mu + ';margin-top:4px">Biggest driver: rent, Rp 750k on 1 Nov.</div></div>' +
      '<span style="padding:5px 11px;border-radius:99px;background:#F5B83D;color:#1F1A17;font-size:11.5px;font-weight:800">Safe today ' + rp(safe) + '</span></div>';
    var stats = [
      ['Spent so far in November', 'Rp 2.262.500', 100, c.acc, 'card Rp 1.31 m · QRIS/cash Rp 952k'],
      ['Budget used', '67%', 67, c.acc, 'Budget Rp 3.400.000 · Rp 1.14 m left<br>Safe to spend today: ' + rp(safe) + '/day for 13 days'],
      ['vs average month', '−18%', 82, c.ok, 'Average Rp 2.759.000 by this day'],
      ['Fixed / variable', '43% / 57%', 43, c.acc, 'Rp 964.990 fixed · Rp 1.297.510 variable'],
      ['Goal progress', '64%', 64, c.ok, 'Bali trip · target Jul 2027']
    ];
    h += '<div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px">' + stats.map(function (s) {
      return '<div style="' + card(c, 'padding:14px;display:flex;flex-direction:column;gap:6px;min-height:150px') + '"><span style="font-size:11px;color:' + c.mu + '">' + s[0] + '</span><span style="font-size:22px;font-weight:800;font-variant-numeric:tabular-nums">' + s[1] + '</span><span style="height:4px;border-radius:99px;background:' + c.track + ';overflow:hidden"><span style="display:block;height:100%;width:' + s[2] + '%;background:' + s[3] + '"></span></span><span style="font-size:10.5px;color:' + c.mu + '">' + s[4] + '</span></div>';
    }).join('') + '</div>';
    var bars = '';
    for (var i = 0; i < 31; i++) { var v = DAYS[i] || 0; bars += '<span style="flex:1;height:' + Math.max(v ? 3 : 0.6, Math.round(v / 790 * 100)) + '%;background:' + (v >= 250 ? c.barBig : c.bar) + ';border-radius:2px 2px 0 0"></span>'; }
    var top = [['1 Nov', 'Rp 790.000', 'Rent, Kopi Senja'], ['6 Nov', 'Rp 260.000', 'Online shop, Warung Nasi'], ['30 Oct', 'Rp 256.000', 'Cinema, ride-hailing']];
    h += '<div style="display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:12px;flex:1;min-height:0">';
    h += '<div style="' + card(c, 'padding:16px;display:flex;flex-direction:column;gap:10px') + '"><div style="display:flex;justify-content:space-between;align-items:baseline"><b class="ms-h" style="font-size:14px">Daily spending</b><span style="font-size:10.5px;color:' + c.mu + '">Bars: each day · dashed: average day (Rp 125.694)</span></div>' +
      '<div style="height:150px;display:flex;align-items:flex-end;gap:4px;border-bottom:1px solid ' + c.bd + ';position:relative"><span style="position:absolute;left:0;right:0;bottom:24px;border-top:1px dashed ' + c.bds + '"></span>' + bars + '</div>' +
      '<div style="display:flex;justify-content:space-between;font-size:10px;color:' + c.mu + '"><span>25 Oct</span><span>1 Nov</span><span>24 Nov</span></div>' +
      '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">' + top.map(function (t) { return '<div style="background:' + c.el + ';border-radius:10px;padding:8px 10px;font-size:11px"><div style="display:flex;justify-content:space-between;font-weight:700"><span>' + t[0] + '</span><span>' + t[1] + '</span></div><div style="color:' + c.mu + ';font-size:10px">' + t[2] + '</div></div>'; }).join('') + '</div></div>';
    h += '<div style="' + card(c, 'padding:16px;display:flex;flex-direction:column;gap:10px') + '"><div style="display:flex;justify-content:space-between;align-items:center"><b class="ms-h" style="font-size:14px">Where it went</b>' + seg(c, ['Category', 'Merchant'], 'Category') + '</div>' +
      CATS.map(function (k) { return '<div style="display:flex;flex-direction:column;gap:5px"><div style="display:flex;align-items:baseline;gap:6px;font-size:12px"><span style="width:8px;height:8px;border-radius:2px;background:' + k[1] + '"></span><span>' + k[0] + '</span><span style="font-size:10px;color:' + c.mu + '">' + k[3] + ' trx</span><span style="flex:1"></span><b>' + rp(k[2]) + '</b><span style="font-size:10px;color:' + c.mu + ';width:36px;text-align:right">' + pct(k[2] / TOT) + '</span></div><span style="height:4px;border-radius:99px;background:' + c.track + ';overflow:hidden"><span style="display:block;height:100%;width:' + Math.round(k[2] / 750000 * 100) + '%;background:' + k[1] + '"></span></span></div>'; }).join('') + '</div></div>';
    return h;
  }

  function flow(c) {
    var H = 270, k = H / TOT, kartu = 1310000, qris = 952500, h = '';
    var L = [['Credit card', kartu, '#F2762E', '#F8CDB6'], ['QRIS / cash', qris, '#B5531A', '#E9C4AB']];
    var y = 10, mid = 10, paths = '', nodes = '';
    L.forEach(function (n, i) {
      var hh = n[1] * k - (i === 0 ? 3 : 0);
      nodes += '<rect x="300" y="' + y + '" width="14" height="' + hh + '" fill="' + n[2] + '" rx="2"/><text x="292" y="' + (y + hh / 2 - 2) + '" text-anchor="end" font-size="12" fill="' + c.fg + '">' + n[0] + '</text><text x="292" y="' + (y + hh / 2 + 12) + '" text-anchor="end" font-size="10.5" fill="' + c.mu + '">' + short(n[1]) + '</text>';
      var my = 10 + (i === 0 ? 0 : kartu * k);
      paths += '<path fill="' + n[3] + '" d="M314 ' + y + ' C437 ' + y + ' 437 ' + my + ' 560 ' + my + ' L560 ' + (my + n[1] * k) + ' C437 ' + (my + n[1] * k) + ' 437 ' + (y + hh) + ' 314 ' + (y + hh) + ' Z"/>';
      y += hh + 6;
    });
    var tints = { '#8B6A3E': '#DDD0BE', '#1FA97A': '#B4E5D3', '#F06A2A': '#F8CDB6', '#F5B400': '#F9E3A6', '#6D4AFF': '#CFC4FF', '#E5484D': '#F4BCBD' };
    y = 10;
    CATS.forEach(function (cat) {
      var hh = Math.max(4, cat[2] * k - 5), mh = cat[2] * k;
      nodes += '<rect x="820" y="' + y + '" width="14" height="' + hh + '" fill="' + cat[1] + '" rx="2"/><text x="846" y="' + (y + hh / 2 - 1) + '" font-size="12" fill="' + c.fg + '">' + cat[0] + ' · ' + pct(cat[2] / TOT) + '</text><text x="846" y="' + (y + hh / 2 + 12) + '" font-size="10.5" fill="' + c.mu + '">' + short(cat[2]) + '</text>';
      paths += '<path fill="' + tints[cat[1]] + '" d="M574 ' + mid + ' C697 ' + mid + ' 697 ' + y + ' 820 ' + y + ' L820 ' + (y + hh) + ' C697 ' + (y + hh) + ' 697 ' + (mid + mh) + ' 574 ' + (mid + mh) + ' Z"/>';
      mid += mh; y += hh + 7;
    });
    nodes += '<rect x="560" y="10" width="14" height="' + H + '" fill="' + c.mid + '" rx="2"/><text x="567" y="' + (H + 30) + '" text-anchor="middle" font-size="12" fill="' + c.fg + '">Spent Rp 2.26 m</text><text x="567" y="' + (H + 44) + '" text-anchor="middle" font-size="10.5" fill="' + c.mu + '">31 transactions</text>';
    h += '<div style="' + card(c, 'padding:16px 18px') + '"><div style="display:flex;justify-content:space-between;font-size:10.5px;color:' + c.mu + '"><span>Paid with</span><span>Total</span><span>Spent on · click a category to see its transactions</span></div><svg viewBox="0 0 1100 330" width="100%" style="display:block;margin-top:4px;font-family:Nunito,sans-serif">' + paths + nodes + '</svg></div>';
    var cmp = [['November', 'so far', 'Rp 2.262.500', 30, c.acc], ['Average month', 'by this day', 'Rp 2.759.000', 37, '#9C8F86'], ['Planned budget', 'applied', 'Rp 3.400.000', 45, c.ok], ['Your budget', '67% used', 'Rp 3.400.000', 45, '#F7BE9C']];
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div style="' + card(c, 'padding:16px;display:flex;flex-direction:column;gap:10px') + '"><b class="ms-h" style="font-size:14px">November against your numbers</b>' + cmp.map(function (r) {
      return '<div style="display:grid;grid-template-columns:120px minmax(0,1fr) 100px;gap:10px;align-items:center"><span style="font-size:12px">' + r[0] + '<br><span style="font-size:9.5px;color:' + c.mu + '">' + r[1] + '</span></span><span style="height:7px;border-radius:99px;background:' + c.track + ';overflow:hidden"><span style="display:block;height:100%;width:' + r[3] + '%;background:' + r[4] + '"></span></span><b style="text-align:right;font-size:12px">' + r[2] + '</b></div>';
    }).join('') + '</div><div style="' + card(c, 'padding:16px;display:flex;flex-direction:column;gap:10px') + '"><b class="ms-h" style="font-size:14px">What if Food &amp; hangouts dropped?</b><div style="display:flex;gap:6px"><span style="' + pill(c) + '">−10%</span><span style="' + pill(c, 'background:' + c.acc + ';color:' + c.accFg + ';border-color:' + c.acc + ';font-weight:800') + '">−25%</span><span style="' + pill(c) + '">−50%</span></div><div><span style="font-size:26px;font-weight:800">Rp 153.125</span><span style="font-size:12px;color:' + c.mu + '"> a month</span></div><span style="font-size:11px;color:' + c.mu + '">Based on your Food &amp; hangouts average of Rp 612.500 a month. The Bali trip arrives about 1.3 months sooner.</span></div></div>';
    return h;
  }

  function calendar(c, dark) {
    var stats = [['Spent so far', 'Rp 2.262.500', '18 of 31 days'], ['Budget', '67%', 'of Rp 3.400.000'], ['Average month', 'Rp 3.05 m', 'November 18% below'], ['Card · QRIS/cash', '58% · 42%', 'Rp 1.31 m · Rp 952k'], ['Fixed · variable', '43% · 57%', 'Rp 965k · Rp 1.3 m']];
    var h = '<div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px">' + stats.map(function (s) { return '<div style="' + card(c, 'padding:10px 12px') + '"><div style="font-size:10.5px;color:' + c.mu + '">' + s[0] + '</div><div style="font-size:17px;font-weight:800">' + s[1] + '</div><div style="font-size:10px;color:' + c.mu + '">' + s[2] + '</div></div>'; }).join('') + '</div>';
    var cells = '';
    for (var b = 0; b < 6; b++) cells += '<div class="ms-day" style="color:' + c.mu + '">' + (19 + b) + '</div>';
    for (var d = 0; d < 29; d++) {
      var label = d === 0 ? '25 Oct' : (d === 7 ? '1 Nov' : String(d < 7 ? 25 + d : d - 6)), v = DAYS[d], fut = d > 18;
      var bg = fut ? 'transparent' : (!v ? c.el : (v > 500 ? (dark ? '#7A3A12' : '#F2A57A') : (v > 150 ? (dark ? '#5A2E15' : '#F8C7A8') : (dark ? '#3A2A20' : '#FCE0CE'))));
      cells += '<div class="ms-day" style="background:' + bg + ';' + (d === 7 ? 'outline:1.5px solid ' + c.pr + ';' : '') + 'color:' + (fut ? c.mu : c.fg) + '"><div>' + label + '</div><b>' + (fut ? '' : (v ? (v >= 1000 ? v / 1000 + ' m' : v + 'k') : '–')) + '</b></div>';
    }
    var up = [['Home internet', 'Not billed yet · 15 Nov', 'Rp 330.000'], ['Music streaming ▲', 'Not billed yet · up Rp 5.000', 'Rp 59.990'], ['Phone instalment 5/12', 'Not billed yet · paid off Jun 2027', 'Rp 625.000'], ['Rent', 'Billed this month', 'Rp 750.000']];
    h += '<div style="display:grid;grid-template-columns:minmax(0,2.6fr) minmax(0,1fr);gap:12px;flex:1;min-height:0"><div style="' + card(c, 'padding:14px 16px;display:flex;flex-direction:column;gap:8px') + '"><div style="display:flex;justify-content:space-between"><b class="ms-h" style="font-size:14px">Every day this period</b><span style="font-size:10px;color:' + c.mu + '">Less ▢▢▢■ More</span></div>' +
      '<div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;font-size:10.5px;color:' + c.mu + ';text-align:center"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>' +
      '<div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px">' + cells + '</div></div><div style="display:flex;flex-direction:column;gap:12px"><div style="' + card(c, 'padding:14px') + '"><b class="ms-h" style="font-size:13px">What happened</b><div style="font-size:11px;margin-top:8px;display:grid;grid-template-columns:44px 1fr;gap:6px"><span>1 Nov</span><span><b>Biggest day · Rp 790.000</b><br><span style="color:' + c.mu + '">Rent, Kopi Senja</span></span></div></div>' +
      '<div style="' + card(c, 'padding:14px;display:flex;flex-direction:column;gap:8px') + '"><div style="display:flex;justify-content:space-between"><b class="ms-h" style="font-size:13px">Coming up</b><span style="font-size:10px;color:' + c.mu + '">≈ Rp 2.47 m/month</span></div>' + up.map(function (u) { return '<div style="display:flex;justify-content:space-between;gap:6px;font-size:11px;border-top:1px solid ' + c.bd + ';padding-top:7px"><span><b>' + u[0] + '</b><br><span style="color:' + c.mu + ';font-size:10px">' + u[1] + '</span></span><b>' + u[2] + '</b></div>'; }).join('') + '</div></div></div>';
    return h;
  }

  function transactions(c) {
    var h = '<div style="display:flex;align-items:center;gap:8px;font-size:12px"><span style="display:inline-flex;padding:3px;border-radius:11px;background:' + c.el + '"><span style="padding:5px 12px;border-radius:9px;background:' + c.acc + ';color:' + c.accFg + ';font-weight:800">Transactions</span><span style="padding:5px 12px">Categories</span><span style="padding:5px 12px">More views ⌄</span></span><span style="color:' + c.mu + ';margin-left:4px">Saved views:</span><span style="' + pill(c) + '">Big purchases ≥ Rp 1 m ✎</span><span style="' + pill(c) + '">Online shopping ✎</span><span style="color:' + c.pr + ';font-weight:700">+ Save current view</span></div>';
    h += '<div style="' + card(c, 'padding:9px 14px;color:' + c.mu + ';border-radius:12px') + '">⌕ Search merchant, description, note, tag or amount (e.g. 70000)</div>';
    h += '<div style="display:flex;gap:6px;align-items:center">' + ['All categories', 'All sources', 'All types', 'Any amount', 'Tag', 'Counted'].map(function (f) { return '<span style="' + pill(c) + '">' + f + ' ⌄</span>'; }).join('') + '<span style="flex:1"></span>' + seg(c, ['By transaction', 'By statement'], 'By transaction') + '</div>';
    h += '<div style="' + card(c, 'padding:12px 16px;display:flex;align-items:center;gap:26px') + '"><span><span style="font-size:10.5px;color:' + c.mu + '">Total</span><br><b style="font-size:20px">Rp 2.262.500</b></span><span><span style="font-size:10.5px;color:' + c.mu + '">Transactions</span><br><b style="font-size:16px">31</b></span><span><span style="font-size:10.5px;color:' + c.mu + '">Average</span><br><b style="font-size:16px">Rp 72.984</b></span><span style="flex:1"><span style="display:flex;height:6px;border-radius:99px;overflow:hidden"><span style="width:58%;background:' + c.mid + '"></span><span style="width:42%;background:#F2762E"></span></span><span style="font-size:10px;color:' + c.mu + '">Credit card Rp 1.310.000 &nbsp; QRIS/cash Rp 952.500</span></span><span style="font-size:10.5px;font-weight:800;color:#fff;background:#15803D;padding:4px 10px;border-radius:99px">↘ 18% vs last period</span></div>';
    var av = ['#FDE7D9', '#DCF5EA', '#E7E1FF', '#FFF1C7', '#EDE6E1'];
    function row(i, n, cat, col, m, a, tag) { return '<div style="display:flex;align-items:center;gap:12px;padding:8px 14px;border-top:1px solid ' + c.bd + '"><span style="width:12px;height:12px;border:1px solid ' + c.bds + ';border-radius:3px"></span><span style="width:30px;height:30px;border-radius:99px;background:' + av[n.length % 5] + ';color:#1F1A17;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:12px">' + i + '</span><span style="flex:1;min-width:0"><span style="font-size:12.5px">' + n + '</span><br><span style="font-size:10px;color:' + c.mu + '"><span style="color:' + col + '">●</span> ' + cat + ' &nbsp; ' + m + (tag ? ' &nbsp;<span style="color:' + c.pr + ';background:' + c.el + ';padding:0 5px;border-radius:4px;font-weight:700">' + tag + '</span>' : '') + '</span></span><b style="font-size:12.5px">' + rp(a) + '</b></div>'; }
    var groups = [
      ['Thu, 12 Nov', '2 transactions · Rp 47.000', [row('K', 'Kopi Senja', 'Food & hangouts', '#1FA97A', 'QRIS/cash', 25000, 'Telegram'), row('R', 'Ride-hailing', 'Transport & e-wallet › Rides', '#F06A2A', 'Credit card', 22000)]],
      ['Wed, 11 Nov', '2 transactions · Rp 60.000', [row('W', 'Warung Nasi Bu Sri', 'Food & hangouts', '#1FA97A', 'QRIS/cash', 28000), row('M', 'Minimarket', 'Shopping', '#F5B400', 'QRIS/cash', 32000)]],
      ['Tue, 10 Nov', '2 transactions · Rp 109.990', [row('F', 'Fuel', 'Transport & e-wallet › Fuel', '#F06A2A', 'QRIS/cash', 50000), row('S', 'Music streaming', 'Subscriptions', '#6D4AFF', 'Credit card', 59990, 'Recurring')]],
      ['Sun, 1 Nov', '2 transactions · Rp 790.000', [row('R', 'Rent', 'Rent & home', '#8B6A3E', 'Transfer', 750000, 'Recurring'), row('K', 'Kopi Senja', 'Food & hangouts', '#1FA97A', 'QRIS/cash', 40000)]]
    ];
    h += '<div style="' + card(c, 'overflow:hidden;flex:1;border-radius:16px 16px 0 0') + '">' + groups.map(function (g) { return '<div style="display:flex;justify-content:space-between;padding:7px 14px;background:' + c.el + ';font-size:11px"><b>' + g[0] + '</b><span style="color:' + c.mu + '">' + g[1] + '</span></div>' + g[2].join(''); }).join('') + '</div>';
    return h;
  }

  function statement(c) {
    var check = '<span style="width:16px;height:16px;border-radius:99px;background:' + c.okBg + ';color:' + c.ok + ';font-size:10px;display:inline-flex;align-items:center;justify-content:center;flex:none">✓</span>';
    var h = '<div style="font-size:11px;color:' + c.mu + ';margin-top:-8px"><span style="color:' + c.fg + '">bca_statement_oct_2026.pdf</span> &nbsp; Period 25 Sep – 24 Oct 2026 &nbsp; 43 transactions &nbsp; Due 9 Nov 2026 · min Rp 240k &nbsp; Statement balance Rp 4.812.300</div>';
    h += '<div style="display:flex;gap:6px;font-size:12px"><span style="' + pill(c, 'border-color:' + c.pr + ';background:' + c.el) + '"><span style="background:' + c.acc + ';color:' + c.accFg + ';border-radius:99px;width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;margin-right:6px;font-weight:800">1</span>Differences</span><span style="' + pill(c) + '"><span style="color:' + c.mu + ';margin-right:6px">2</span>Review all</span><span style="' + pill(c) + '"><span style="color:' + c.mu + ';margin-right:6px">3</span>Saved</span></div>';
    var secs = [
      ['Only on the statement', '1', c.ok, 'On the BCA statement, not in Momoni. Usually instalments, foreign-currency charges, refunds and reversals that never came by email.', 'Ride-hailing · 14 Oct', 'Added to Momoni as Ride-hailing · Transport', 'Rp 48.000'],
      ['Only in Momoni', '1', '#BE123C', 'From card emails, not on this statement. Late postings move to the next statement.', 'Online shop · 24 Oct', 'Kept for the next statement', 'Rp 149.000'],
      ['On both, but different', '1', '#CA8A04', 'Same purchase with a different date or status. Pick the right side.', 'Music streaming · 18 Oct', 'Use the statement date (17 Oct)', 'Rp 59.990']
    ];
    h += '<div style="display:grid;grid-template-columns:minmax(0,1fr) 270px;gap:14px;flex:1;min-height:0"><div style="display:flex;flex-direction:column;gap:10px"><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px">' +
      [['Momoni now (card, this period)', 'Rp 4.764.300', ''], ['BCA statement', 'Rp 4.812.300', ''], ['Difference (BCA – Momoni)', '+Rp 48.000', c.warn]].map(function (s) { return '<div style="' + card(c, 'padding:10px 12px') + '"><div style="font-size:10.5px;color:' + c.mu + '">' + s[0] + '</div><div style="font-size:18px;font-weight:800;' + (s[2] ? 'color:' + s[2] : '') + '">' + s[1] + '</div></div>'; }).join('') + '</div>' +
      '<div style="' + card(c, 'padding:10px 12px;font-size:11.5px') + '"><b>0 items to decide.</b> Each item shows what Momoni has (current) next to what BCA printed (incoming), like a merge conflict. Nothing changes until you save.</div>' +
      secs.map(function (s) { return '<div style="' + card(c, 'overflow:hidden') + '"><div style="padding:10px 14px;display:flex;gap:8px;align-items:baseline"><span style="color:' + s[2] + '">●</span><span style="flex:1"><span style="font-size:13px">' + s[0] + ' <span style="color:' + c.mu + '">' + s[1] + '</span></span><br><span style="font-size:10.5px;color:' + c.mu + '">' + s[3] + '</span></span><span style="font-size:11px;font-weight:700;color:' + c.ok + '">All done</span></div><div style="display:flex;align-items:center;gap:10px;padding:8px 14px;border-top:1px solid ' + c.bd + '">' + check + '<span style="flex:1"><span style="font-size:12px">' + s[4] + '</span><br><span style="font-size:10px;color:' + c.mu + '">' + s[5] + '</span></span><span style="font-size:12px">' + s[6] + '</span><span style="' + pill(c, 'padding:3px 9px') + '">Edit</span></div></div>'; }).join('') + '</div>';
    var cl = [['Only on the statement · 1/1', 'Add, edit or ignore each line'], ['Only in Momoni · 1/1', 'Keep for later, link or delete'], ['On both, but different · 1/1', 'Pick the right side'], ['Matching · 41', 'Nothing to do'], ['Total equals the statement', 'Difference Rp 0']];
    h += '<div style="' + card(c, 'padding:14px;display:flex;flex-direction:column;gap:9px;align-self:flex-start') + '"><b style="font-size:13px">Before you can save</b>' + cl.map(function (k) { return '<div style="display:flex;gap:8px;font-size:11.5px">' + check + '<span>' + k[0] + '<br><span style="font-size:10px;color:' + c.mu + '">' + k[1] + '</span></span></div>'; }).join('') +
      '<span style="height:4px;border-radius:99px;background:' + c.acc + '"></span><div style="background:' + c.el + ';border-radius:10px;padding:9px"><span style="font-size:10.5px;color:' + c.mu + '">After saving, Momoni’s total for this period</span><br><b style="font-size:17px;color:' + c.pr + '">Rp 4.812.300</b></div><span style="text-align:center;padding:9px;border-radius:10px;background:' + c.acc + ';color:' + c.accFg + ';font-weight:800">Continue to review</span><span style="text-align:center;padding:8px;border-radius:10px;border:1px solid ' + c.bd + ';font-size:11.5px">Save as draft and continue later</span></div></div>';
    return h;
  }

  function plan(c) {
    var rows = [['Fixed costs', 'Rp 2.475.000', ''], ['Emergency fund', 'Rp 750.000', 'Rp 6.200.000 to go. At this pace: August 2027.'], ['Retirement', 'Rp 375.000', ''], ['Goal: Bali trip', 'Rp 500.000', 'Rp 9.000.000 to go · target July 2027'], ['Free spending', 'Rp 3.400.000', '']];
    return '<div style="width:640px;align-self:center;display:flex;flex-direction:column;gap:10px;margin-top:-4px">' +
      '<div style="' + card(c, 'padding:12px 16px') + '"><b class="ms-h" style="font-size:13px">↺ Last cycle (October)</b><div style="font-size:12px;margin-top:4px">Spent Rp 3.180.000 of a Rp 3.400.000 budget. <span style="color:' + c.ok + '">Rp 220.000 under.</span></div></div>' +
      '<div style="' + card(c, 'padding:12px 16px;display:flex;flex-direction:column;gap:6px') + '"><div style="display:flex;justify-content:space-between"><b class="ms-h" style="font-size:13px">Income</b><span style="font-size:11.5px">⇆ Edit</span></div><span style="font-size:11px;color:' + c.mu + '">Employee · <span style="color:' + c.fg + '">Rp 7.500.000 a month</span> · payday on the 25th</span><span style="height:5px;border-radius:99px;background:' + c.ok + '"></span><div style="display:flex;justify-content:space-between;font-size:12px"><span>Salary<br><span style="font-size:10px;color:' + c.mu + '">25 Oct 2026 · recorded only</span></span><span style="color:' + c.ok + '">+Rp 7.500.000</span></div></div>' +
      '<div style="' + card(c, 'padding:12px 16px;display:flex;flex-direction:column;gap:8px') + '"><div style="display:flex;justify-content:space-between"><b class="ms-h" style="font-size:13px">Payday plan</b><span style="font-size:11.5px">⇆ Adjust</span></div>' +
      '<div style="display:flex;gap:22px"><span><span style="font-size:10px;color:' + c.mu + '">Planned income</span><br><b style="font-size:16px">Rp 7.500.000</b></span><span><span style="font-size:10px;color:' + c.mu + '">Savings rate</span><br><b style="font-size:16px;color:' + c.ok + '">21.7%</b></span><span><span style="font-size:10px;color:' + c.mu + '">This month’s budget</span><br><b style="font-size:16px">Rp 3.400.000</b></span></div>' +
      '<span style="display:flex;height:7px;border-radius:99px;overflow:hidden"><span style="width:33%;background:#9C8F86"></span><span style="width:21.7%;background:' + c.ok + '"></span><span style="width:45.3%;background:' + c.acc + '"></span></span>' +
      '<span style="font-size:10px;color:' + c.mu + '">● Bills &amp; debt Rp 2.475.000 &nbsp; <span style="color:' + c.ok + '">●</span> Savings Rp 1.625.000 &nbsp; <span style="color:' + c.acc + '">●</span> Spending Rp 3.400.000</span>' +
      rows.map(function (r) { return '<div style="display:flex;gap:10px;align-items:flex-start;border-top:1px solid ' + c.bd + ';padding-top:7px"><span style="width:24px;height:24px;border-radius:99px;background:' + c.el + ';flex:none"></span><span style="flex:1;font-size:12px">' + r[0] + (r[2] ? '<br><span style="font-size:10px;color:' + c.pr + '">' + r[2] + '</span>' : '') + '</span><span style="font-size:12px">' + r[1] + '</span></div>'; }).join('') +
      '<div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:10px;color:' + c.mu + '">Preview. Apply it so this month’s budget follows the plan.</span><span style="padding:7px 14px;border-radius:9px;background:' + c.acc + ';color:' + c.accFg + ';font-weight:800;font-size:12px">Apply plan</span></div></div></div>';
  }

  var TITLES = {
    dashboard: ['Dashboard', '25 Oct – 24 Nov 2026', 'Dashboard'], flow: ['Dashboard', '25 Oct – 24 Nov 2026', 'Dashboard'], calendar: ['Dashboard', '25 Oct – 24 Nov 2026', 'Dashboard'],
    transactions: ['Transactions', '', 'Transactions'], statement: ['Check BCA statement with Momoni', '', 'Upload & import'], plan: ['Plan', 'What comes in, and how each payday is split', 'Plan']
  };

  function html(sc, opts) {
    opts = opts || {};
    var c = opts.dark ? DARK : LIGHT, safe = opts.safe == null ? 87500 : opts.safe, t = TITLES[sc] || TITLES.dashboard;
    var dash = sc === 'dashboard' || sc === 'flow' || sc === 'calendar';
    var right = dash ? dashRight(c) : sc === 'transactions'
      ? '<div style="display:flex;align-items:center;gap:8px"><span style="' + pill(c) + '">‹ &nbsp; November 2026 · 25 Oct – 24 Nov 2026 ⌄ &nbsp; ›</span><span style="' + pill(c) + '">+ Add</span><span style="' + pill(c, 'background:' + c.acc + ';color:' + c.accFg + ';border-color:' + c.acc + ';font-weight:800') + '">⤓ Export ⌄</span><span style="' + pill(c) + '">? Help</span></div>'
      : sc === 'statement' ? '<span style="width:28px;height:28px;border-radius:99px;border:1px solid ' + c.bd + ';background:' + c.card + ';display:inline-flex;align-items:center;justify-content:center">✕</span>' : '<span style="' + pill(c) + '">? Help</span>';
    var titleHtml = t[0] + (sc === 'statement' ? ' <span style="font-size:11px;font-weight:800;color:' + c.ok + ';background:' + c.okBg + ';padding:3px 9px;border-radius:99px;vertical-align:4px;font-family:Nunito,sans-serif">● Ready to save</span>' : '');
    var body = sc === 'flow' ? flow(c) : sc === 'calendar' ? calendar(c, opts.dark) : sc === 'transactions' ? transactions(c) : sc === 'statement' ? statement(c) : sc === 'plan' ? plan(c) : overview(c, safe);
    return '<div class="ms-screen" style="background:' + c.bg + ';color:' + c.fg + '">' +
      '<div class="ms-bar" style="border-bottom:1px solid ' + c.bd + '"><span class="ms-bar-title">' + t[2] + '</span><span style="flex:1"></span><span style="color:' + c.mu + '"><span style="display:inline-block;width:6px;height:6px;border-radius:99px;background:' + c.ok + ';margin-right:4px"></span>Online</span><span style="color:' + c.mu + ';margin-left:18px">Diagnostics</span><span style="color:' + c.mu + ';margin-left:26px;letter-spacing:16px">–▢✕</span></div>' +
      '<div class="ms-body">' + sidebar(c, sc) + '<div class="ms-main">' + head(c, titleHtml, t[1], right, sc === 'statement' ? 'Upload &amp; statements › Credit card statement (PDF)' : '') + (dash ? dashTabs(c, sc) : '') + body +
      '<span class="ms-sync" style="border:1px solid ' + c.bd + ';background:' + c.card + '">⟳ Synced 14:02</span></div></div></div>';
  }

  var CSS = '.ms-host{position:relative;overflow:hidden;width:100%;aspect-ratio:16/10;background:#FFF8F4}' +
    '.ms-scale{position:absolute;left:0;top:0;width:1440px;height:900px;transform-origin:0 0}' +
    '.ms-screen{width:1440px;height:900px;box-sizing:border-box;display:flex;flex-direction:column;font-family:Nunito,system-ui,sans-serif;font-size:13px;line-height:1.45;overflow:hidden;text-align:left}' +
    '.ms-screen *{box-sizing:border-box}' +
    '.ms-bar{height:26px;flex:none;display:flex;align-items:center;padding:0 12px;font-size:11px;position:relative}.ms-bar-title{position:absolute;left:0;right:0;text-align:center;font-weight:600}' +
    '.ms-body{flex:1;min-height:0;display:flex}.ms-side{width:200px;flex:none;padding:12px 10px;display:flex;flex-direction:column}' +
    '.ms-brand{display:flex;align-items:center;gap:8px;padding:2px 4px 12px}.ms-tile{display:inline-flex;padding:2px;border-radius:8px}.ms-tile img{display:block}' +
    '.ms-brandtext{line-height:1.05;flex:1}.ms-brandtext b{font-family:"Plus Jakarta Sans",Nunito,sans-serif;font-weight:800;font-size:17px;letter-spacing:-.03em}.ms-brandtext i{font-style:normal;font-size:8px;font-weight:900;padding:1px 4px;border-radius:4px;vertical-align:6px}.ms-brandtext small{font-size:10px}' +
    '.ms-nav{display:flex;align-items:center;gap:9px;height:36px;padding:0 10px;font-size:12.5px;border-radius:10px}.ms-nav span:nth-of-type(1){flex:1}.ms-chev{display:inline-flex;opacity:.7}' +
    '.ms-sub{display:flex;align-items:center;height:28px;padding:0 10px 0 34px;font-size:11.5px;border-radius:10px}' +
    '.ms-main{flex:1;min-width:0;padding:22px 34px 0;display:flex;flex-direction:column;gap:14px;position:relative}' +
    '.ms-head{display:flex;align-items:flex-start;gap:10px}.ms-title,.ms-h{font-family:"Plus Jakarta Sans",Nunito,sans-serif;font-weight:800;letter-spacing:-.02em}.ms-title{font-size:26px;line-height:1.1}' +
    '.ms-day{height:62px;border-radius:10px;padding:7px 9px;font-size:10.5px}.ms-day b{font-size:12px}' +
    '.ms-sync{position:absolute;right:14px;bottom:12px;padding:6px 12px;border-radius:99px;font-size:11px}';

  function ensureCss() {
    if (document.getElementById('ms-css')) return;
    var s = document.createElement('style'); s.id = 'ms-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  var hosts = [];
  function fit(host) { var inner = host.firstChild; if (inner) inner.style.transform = 'scale(' + (host.clientWidth / 1440) + ')'; }
  function render(host, screen, opts) {
    ensureCss();
    host.classList.add('ms-host');
    host.setAttribute('aria-hidden', 'true');
    host.innerHTML = '<div class="ms-scale">' + html(screen, opts) + '</div>';
    fit(host);
    if (hosts.indexOf(host) < 0) { hosts.push(host); if (window.ResizeObserver) new ResizeObserver(function () { fit(host); }).observe(host); }
  }
  window.addEventListener('resize', function () { hosts.forEach(fit); });
  window.MomoniScreens = { render: render, html: html, rp: rp };
})();
