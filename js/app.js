/* =========================================================
   AERO CRM — App shell: router, global actions, command palette
   ========================================================= */
(function () {
  const C = window.CRM, U = window.UI, P = window.Pages;
  const { $, $$, esc } = U;

  const titles = {
    dashboard: 'Dashboard', leads: 'Leads & Inquiries', lead: 'Lead Details', customers: 'Customers', customer: 'Customer Profile',
    pipeline: 'Sales Pipeline', followups: 'Follow-ups & Tasks', bookings: 'Bookings & Tickets', inbox: 'Communication Inbox',
    employees: 'Employee Management', performance: 'Sales Performance', targets: 'Sales Targets', notifications: 'Notifications',
    roles: 'Roles & Permissions', activity: 'Activity Logs', settings: 'CRM Settings',
  };

  function parse() {
    const [, a = 'dashboard', b] = location.hash.replace(/^#\/?/, '#/').split('/');
    if (a === 'leads' && b) return { page: 'lead', nav: 'leads', param: b };
    if (a === 'customers' && b) return { page: 'customer', nav: 'customers', param: b };
    return { page: P[a] ? a : 'dashboard', nav: P[a] ? a : 'dashboard' };
  }

  function route() {
    const { page, nav, param } = parse();
    const view = $('#view');
    view.innerHTML = `<div class="fade-in">${P[page].render(param)}</div>`;
    $$('#nav a').forEach((a) => a.classList.toggle('active', a.dataset.route === nav));
    document.title = `${titles[page]} · Aero CRM`;
    U.icons();
    P[page].mount && P[page].mount(param);
    closeSidebar();
  }

  function refreshCounts() {
    const overdue = C.followups.filter((f) => f.status === 'pending' && U.dayDiff(f.due) < 0).length;
    const unread = C.conversations.reduce((s, c) => s + c.unread, 0);
    const newLeads = C.leads.filter((l) => l.stage === 'new').length + 12;
    const set = (id, v) => { const el = $(id); el.textContent = v; el.style.display = v ? '' : 'none'; };
    set('#navOverdue', overdue); set('#navUnread', unread); set('#navLeadCount', newLeads);
    $('#bellBtn .dot').style.display = C.notifications.some((n) => n.unread) ? '' : 'none';
  }

  /* ---------- Sidebar (mobile) ---------- */
  const openSidebar = () => { $('#sidebar').classList.add('open'); $('#scrim').classList.add('show'); };
  const closeSidebar = () => { $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('show'); };
  $('#menuBtn').addEventListener('click', openSidebar);
  $('#scrim').addEventListener('click', closeSidebar);

  /* ---------- Theme ---------- */
  function isDark() { const t = document.documentElement.dataset.theme; return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; }
  function themeIcon() { $('#themeBtn').innerHTML = `<i data-lucide="${isDark() ? 'sun' : 'moon'}"></i>`; U.icons(); }
  $('#themeBtn').addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('aero-theme', next); } catch (e) {}
    themeIcon();
  });

  /* ---------- Notifications dropdown ---------- */
  $('#bellBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    const m = $('#bellMenu');
    if (m.classList.contains('open')) return m.classList.remove('open');
    const unread = C.notifications.filter((n) => n.unread).length;
    m.innerHTML = `<div class="card-head" style="padding:14px 16px"><div><h3>Notifications</h3><div class="sub">${unread} unread</div></div><a class="link" href="#/notifications">View all</a></div>
      <div class="list" style="margin-top:10px;max-height:380px;overflow-y:auto">${P.notifList(C.notifications.slice(0, 5))}</div>`;
    m.classList.add('open'); U.icons();
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-wrap')) $('#bellMenu').classList.remove('open');
    const n = e.target.closest('[data-n]');
    if (n) { const item = C.notifications.find((x) => x.id === n.dataset.n); if (item) item.unread = false; $('#bellMenu').classList.remove('open'); refreshCounts(); }
  });

  /* ---------- Global actions ---------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-action]'); if (!a) return;
    if (a.dataset.action === 'new-lead') P.openNewLead();
  });

  /* ---------- Command palette (Ctrl/⌘ + K) ---------- */
  function openPalette() {
    U.openModal(`<div class="palette" role="dialog" aria-label="Search">
      <div class="palette-input"><i data-lucide="search"></i><input id="palQ" placeholder="Search leads, customers, bookings, pages…" autocomplete="off"><kbd>Esc</kbd></div>
      <div class="palette-results" id="palRes"></div>
      <div class="palette-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div></div>`);
    let idx = 0, items = [];
    const draw = () => {
      const q = $('#palQ').value.trim().toLowerCase();
      const pages = Object.entries(titles).filter(([k]) => !['lead', 'customer'].includes(k)).map(([k, t]) => ({ group: 'Pages', icon: 'arrow-right', title: t, sub: '', href: `#/${k}` }));
      const actions = [{ group: 'Quick actions', icon: 'plus', title: 'Create new lead', sub: 'N', run: () => P.openNewLead() }, { group: 'Quick actions', icon: 'calendar-plus', title: 'Schedule follow-up', sub: '', run: () => P.openFollowupDrawer() }];
      const leads = C.leads.map((l) => ({ group: 'Leads', icon: 'inbox', title: l.name, sub: `${l.id} · ${l.destination} · ${U.stage(l.stage).name}`, href: `#/leads/${l.id}`, s: (l.name + l.phone + l.destination + l.id).toLowerCase() }));
      const custs = C.customers.map((c) => ({ group: 'Customers', icon: 'user', title: c.name, sub: `${c.tag} · ${c.phone}`, href: `#/customers/${c.id}`, s: (c.name + c.phone + c.city).toLowerCase() }));
      const bks = C.bookings.map((b) => ({ group: 'Bookings', icon: 'ticket', title: `${b.id} · ${b.customer}`, sub: `${b.from} → ${b.to} · PNR ${b.pnr}`, href: `#/customers/${b.ref}`, s: (b.id + b.customer + b.pnr).toLowerCase() }));
      items = q
        ? [...actions.filter((x) => x.title.toLowerCase().includes(q)), ...pages.filter((x) => x.title.toLowerCase().includes(q)), ...leads.filter((x) => x.s.includes(q)).slice(0, 6), ...custs.filter((x) => x.s.includes(q)).slice(0, 5), ...bks.filter((x) => x.s.includes(q)).slice(0, 4)]
        : [...actions, ...leads.slice(0, 4), ...pages.slice(0, 6)];
      idx = Math.min(idx, Math.max(0, items.length - 1));
      let last = '';
      $('#palRes').innerHTML = items.length ? items.map((it, i) => { const g = it.group !== last ? `<div class="palette-group">${it.group}</div>` : ''; last = it.group;
        return `${g}<div class="palette-item ${i === idx ? 'active' : ''}" data-i="${i}"><i data-lucide="${it.icon}"></i><div class="grow"><div class="sm strong">${esc(it.title)}</div>${it.sub ? `<div class="xs muted">${esc(it.sub)}</div>` : ''}</div></div>`; }).join('')
        : U.empty('search-x', 'No results', 'Try a name, phone number or PNR.');
      U.icons();
    };
    const go = (it) => { if (!it) return; U.closeModal(); it.run ? it.run() : (location.hash = it.href); };
    draw();
    $('#palQ').addEventListener('input', () => { idx = 0; draw(); });
    $('#palQ').addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { idx = Math.min(idx + 1, items.length - 1); draw(); e.preventDefault(); }
      if (e.key === 'ArrowUp') { idx = Math.max(idx - 1, 0); draw(); e.preventDefault(); }
      if (e.key === 'Enter') go(items[idx]);
    });
    $('#palRes').addEventListener('click', (e) => { const el = e.target.closest('[data-i]'); if (el) go(items[+el.dataset.i]); });
    $('#palRes').addEventListener('mousemove', (e) => { const el = e.target.closest('[data-i]'); if (el && +el.dataset.i !== idx) { idx = +el.dataset.i; $$('.palette-item').forEach((p) => p.classList.toggle('active', +p.dataset.i === idx)); } });
  }
  $('#searchBtn').addEventListener('click', openPalette);
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if (!typing && !$('#modalRoot').classList.contains('open') && e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey) { e.preventDefault(); P.openNewLead(); }
  });

  window.App = { route, refreshCounts };
  window.addEventListener('hashchange', route);
  if (!location.hash) history.replaceState(null, '', '#/dashboard');
  themeIcon();
  refreshCounts();
  route();
})();
