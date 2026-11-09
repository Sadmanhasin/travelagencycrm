/* =========================================================
   AERO CRM — UI helpers & reusable components
   ========================================================= */
(function () {
  const C = window.CRM;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Formatting ---------- */
  const tk = (n) => '৳' + Math.round(n).toLocaleString('en-IN');
  const tkShort = (n) => {
    if (n >= 10000000) return '৳' + (n / 10000000).toFixed(2).replace(/\.?0+$/, '') + 'Cr';
    if (n >= 100000) return '৳' + (n / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
    if (n >= 1000) return '৳' + (n / 1000).toFixed(0) + 'K';
    return '৳' + n;
  };
  const dayDiff = (iso) => { const x = new Date(iso); x.setHours(0, 0, 0, 0); return Math.round((x - C.today) / C.DAY); };
  const fmtDate = (iso, opts = { day: 'numeric', month: 'short' }) => new Date(iso).toLocaleDateString('en-GB', opts);
  const fmtTime = (iso) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const relDay = (iso) => {
    const n = dayDiff(iso);
    if (n === 0) return 'Today'; if (n === 1) return 'Tomorrow'; if (n === -1) return 'Yesterday';
    if (n < 0 && n > -7) return `${-n} days ago`; if (n > 0 && n < 7) return `In ${n} days`;
    return fmtDate(iso, { day: 'numeric', month: 'short', year: n > 200 || n < -200 ? 'numeric' : undefined });
  };
  const ago = (iso) => {
    const mins = Math.round((Date.now() - new Date(iso)) / 60000);
    if (mins < 1) return 'just now'; if (mins < 60) return `${mins}m ago`;
    const h = Math.round(mins / 60); if (h < 24) return `${h}h ago`;
    const dd = Math.round(h / 24); return dd === 1 ? 'Yesterday' : `${dd}d ago`;
  };
  const initials = (name) => name.replace(/\b(Ltd|Group)\.?/g, '').trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  const hueOf = (name) => { let h = 0; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360; return h; };

  /* ---------- Lookup ---------- */
  const agent = (id) => C.agents.find((a) => a.id === id);
  const stage = (id) => C.stages.find((s) => s.id === id);
  const source = (id) => C.sources.find((s) => s.id === id);

  /* ---------- Components ---------- */
  const avatar = (name, size = '', hue) => `<div class="avatar ${size}" style="--h:${hue ?? hueOf(name)}" title="${esc(name)}">${esc(initials(name))}</div>`;
  const agentAvatar = (id, size = 'xs') => { const a = agent(id); return a ? avatar(a.name, size, a.hue) : `<div class="avatar ${size}" style="--h:0;filter:grayscale(1)" title="Unassigned">?</div>`; };
  const agentChip = (id) => { const a = agent(id); return a
    ? `<div class="person">${avatar(a.name, 'xs', a.hue)}<span class="sm">${esc(a.name)}</span></div>`
    : `<span class="badge amber"><i data-lucide="user-x"></i>Unassigned</span>`; };

  const stageTone = { new: 'blue', contacted: 'cyan', quotation: 'violet', negotiation: 'amber', converted: 'green', lost: 'red' };
  const stageBadge = (id) => `<span class="badge ${stageTone[id]}"><span class="bdot"></span>${esc(stage(id).name)}</span>`;
  const prioIcon = { hot: 'flame', warm: 'sun', cold: 'snowflake' };
  const prio = (p) => `<span class="prio ${p}"><i data-lucide="${prioIcon[p]}"></i>${p[0].toUpperCase() + p.slice(1)}</span>`;
  const sourceChip = (s) => { const src = source(s); return `<span class="src"><i class="sw" style="background:${src.color}"></i>${esc(s)}</span>`; };
  const tagTone = { VIP: 'amber', Regular: 'blue', Corporate: 'violet' };
  const tagIcon = { VIP: 'crown', Regular: 'user', Corporate: 'building-2' };
  const tagBadge = (t) => `<span class="badge ${tagTone[t]}"><i data-lucide="${tagIcon[t]}"></i>${t}</span>`;
  const bookingTone = { Ticketed: 'green', Confirmed: 'blue', Pending: 'amber', Cancelled: 'red', Completed: '' };
  const bookingBadge = (s) => `<span class="badge ${bookingTone[s]}"><span class="bdot"></span>${s}</span>`;
  const typeIcon = { call: 'phone', whatsapp: 'message-circle', email: 'mail', meeting: 'users', note: 'sticky-note', quote: 'file-text', stage: 'arrow-right-left' };
  const typeLabel = { call: 'Call', whatsapp: 'WhatsApp', email: 'Email', meeting: 'Meeting' };
  const typeIc = (t, icon) => `<div class="type-ic ${t}"><i data-lucide="${icon || typeIcon[t]}"></i></div>`;

  const dueLabel = (iso) => {
    const n = dayDiff(iso);
    if (n < 0) return `<span class="badge red"><i data-lucide="alarm-clock"></i>${-n}d overdue</span>`;
    if (n === 0) return `<span class="badge amber"><i data-lucide="clock"></i>Today ${fmtTime(iso)}</span>`;
    return `<span class="badge outline">${relDay(iso)}</span>`;
  };

  const kpi = ({ label, value, icon, tint = 'var(--primary)', tintSoft = 'var(--primary-soft)', delta, deltaDir = 'up', foot, spark, alert }) => `
    <div class="card kpi ${alert ? 'alert' : ''}" style="--tint:${tint};--tint-soft:${tintSoft}">
      <div class="kpi-top"><span class="kpi-label">${label}</span><span class="kpi-icon"><i data-lucide="${icon}"></i></span></div>
      <div class="row between" style="align-items:flex-end">
        <div class="kpi-value">${value}</div>
        ${spark ? sparkline(spark) : ''}
      </div>
      <div class="kpi-foot">${delta ? `<span class="delta ${deltaDir}"><i data-lucide="${deltaDir === 'up' ? 'arrow-up-right' : 'arrow-down-right'}"></i>${delta}</span>` : ''}<span>${foot || ''}</span></div>
    </div>`;

  const empty = (icon, title, text = '') => `<div class="empty"><i data-lucide="${icon}"></i><div class="strong" style="color:var(--text-2)">${title}</div><div class="sm">${text}</div></div>`;

  /* ---------- Charts ---------- */
  function sparkline(values) {
    const w = 72, h = 28, max = Math.max(...values), min = Math.min(...values);
    const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - 3 - ((v - min) / (max - min || 1)) * (h - 6)]);
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="M${pts.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' L')}"/></svg>`;
  }

  function donut(items, centerValue, centerLabel) {
    const total = items.reduce((s, i) => s + i.value, 0);
    const r = 60, c = 2 * Math.PI * r, gap = 3;
    let off = 0;
    const segs = items.map((it) => {
      const len = (it.value / total) * c;
      const seg = `<circle class="seg" cx="80" cy="80" r="${r}" fill="none" stroke="${it.color}" stroke-width="18"
        stroke-dasharray="${Math.max(len - gap, 0)} ${c}" stroke-dashoffset="${-off}"
        data-tip="<b>${esc(it.label)}</b> · ${it.value} leads (${Math.round((it.value / total) * 100)}%)"></circle>`;
      off += len; return seg;
    }).join('');
    return `<div class="donut-wrap">
      <div class="donut"><svg viewBox="0 0 160 160" role="img" aria-label="${esc(centerLabel)}">${segs}</svg>
        <div class="donut-center"><div><div class="v">${centerValue}</div><div class="l">${centerLabel}</div></div></div></div>
      <div class="legend">${items.map((it) => `<div class="legend-item"><span class="sw" style="background:${it.color}"></span><span>${esc(it.label)}</span><span class="v">${it.value}</span><span class="p">${Math.round((it.value / total) * 100)}%</span></div>`).join('')}</div>
    </div>`;
  }

  function funnel(rows) {
    const max = rows[0].value;
    return `<div class="funnel">${rows.map((r, i) => {
      const pct = (r.value / max) * 100;
      const conv = i ? Math.round((r.value / rows[i - 1].value) * 100) : null;
      return `<div class="funnel-row" data-tip="<b>${esc(r.label)}</b> · ${r.value}${conv ? ` · ${conv}% from previous` : ''}">
        <div class="funnel-label"><b>${i + 1}</b>${esc(r.label)}</div>
        <div class="funnel-track"><div class="funnel-bar" style="width:${pct}%;background:${r.color}"></div></div>
        <div class="funnel-val">${r.value.toLocaleString('en-IN')}<small>${conv ? conv + '%' : ''}</small></div>
      </div>`; }).join('')}</div>`;
  }

  function bars(items, { format = (v) => v, height = 200, color = 'var(--s1)' } = {}) {
    const max = Math.max(...items.map((i) => i.value)) * 1.1;
    const lines = [0.25, 0.5, 0.75, 1].map((p) => `<div class="gridline" style="bottom:${p * (height - 28) + 28}px"></div>`).join('');
    return `<div class="bars" style="height:${height}px">${lines}${items.map((it) => `
      <div class="bar-col" data-tip="<b>${esc(it.label)}</b> · ${format(it.value)}${it.extra ? ' · ' + it.extra : ''}">
        <div class="bar" style="height:${(it.value / max) * (height - 36)}px;background:${it.color || color}"></div>
        <div class="bar-x">${esc(it.short || it.label)}</div>
      </div>`).join('')}</div>`;
  }

  function lineChart(points, { target, format = (v) => v, id = 'lc' } = {}) {
    const W = 600, H = 220, pl = 36, pr = 12, pt = 12, pb = 26;
    const vals = points.map((p) => p.value).concat(target ? [target] : []);
    const max = Math.ceil(Math.max(...vals) * 1.15), min = 0;
    const x = (i) => pl + (i / (points.length - 1)) * (W - pl - pr);
    const y = (v) => pt + (1 - (v - min) / (max - min)) * (H - pt - pb);
    const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
    const area = `${path} L${x(points.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((p) => min + p * (max - min));
    return `<svg class="linechart" id="${id}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" data-points='${JSON.stringify(points.map((p, i) => ({ x: x(i), y: y(p.value), label: p.label, v: format(p.value) })))}'>
      <defs><linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--s1)" stop-opacity=".18"/><stop offset="1" stop-color="var(--s1)" stop-opacity="0"/></linearGradient></defs>
      ${ticks.map((t) => `<line class="grid-l" x1="${pl}" x2="${W - pr}" y1="${y(t)}" y2="${y(t)}"/><text class="axis-t" x="${pl - 8}" y="${y(t) + 4}" text-anchor="end">${t % 1 ? t.toFixed(1) : t}</text>`).join('')}
      ${points.map((p, i) => `<text class="axis-t" x="${x(i)}" y="${H - 6}" text-anchor="middle">${p.label}</text>`).join('')}
      ${target ? `<line class="target-line" x1="${pl}" x2="${W - pr}" y1="${y(target)}" y2="${y(target)}"/><text class="axis-t" x="${W - pr}" y="${y(target) - 6}" text-anchor="end">Target ${format(target)}</text>` : ''}
      <path class="area" d="${area}"/><path class="line" d="${path}"/>
      ${points.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.value)}" r="${i === points.length - 1 ? 4.5 : 0}" class="hover-dot"/>`).join('')}
      <line class="xhair" x1="0" x2="0" y1="${pt}" y2="${H - pb}" style="display:none"/>
      <circle class="hover-dot hd" r="5" style="display:none"/>
      <rect x="${pl}" y="0" width="${W - pl - pr}" height="${H}" fill="transparent" class="hit"/>
    </svg>`;
  }

  /* Crosshair + tooltip for line charts */
  function bindLineChart(svg) {
    if (!svg) return;
    const pts = JSON.parse(svg.dataset.points), xh = $('.xhair', svg), hd = $('.hd', svg), hit = $('.hit', svg);
    hit.addEventListener('mousemove', (e) => {
      const r = svg.getBoundingClientRect(), vbx = ((e.clientX - r.left) / r.width) * 600;
      const p = pts.reduce((a, b) => (Math.abs(b.x - vbx) < Math.abs(a.x - vbx) ? b : a));
      xh.setAttribute('x1', p.x); xh.setAttribute('x2', p.x); xh.style.display = '';
      hd.setAttribute('cx', p.x); hd.setAttribute('cy', p.y); hd.style.display = '';
      showTip(`<b>${p.label}</b> · ${p.v}`, r.left + (p.x / 600) * r.width, r.top + (p.y / 220) * r.height);
    });
    hit.addEventListener('mouseleave', () => { xh.style.display = 'none'; hd.style.display = 'none'; hideTip(); });
  }

  /* ---------- Tooltip (global, delegated via data-tip) ---------- */
  let tipEl;
  function showTip(html, x, y) {
    if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'tooltip'; document.body.appendChild(tipEl); }
    tipEl.innerHTML = html; tipEl.style.left = x + 'px'; tipEl.style.top = y + 'px'; tipEl.classList.add('show');
  }
  function hideTip() { tipEl && tipEl.classList.remove('show'); }
  document.addEventListener('mouseover', (e) => {
    const t = e.target.closest('[data-tip]'); if (!t) return;
    const r = t.getBoundingClientRect();
    const bar = t.querySelector('.bar, .funnel-bar');
    const anchor = bar ? bar.getBoundingClientRect() : r;
    showTip(t.dataset.tip, anchor.left + anchor.width / 2, (t.tagName === 'circle' ? e.clientY : anchor.top));
  });
  document.addEventListener('mouseout', (e) => { if (e.target.closest('[data-tip]')) hideTip(); });

  /* ---------- Toast ---------- */
  function toast(msg, icon = 'check-circle-2') {
    const el = document.createElement('div'); el.className = 'toast';
    el.innerHTML = `<i data-lucide="${icon}"></i>${esc(msg)}`;
    $('#toastRoot').appendChild(el); icons();
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 220); }, 2600);
  }

  /* ---------- Modal / drawer ---------- */
  function openModal(html) {
    const root = $('#modalRoot');
    root.innerHTML = `<div class="backdrop" data-close></div>${html}`;
    root.classList.add('open'); icons();
    root.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeModal));
    const f = root.querySelector('input:not([type=radio]):not([type=checkbox]), textarea'); f && setTimeout(() => f.focus(), 60);
    return root;
  }
  function closeModal() { const r = $('#modalRoot'); r.classList.remove('open'); r.innerHTML = ''; }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  function drawer(title, body, foot) {
    return openModal(`<div class="drawer" role="dialog" aria-modal="true">
      <div class="drawer-head"><h3>${title}</h3><button class="icon-btn" data-close aria-label="Close"><i data-lucide="x"></i></button></div>
      <div class="drawer-body">${body}</div>
      <div class="drawer-foot">${foot}</div></div>`);
  }

  function icons() { window.lucide && lucide.createIcons({ attrs: { 'aria-hidden': 'true' } }); }

  window.UI = {
    $, $$, esc, tk, tkShort, dayDiff, fmtDate, fmtTime, relDay, ago, initials, hueOf,
    agent, stage, source, avatar, agentAvatar, agentChip, stageBadge, stageTone, prio, sourceChip, tagBadge, bookingBadge,
    typeIcon, typeLabel, typeIc, dueLabel, kpi, empty, sparkline, donut, funnel, bars, lineChart, bindLineChart,
    toast, openModal, closeModal, drawer, icons, showTip, hideTip,
  };
})();
