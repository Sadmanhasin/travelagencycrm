/* =========================================================
   AERO CRM — Pages
   Each page: { render(param) -> html, mount(param) -> void }
   ========================================================= */
(function () {
  const C = window.CRM, U = window.UI;
  const { $, $$, esc, tk, tkShort, dayDiff, fmtDate, fmtTime, relDay, ago, avatar, agentAvatar, agentChip, stageBadge, prio, sourceChip, tagBadge, bookingBadge, typeIc, dueLabel, kpi } = U;

  const head = (title, sub, actions = '', crumbs = '') => `
    <div class="page-head">
      <div>${crumbs}<h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div>
      <div class="row wrap">${actions}</div>
    </div>`;
  const cardHead = (title, sub = '', right = '') => `<div class="card-head"><div><h3>${title}</h3>${sub ? `<div class="sub">${sub}</div>` : ''}</div>${right}</div>`;
  const crumb = (items) => `<div class="crumbs">${items.map((it, i) => i < items.length - 1 ? `<a href="${it[1]}">${it[0]}</a><i data-lucide="chevron-right"></i>` : `<span>${it[0]}</span>`).join('')}</div>`;
  const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };
  const pendingFU = () => C.followups.filter((f) => f.status === 'pending');
  const overdueFU = () => pendingFU().filter((f) => dayDiff(f.due) < 0);
  const todayFU = () => C.followups.filter((f) => dayDiff(f.due) === 0);
  const linkFor = (ref) => (ref.startsWith('L-') ? `#/leads/${ref}` : `#/customers/${ref}`);
  const agentOptions = (sel, withAll = 'All agents') => `${withAll ? `<option value="">${withAll}</option>` : ''}${C.agents.map((a) => `<option value="${a.id}" ${sel === a.id ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}`;

  const Pages = {};

  /* =====================================================
     1. DASHBOARD
     ===================================================== */
  Pages.dashboard = {
    render() {
      const fuToday = todayFU();
      const upcoming = C.bookings.filter((b) => dayDiff(b.travel) >= 0 && dayDiff(b.travel) <= 14 && b.status !== 'Cancelled').sort((a, b) => new Date(a.travel) - new Date(b.travel)).slice(0, 5);
      const overdue = overdueFU().length;
      const pipe = [['new', 18, 1420000], ['contacted', 12, 1180000], ['quotation', 9, 1960000], ['negotiation', 6, 1340000], ['converted', 24, 3850000], ['lost', 4, 390000]];
      const pipeTotal = pipe.reduce((s, p) => s + p[1], 0);
      const topAgents = [...C.agents].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

      return `
      ${head(`${greeting()}, Arif 👋`, `Here's what's happening at Aero Travels today · ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`,
        `<div class="segmented" id="rangeSeg"><button>Today</button><button>Week</button><button class="active">Month</button></div>
         <button class="btn"><i data-lucide="download"></i>Export</button>`)}

      <div class="ribbon mb">
        ${[
          ['inbox', 'Lead', '323', 'New inquiries this month', 'var(--primary)', 'var(--primary-soft)'],
          ['messages-square', 'Relationship', '186', 'Active conversations', 'var(--info)', 'var(--info-soft)'],
          ['badge-check', 'Conversion', '105', 'Bookings confirmed', 'var(--success)', 'var(--success-soft)'],
          ['repeat', 'Retention', '39%', 'Repeat customers', 'var(--violet)', 'var(--violet-soft)'],
        ].map((s, i) => `<div class="ribbon-step" style="--tint:${s[4]};--tint-soft:${s[5]}">
            <span class="kpi-icon"><i data-lucide="${s[0]}"></i></span>
            <div><div class="xs muted strong" style="text-transform:uppercase;letter-spacing:.06em">${s[1]}</div><div class="n">${s[2]}</div><div class="l">${s[3]}</div></div>
            ${i < 3 ? '<span class="arrow"><i data-lucide="chevron-right"></i></span>' : ''}
          </div>`).join('')}
      </div>

      <div class="grid g-4 mb">
        ${kpi({ label: 'Total Leads', value: '1,250', icon: 'users-round', delta: '12.4%', foot: 'vs last month', spark: [40, 44, 42, 50, 55, 53, 62] })}
        ${kpi({ label: 'New Inquiries', value: '86', icon: 'inbox', tint: 'var(--info)', tintSoft: 'var(--info-soft)', delta: '8.1%', foot: 'this week', spark: [8, 12, 10, 14, 11, 15, 16] })}
        ${kpi({ label: 'Active Customers', value: '540', icon: 'heart-handshake', tint: 'var(--violet)', tintSoft: 'var(--violet-soft)', delta: '4.6%', foot: 'vs last month', spark: [480, 492, 500, 510, 521, 530, 540] })}
        ${kpi({ label: 'Conversion Rate', value: '32.5%', icon: 'percent', tint: 'var(--success)', tintSoft: 'var(--success-soft)', delta: '2.3 pts', foot: 'vs last month', spark: [26, 27, 29, 28, 30, 31, 32.5] })}
        ${kpi({ label: 'Pending Follow-ups', value: '28', icon: 'calendar-clock', tint: 'var(--warning)', tintSoft: 'var(--warning-soft)', foot: `${fuToday.filter((f) => f.status === 'pending').length} due today` })}
        ${kpi({ label: 'Overdue Follow-ups', value: String(overdue).padStart(2, '0'), icon: 'alarm-clock', tint: 'var(--danger)', tintSoft: 'var(--danger-soft)', delta: '3', deltaDir: 'down', foot: 'needs attention now', alert: true })}
        ${kpi({ label: 'Converted Leads', value: '105', icon: 'badge-check', tint: 'var(--success)', tintSoft: 'var(--success-soft)', delta: '14.1%', foot: 'this month', spark: [62, 70, 68, 81, 88, 96, 105] })}
        ${kpi({ label: 'Sales Revenue', value: '৳12.5L', icon: 'banknote', delta: '10.6%', foot: 'of ৳15L target', spark: [8.2, 9.1, 8.7, 10.4, 11.3, 12.5] })}
      </div>

      <div class="grid g-2 mb">
        <div class="card">
          ${cardHead('Lead Conversion Funnel', 'This month · 32.5% inquiry → booking', '<a class="link" href="#/pipeline">Open pipeline<i data-lucide="arrow-right"></i></a>')}
          <div class="card-body">${U.funnel([
            { label: 'New Inquiry', value: 323, color: 'var(--seq-1)' },
            { label: 'Contacted', value: 262, color: 'var(--seq-2)' },
            { label: 'Quotation Sent', value: 188, color: 'var(--seq-3)' },
            { label: 'Negotiation', value: 139, color: 'var(--seq-4)' },
            { label: 'Converted', value: 105, color: 'var(--seq-5)' },
          ])}</div>
        </div>
        <div class="card">
          ${cardHead('Leads by Source', 'Where this month’s inquiries came from', '<a class="link" href="#/leads">View leads<i data-lucide="arrow-right"></i></a>')}
          <div class="card-body" style="padding-top:22px">${U.donut([
            { label: 'Facebook', value: 112, color: 'var(--s1)' },
            { label: 'WhatsApp', value: 86, color: 'var(--s3)' },
            { label: 'Website', value: 58, color: 'var(--s2)' },
            { label: 'Phone', value: 41, color: 'var(--s4)' },
            { label: 'Referral', value: 26, color: 'var(--s5)' },
          ], '323', 'leads')}</div>
        </div>
      </div>

      <div class="grid g-main-side mb">
        <div class="card">
          ${cardHead('Sales Pipeline', `${pipeTotal} open & closed deals · ${tkShort(pipe.reduce((s, p) => s + p[2], 0))} total value`, '<a class="link" href="#/pipeline">Manage<i data-lucide="arrow-right"></i></a>')}
          <div class="card-body">
            <div class="stacked mb" style="height:12px">${pipe.map((p) => `<span style="flex:${p[1]};background:${U.stage(p[0]).color}" data-tip="<b>${U.stage(p[0]).name}</b> · ${p[1]} deals"></span>`).join('')}</div>
            <div class="grid g-3" style="gap:12px">
              ${pipe.map((p) => `<a href="#/pipeline" class="info-cell" style="display:block">
                <div class="l"><span style="width:8px;height:8px;border-radius:50%;background:${U.stage(p[0]).color}"></span>${U.stage(p[0]).name}</div>
                <div class="row between" style="margin-top:4px"><span class="kpi-value" style="font-size:20px">${String(p[1]).padStart(2, '0')}</span><span class="sm muted num">${tkShort(p[2])}</span></div>
              </a>`).join('')}
            </div>
            <div class="grid g-3" style="gap:12px;margin-top:16px;padding-top:16px;border-top:1px dashed var(--border)">
              ${[['Win rate', '85.7%', 'converted vs lost'], ['Avg. deal cycle', '4.2 days', 'inquiry → booking'], ['Avg. deal size', '৳1.6L', 'converted deals']].map((x) => `<div><div class="xs muted">${x[0]}</div><div class="strong" style="font-size:16px">${x[1]}</div><div class="xs muted">${x[2]}</div></div>`).join('')}
            </div>
          </div>
        </div>
        <div class="card">
          ${cardHead('Top Performers', 'Revenue this month', '<a class="link" href="#/performance">Report<i data-lucide="arrow-right"></i></a>')}
          <div class="card-body" style="display:flex;flex-direction:column;gap:14px">
            ${topAgents.map((a, i) => `<div class="row">
              <span class="rank r${i + 1}">${i + 1}</span>${avatar(a.name, 'sm', a.hue)}
              <div class="grow"><div class="row between"><span class="strong sm ellipsis">${esc(a.name)}</span><span class="sm strong num">${tkShort(a.revenue)}</span></div>
              <div class="row" style="gap:8px;margin-top:4px"><div class="progress grow"><span style="width:${Math.min(100, (a.achieved / a.target) * 100)}%"></span></div><span class="xs muted num">${Math.round((a.achieved / a.target) * 100)}%</span></div></div>
            </div>`).join('')}
          </div>
        </div>
      </div>

      <div class="grid g-3">
        <div class="card">
          ${cardHead("Today's Follow-ups", `${fuToday.filter((f) => f.status === 'done').length} of ${fuToday.length} completed`, '<a class="link" href="#/followups">All<i data-lucide="arrow-right"></i></a>')}
          <div class="list" style="margin-top:8px" id="dashFU">
            ${fuToday.map((f) => `<div class="list-item ${f.status === 'done' ? 'done' : ''}">
              <input type="checkbox" class="cb" data-fu="${f.id}" ${f.status === 'done' ? 'checked' : ''} aria-label="Mark done">
              ${typeIc(f.type)}
              <a class="grow" href="${linkFor(f.ref)}"><div class="name strong sm ellipsis">${esc(f.name)}</div><div class="xs muted ellipsis">${esc(f.note)}</div></a>
              <span class="xs muted num">${fmtTime(f.due)}</span>
            </div>`).join('')}
          </div>
        </div>
        <div class="card">
          ${cardHead('Recent Activity', 'Across your team', '<a class="link" href="#/activity">Logs<i data-lucide="arrow-right"></i></a>')}
          <div class="card-body"><div class="timeline">
            ${C.activities.slice(0, 6).map((a) => `<div class="tl-item">${typeIc(a.type, a.icon)}
              <div class="tl-body"><div class="tl-title sm"><b>${esc(U.agent(a.who).name)}</b> ${a.action} <b>${esc(a.target)}</b> ${a.extra ? `<span class="muted">· ${esc(a.extra)}</span>` : ''}</div><div class="tl-time">${ago(a.t)}</div></div></div>`).join('')}
          </div></div>
        </div>
        <div class="card">
          ${cardHead('Upcoming Customer Travel', 'Next 14 days', '<a class="link" href="#/bookings">Bookings<i data-lucide="arrow-right"></i></a>')}
          <div class="list" style="margin-top:8px">
            ${upcoming.map((b) => { const n = dayDiff(b.travel); return `<a class="list-item" href="#/customers/${b.ref}">
              <div class="info-cell" style="padding:6px 8px;text-align:center;min-width:48px"><div class="xs muted">${fmtDate(b.travel, { month: 'short' })}</div><div class="strong num">${fmtDate(b.travel, { day: '2-digit' })}</div></div>
              <div class="grow"><div class="strong sm ellipsis">${esc(b.customer)}</div><div class="xs muted">${b.from} → ${b.to} · ${esc(b.airline)} · ${b.pax} pax</div></div>
              <span class="badge ${n <= 3 ? 'amber' : 'outline'}">${n === 0 ? 'Today' : `In ${n}d`}</span></a>`; }).join('')}
          </div>
        </div>
      </div>`;
    },
    mount() {
      $$('#rangeSeg button').forEach((b) => b.addEventListener('click', () => { $$('#rangeSeg button').forEach((x) => x.classList.remove('active')); b.classList.add('active'); }));
      $$('#dashFU [data-fu]').forEach((cb) => cb.addEventListener('change', () => {
        const f = C.followups.find((x) => x.id === cb.dataset.fu); f.status = cb.checked ? 'done' : 'pending';
        cb.closest('.list-item').classList.toggle('done', cb.checked);
        U.toast(cb.checked ? `Follow-up with ${f.name} completed` : 'Marked as pending', cb.checked ? 'check-circle-2' : 'rotate-ccw');
        window.App.refreshCounts();
      }));
    },
  };

  /* =====================================================
     2. LEADS & INQUIRIES
     ===================================================== */
  const leadState = { tab: 'all', q: '', source: '', priority: '', agent: '', selected: new Set() };
  const leadTabs = [
    ['all', 'All leads', () => true],
    ['new', 'New', (l) => l.stage === 'new'],
    ['hot', 'Hot', (l) => l.priority === 'hot' && !['converted', 'lost'].includes(l.stage)],
    ['due', 'Follow-up due', (l) => l.followUp && dayDiff(l.followUp) <= 0 && !['converted', 'lost'].includes(l.stage)],
    ['unassigned', 'Unassigned', (l) => !l.agent],
    ['closed', 'Closed', (l) => ['converted', 'lost'].includes(l.stage)],
  ];
  function filteredLeads() {
    const t = leadTabs.find((x) => x[0] === leadState.tab)[2];
    const q = leadState.q.toLowerCase();
    return C.leads.filter((l) => t(l)
      && (!q || [l.name, l.phone, l.destination, l.id].some((v) => v.toLowerCase().includes(q)))
      && (!leadState.source || l.source === leadState.source)
      && (!leadState.priority || l.priority === leadState.priority)
      && (!leadState.agent || (leadState.agent === 'none' ? !l.agent : l.agent === leadState.agent)));
  }
  function leadRows() {
    const rows = filteredLeads();
    if (!rows.length) return `<tr><td colspan="10">${U.empty('search-x', 'No leads match these filters', 'Try clearing a filter or searching by phone number.')}</td></tr>`;
    return rows.map((l) => `<tr class="clickable ${leadState.selected.has(l.id) ? 'selected' : ''}" data-id="${l.id}">
      <td class="w-cb"><input type="checkbox" class="cb row-cb" data-id="${l.id}" ${leadState.selected.has(l.id) ? 'checked' : ''} aria-label="Select"></td>
      <td><div class="person">${avatar(l.name, 'sm')}<div style="min-width:0"><div class="name">${esc(l.name)}</div><div class="meta">${l.id} · ${esc(l.phone)}</div></div></div></td>
      <td><div class="strong sm">${esc(l.destination)}</div><div class="xs muted">${fmtDate(l.travelDate, { day: 'numeric', month: 'short', year: 'numeric' })} · ${l.tripType}</div></td>
      <td class="num">${tk(l.budget)}<div class="xs muted">${l.pax} pax</div></td>
      <td>${sourceChip(l.source)}</td>
      <td>${prio(l.priority)}</td>
      <td>${stageBadge(l.stage)}</td>
      <td>${agentChip(l.agent)}</td>
      <td>${l.followUp ? dueLabel(l.followUp) : '<span class="muted">—</span>'}</td>
      <td><div class="row-actions">
        <button class="icon-btn sm" title="Call" data-act="call"><i data-lucide="phone"></i></button>
        <button class="icon-btn sm" title="WhatsApp" data-act="wa"><i data-lucide="message-circle"></i></button>
        <button class="icon-btn sm" title="Open"><i data-lucide="chevron-right"></i></button>
      </div></td></tr>`).join('');
  }
  Pages.leads = {
    render() {
      const counts = leadTabs.map((t) => C.leads.filter(t[2]).length);
      return `
      ${head('Leads & Inquiries', 'Capture, qualify and assign every travel inquiry in one place.',
        `<button class="btn"><i data-lucide="upload"></i>Import</button><a class="btn" href="#/pipeline"><i data-lucide="kanban"></i>Board view</a><button class="btn primary" data-action="new-lead"><i data-lucide="plus"></i>New Lead</button>`)}
      <div class="tabs" id="leadTabs">${leadTabs.map((t, i) => `<button class="tab ${leadState.tab === t[0] ? 'active' : ''}" data-tab="${t[0]}">${t[1]}<span class="pill">${counts[i]}</span></button>`).join('')}</div>
      <div class="card">
        <div class="toolbar">
          <div class="input-icon"><i data-lucide="search"></i><input class="input" id="leadQ" placeholder="Search name, phone, destination…" value="${esc(leadState.q)}"></div>
          <select class="select" id="fSource"><option value="">All sources</option>${C.sources.map((s) => `<option ${leadState.source === s.id ? 'selected' : ''}>${s.id}</option>`).join('')}</select>
          <select class="select" id="fPrio"><option value="">Any priority</option>${['hot', 'warm', 'cold'].map((p) => `<option value="${p}" ${leadState.priority === p ? 'selected' : ''}>${p[0].toUpperCase() + p.slice(1)}</option>`).join('')}</select>
          <select class="select" id="fAgent">${agentOptions(leadState.agent)}<option value="none" ${leadState.agent === 'none' ? 'selected' : ''}>Unassigned</option></select>
          <button class="btn ghost sm" id="clearF"><i data-lucide="x"></i>Clear</button>
          <span class="sm muted" style="margin-left:auto" id="leadCount"></span>
        </div>
        <div class="bulk-bar" id="bulkBar">
          <span id="bulkN"></span>
          <select class="select" id="bulkAgent" style="width:auto;height:32px;background-color:var(--surface)">${agentOptions('', 'Assign to…')}</select>
          <button class="btn sm" id="bulkAssign"><i data-lucide="user-check"></i>Assign</button>
          <button class="btn sm" id="bulkFU"><i data-lucide="calendar-plus"></i>Schedule follow-up</button>
          <button class="btn ghost sm" id="bulkClear" style="margin-left:auto">Clear selection</button>
        </div>
        <div class="table-wrap"><table class="table">
          <thead><tr><th class="w-cb"><input type="checkbox" class="cb" id="cbAll" aria-label="Select all"></th><th>Lead</th><th>Destination</th><th>Budget</th><th>Source</th><th>Priority</th><th>Status</th><th>Agent</th><th>Follow-up</th><th></th></tr></thead>
          <tbody id="leadBody"></tbody>
        </table></div>
        <div class="table-foot"><span id="leadFoot"></span><div class="pager"><button><i data-lucide="chevron-left" style="width:14px"></i></button><button class="active">1</button><button>2</button><button>3</button><button><i data-lucide="chevron-right" style="width:14px"></i></button></div></div>
      </div>`;
    },
    mount() {
      const body = $('#leadBody');
      const draw = () => {
        body.innerHTML = leadRows(); U.icons();
        const n = filteredLeads().length;
        $('#leadCount').textContent = `${n} result${n === 1 ? '' : 's'}`;
        $('#leadFoot').textContent = `Showing ${n} of 1,250 leads`;
        const s = leadState.selected.size;
        $('#bulkBar').classList.toggle('show', s > 0); $('#bulkN').textContent = `${s} selected`;
      };
      draw();
      $$('#leadTabs .tab').forEach((b) => b.addEventListener('click', () => { leadState.tab = b.dataset.tab; $$('#leadTabs .tab').forEach((x) => x.classList.toggle('active', x === b)); draw(); }));
      $('#leadQ').addEventListener('input', (e) => { leadState.q = e.target.value; draw(); });
      $('#fSource').addEventListener('change', (e) => { leadState.source = e.target.value; draw(); });
      $('#fPrio').addEventListener('change', (e) => { leadState.priority = e.target.value; draw(); });
      $('#fAgent').addEventListener('change', (e) => { leadState.agent = e.target.value; draw(); });
      $('#clearF').addEventListener('click', () => { Object.assign(leadState, { q: '', source: '', priority: '', agent: '' }); window.App.route(); });
      body.addEventListener('click', (e) => {
        const tr = e.target.closest('tr[data-id]'); if (!tr) return;
        if (e.target.classList.contains('row-cb')) {
          const id = e.target.dataset.id; e.target.checked ? leadState.selected.add(id) : leadState.selected.delete(id);
          tr.classList.toggle('selected', e.target.checked); draw(); return;
        }
        const act = e.target.closest('[data-act]');
        if (act) { const l = C.leads.find((x) => x.id === tr.dataset.id); U.toast(act.dataset.act === 'call' ? `Calling ${l.name}…` : `Opening WhatsApp chat with ${l.name}`, act.dataset.act === 'call' ? 'phone' : 'message-circle'); return; }
        location.hash = `#/leads/${tr.dataset.id}`;
      });
      $('#cbAll').addEventListener('change', (e) => { filteredLeads().forEach((l) => (e.target.checked ? leadState.selected.add(l.id) : leadState.selected.delete(l.id))); draw(); });
      $('#bulkClear').addEventListener('click', () => { leadState.selected.clear(); $('#cbAll').checked = false; draw(); });
      $('#bulkAssign').addEventListener('click', () => {
        const a = $('#bulkAgent').value; if (!a) return U.toast('Choose an agent first', 'info');
        leadState.selected.forEach((id) => { C.leads.find((l) => l.id === id).agent = a; });
        U.toast(`${leadState.selected.size} lead(s) assigned to ${U.agent(a).name}`); leadState.selected.clear(); $('#cbAll').checked = false; draw();
      });
      $('#bulkFU').addEventListener('click', () => U.toast(`Follow-up scheduled for ${leadState.selected.size} lead(s) tomorrow 11:00 AM`, 'calendar-check'));
    },
  };

  /* =====================================================
     3. LEAD DETAILS
     ===================================================== */
  const journeySteps = ['New Inquiry', 'Lead Assigned', 'Contacted', 'Quotation Sent', 'Follow-up', 'Converted', 'Retention'];
  const journeyIndex = (l) => ({ new: l.agent ? 1 : 0, contacted: 2, quotation: 3, negotiation: 4, converted: 6, lost: 4 }[l.stage]);
  function leadTimeline(l) {
    if (!l.timeline) {
      const ag = U.agent(l.agent);
      const t = [{ type: 'note', icon: 'inbox', title: `Inquiry received via <b>${l.source}</b>`, time: l.created, note: l.notes }];
      if (ag) t.unshift({ type: 'stage', icon: 'user-check', title: `Assigned to <b>${esc(ag.name)}</b> by Arif Hasan`, time: l.created });
      const idx = journeyIndex(l);
      if (idx >= 2) t.unshift({ type: 'call', title: `<b>${esc(ag?.name || 'Agent')}</b> called the customer · 4m 18s`, time: new Date(new Date(l.created).getTime() + 3 * 3600e3).toISOString(), note: 'Discussed travel dates, preferred airline and budget. Customer is flexible by ±2 days.' });
      if (idx >= 3) t.unshift({ type: 'quote', title: `Quotation sent · <b>${tk(l.budget * 0.96)}</b>`, time: new Date(new Date(l.created).getTime() + 26 * 3600e3).toISOString() });
      if (idx >= 4 && l.stage !== 'converted') t.unshift({ type: 'whatsapp', title: 'WhatsApp follow-up sent', time: new Date(new Date(l.created).getTime() + 50 * 3600e3).toISOString(), note: 'Customer asked for a small discount on the total package.' });
      if (l.stage === 'converted') t.unshift({ type: 'whatsapp', icon: 'badge-check', title: `<b>Converted</b> — booking confirmed`, time: new Date(new Date(l.created).getTime() + 60 * 3600e3).toISOString() });
      if (l.stage === 'lost') t.unshift({ type: 'meeting', icon: 'x-circle', title: 'Marked as <b>Lost</b>', time: new Date(new Date(l.created).getTime() + 60 * 3600e3).toISOString(), note: l.notes });
      l.timeline = t;
    }
    return l.timeline;
  }
  const tlHtml = (items) => items.map((t) => `<div class="tl-item">${typeIc(t.type, t.icon)}<div class="tl-body"><div class="tl-title">${t.title}</div><div class="tl-time">${relDay(t.time)} · ${fmtTime(t.time)}</div>${t.note ? `<div class="tl-note">${esc(t.note)}</div>` : ''}</div></div>`).join('');

  Pages.lead = {
    render(id) {
      const l = C.leads.find((x) => x.id === id);
      if (!l) return U.empty('search-x', 'Lead not found', `<a class="link" href="#/leads">Back to leads</a>`);
      const ji = journeyIndex(l);
      const fus = C.followups.filter((f) => f.ref === l.id);
      const nextFu = fus.filter((f) => f.status === 'pending').sort((a, b) => new Date(a.due) - new Date(b.due))[0];
      return `
      ${crumb([['Leads & Inquiries', '#/leads'], [l.id]])}
      <div class="card mb">
        <div class="profile-head">
          ${avatar(l.name, 'lg')}
          <div class="grow">
            <h2>${esc(l.name)} ${prio(l.priority)} ${stageBadge(l.stage)}</h2>
            <div class="contact-line"><span><i data-lucide="phone"></i>${esc(l.phone)}</span><span><i data-lucide="mail"></i>${esc(l.email)}</span><span><i data-lucide="calendar"></i>Inquiry ${relDay(l.created).toLowerCase()}</span>${sourceChip(l.source)}</div>
          </div>
          <div class="row wrap">
            <button class="btn" data-q="call"><i data-lucide="phone"></i>Call</button>
            <button class="btn" data-q="wa"><i data-lucide="message-circle"></i>WhatsApp</button>
            <button class="btn" data-q="mail"><i data-lucide="mail"></i>Email</button>
            ${l.stage !== 'converted' ? `<button class="btn success" id="convertBtn"><i data-lucide="badge-check"></i>Convert to Booking</button>` : `<a class="btn primary" href="#/customers"><i data-lucide="user"></i>View customer</a>`}
          </div>
        </div>
        <div class="card-body" style="border-top:1px solid var(--border);padding-top:20px">
          <div class="journey">${journeySteps.map((s, i) => `<div class="j-step ${i < ji ? 'done' : i === ji ? (l.stage === 'lost' ? 'lost' : 'current') : ''}"><div class="j-dot">${i < ji ? '<i data-lucide="check"></i>' : l.stage === 'lost' && i === ji ? '<i data-lucide="x"></i>' : i + 1}</div><div class="j-label">${s}</div></div>`).join('')}</div>
        </div>
      </div>

      <div class="grid g-side-main-side">
        <div class="stack" style="gap:20px">
          <div class="card">
            ${cardHead('Trip Requirements')}
            <div class="card-body"><div class="info-grid">
              <div class="info-cell"><div class="l"><i data-lucide="plane-takeoff"></i>Route</div><div class="v">${l.from} → ${esc(l.destination)}</div></div>
              <div class="info-cell"><div class="l"><i data-lucide="calendar-days"></i>Travel date</div><div class="v">${fmtDate(l.travelDate, { day: 'numeric', month: 'short', year: 'numeric' })}</div></div>
              <div class="info-cell"><div class="l"><i data-lucide="wallet"></i>Budget</div><div class="v num">${tk(l.budget)}</div></div>
              <div class="info-cell"><div class="l"><i data-lucide="users"></i>Passengers</div><div class="v">${l.pax} ${l.pax > 1 ? 'adults' : 'adult'}</div></div>
              <div class="info-cell"><div class="l"><i data-lucide="repeat"></i>Trip type</div><div class="v">${l.tripType}</div></div>
              <div class="info-cell"><div class="l"><i data-lucide="armchair"></i>Class</div><div class="v">${/business/i.test(l.notes) || l.budget / l.pax > 150000 ? 'Business' : 'Economy'}</div></div>
            </div>
            <div class="tl-note" style="margin-top:14px"><div class="xs muted strong" style="margin-bottom:4px">LEAD NOTES</div>${esc(l.notes)}</div></div>
          </div>
          <div class="card">
            ${cardHead('Assignment & Status')}
            <div class="card-body stack" style="gap:14px">
              <div class="field"><label>Sales agent</label><select class="select" id="ldAgent">${agentOptions(l.agent, l.agent ? '' : 'Unassigned')}</select></div>
              <div class="field"><label>Pipeline stage</label><select class="select" id="ldStage">${C.stages.map((s) => `<option value="${s.id}" ${l.stage === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}</select></div>
              <div class="field"><label>Priority</label><div class="segmented" id="ldPrio">${['hot', 'warm', 'cold'].map((p) => `<button data-p="${p}" class="${l.priority === p ? 'active' : ''}">${prio(p)}</button>`).join('')}</div></div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body" style="padding-bottom:0">
            <div class="tabs" id="compTabs" style="margin-bottom:12px">
              <button class="tab active" data-m="note"><i data-lucide="sticky-note"></i>Note</button>
              <button class="tab" data-m="call"><i data-lucide="phone"></i>Log call</button>
              <button class="tab" data-m="followup"><i data-lucide="calendar-plus"></i>Follow-up</button>
              <button class="tab" data-m="quote"><i data-lucide="file-text"></i>Quotation</button>
            </div>
            <textarea class="textarea" id="compText" placeholder="Write a note about this lead… Use @ to mention a teammate"></textarea>
            <div class="row between" style="margin:10px 0 18px">
              <div class="row" id="compExtra" style="gap:8px"></div>
              <button class="btn primary" id="compSave"><i data-lucide="send"></i>Save</button>
            </div>
          </div>
          <div class="card-body" style="border-top:1px solid var(--border)">
            <div class="section-label">Activity timeline</div>
            <div class="timeline" id="leadTL">${tlHtml(leadTimeline(l))}</div>
          </div>
        </div>

        <div class="stack" style="gap:20px">
          <div class="next-fu" ${nextFu && dayDiff(nextFu.due) < 0 ? 'style="background:linear-gradient(135deg,#c9302c,#e0584f)"' : ''}>
            <div class="row between"><span class="muted-w">${nextFu && dayDiff(nextFu.due) < 0 ? `Overdue by ${-dayDiff(nextFu.due)} day${dayDiff(nextFu.due) < -1 ? 's' : ''}` : 'Next follow-up'}</span><i data-lucide="${nextFu && dayDiff(nextFu.due) < 0 ? 'alarm-clock' : 'bell-ring'}"></i></div>
            ${nextFu ? `<div style="font-size:18px;font-weight:700;margin:6px 0 2px">${relDay(nextFu.due)}, ${fmtTime(nextFu.due)}</div><div class="muted-w">${U.typeLabel[nextFu.type]} · ${esc(nextFu.note)}</div>`
              : `<div style="font-size:16px;font-weight:600;margin:6px 0 2px">Nothing scheduled</div><div class="muted-w">Keep the relationship warm — schedule the next touchpoint.</div>`}
            <div class="row" style="margin-top:14px;gap:8px"><button class="btn sm" id="fuDone"><i data-lucide="check"></i>Done</button><button class="btn sm" id="fuSnooze"><i data-lucide="clock"></i>Tomorrow</button></div>
          </div>
          <div class="card">
            ${cardHead('Quotations', '', '<button class="icon-btn sm" title="New quotation"><i data-lucide="plus"></i></button>')}
            <div class="card-body">
              ${ji >= 3 ? `
              <div class="quote">${typeIc('quote')}<div class="grow"><div class="strong sm">Option A · ${l.from}–${esc(l.destination)}</div><div class="xs muted">Sent ${relDay(l.created)} · valid 48h</div></div><span class="strong sm num">${tkShort(l.budget * 0.96)}</span></div>
              <div class="quote">${typeIc('quote')}<div class="grow"><div class="strong sm">Option B · with hotel</div><div class="xs muted">Draft</div></div><span class="strong sm num">${tkShort(l.budget * 1.12)}</span></div>`
              : U.empty('file-plus', 'No quotation yet', 'Create one once requirements are confirmed.')}
            </div>
          </div>
          <div class="card">
            ${cardHead('Assigned Agent')}
            <div class="card-body">${l.agent ? (() => { const a = U.agent(l.agent); return `<div class="person">${avatar(a.name, '', a.hue)}<div><div class="name">${esc(a.name)}</div><div class="meta">${a.role} · replies in ~${a.avgResponse}</div></div></div>`; })() : `<div class="tl-note" style="margin:0">This lead hasn't been assigned yet. Pick an agent on the left so it doesn't go cold.</div>`}</div>
          </div>
        </div>
      </div>`;
    },
    mount(id) {
      const l = C.leads.find((x) => x.id === id); if (!l) return;
      let mode = 'note';
      const extra = {
        note: '',
        call: `<select class="select" style="width:auto;height:32px"><option>Connected</option><option>No answer</option><option>Busy</option></select><input class="input" style="width:110px;height:32px" placeholder="Duration">`,
        followup: `<select class="select" style="width:auto;height:32px" id="fuType"><option value="call">Call</option><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="meeting">Meeting</option></select><input type="date" class="input" style="width:auto;height:32px" id="fuDate" value="${new Date(C.today.getTime() + C.DAY).toISOString().slice(0, 10)}">`,
        quote: `<input class="input" style="width:140px;height:32px" placeholder="Amount (৳)" id="qAmt">`,
      };
      const ph = { note: 'Write a note about this lead…', call: 'What did you discuss on the call?', followup: 'What should happen on the next follow-up?', quote: 'Quotation details (airline, route, inclusions)…' };
      $$('#compTabs .tab').forEach((b) => b.addEventListener('click', () => {
        mode = b.dataset.m; $$('#compTabs .tab').forEach((x) => x.classList.toggle('active', x === b));
        $('#compExtra').innerHTML = extra[mode]; $('#compText').placeholder = ph[mode]; U.icons();
      }));
      $('#compSave').addEventListener('click', () => {
        const text = $('#compText').value.trim(); if (!text) return U.toast('Write something first', 'info');
        const now = new Date().toISOString();
        const map = {
          note: { type: 'note', title: '<b>Arif Hasan</b> added a note' },
          call: { type: 'call', title: '<b>Arif Hasan</b> logged a call' },
          followup: { type: 'meeting', icon: 'calendar-plus', title: `Follow-up scheduled for <b>${$('#fuDate')?.value || 'tomorrow'}</b>` },
          quote: { type: 'quote', title: `Quotation sent · <b>${$('#qAmt')?.value ? tk(+$('#qAmt').value.replace(/\D/g, '')) : 'draft'}</b>` },
        };
        l.timeline.unshift({ ...map[mode], time: now, note: text });
        if (mode === 'followup') C.followups.push({ id: 'F-' + Date.now(), ref: l.id, name: l.name, type: $('#fuType').value, due: new Date($('#fuDate').value + 'T11:00').toISOString(), agent: l.agent || 'A1', status: 'pending', note: text });
        $('#leadTL').innerHTML = tlHtml(l.timeline); $('#compText').value = ''; U.icons();
        U.toast(mode === 'followup' ? 'Follow-up scheduled' : 'Saved to timeline');
      });
      $('#ldAgent').addEventListener('change', (e) => { l.agent = e.target.value || null; l.timeline.unshift({ type: 'stage', icon: 'user-check', title: `Reassigned to <b>${esc(U.agent(l.agent).name)}</b>`, time: new Date().toISOString() }); U.toast(`Assigned to ${U.agent(l.agent).name}`); window.App.route(); });
      $('#ldStage').addEventListener('change', (e) => { l.stage = e.target.value; l.timeline.unshift({ type: 'stage', title: `Stage changed to <b>${U.stage(l.stage).name}</b>`, time: new Date().toISOString() }); U.toast(`Moved to ${U.stage(l.stage).name}`); window.App.route(); });
      $$('#ldPrio button').forEach((b) => b.addEventListener('click', () => { l.priority = b.dataset.p; window.App.route(); }));
      $('#convertBtn')?.addEventListener('click', () => { l.stage = 'converted'; l.timeline.unshift({ type: 'whatsapp', icon: 'badge-check', title: '<b>Converted</b> — booking confirmed', time: new Date().toISOString() }); U.toast(`${l.name} converted 🎉`, 'party-popper'); window.App.route(); });
      $$('[data-q]').forEach((b) => b.addEventListener('click', () => U.toast({ call: `Calling ${l.phone}…`, wa: 'Opening WhatsApp…', mail: 'Opening email composer…' }[b.dataset.q], { call: 'phone', wa: 'message-circle', mail: 'mail' }[b.dataset.q])));
      $('#fuDone').addEventListener('click', () => { const f = C.followups.find((x) => x.ref === l.id && x.status === 'pending'); if (f) f.status = 'done'; U.toast('Follow-up marked done'); window.App.route(); window.App.refreshCounts(); });
      $('#fuSnooze').addEventListener('click', () => U.toast('Snoozed to tomorrow 11:00 AM', 'clock'));
    },
  };

  /* =====================================================
     4. CUSTOMERS
     ===================================================== */
  const custState = { tag: 'All', q: '', view: 'table' };
  Pages.customers = {
    render() {
      const tags = ['All', 'VIP', 'Corporate', 'Regular'];
      return `
      ${head('Customers', 'Every traveller, their preferences and their full relationship history.', `<button class="btn"><i data-lucide="download"></i>Export</button><button class="btn primary" id="addCust"><i data-lucide="user-plus"></i>Add Customer</button>`)}
      <div class="grid g-4 mb">
        ${kpi({ label: 'Active Customers', value: '540', icon: 'users', delta: '4.6%', foot: 'vs last month' })}
        ${kpi({ label: 'VIP Customers', value: '48', icon: 'crown', tint: 'var(--warning)', tintSoft: 'var(--warning-soft)', foot: '38% of revenue' })}
        ${kpi({ label: 'Corporate Accounts', value: '17', icon: 'building-2', tint: 'var(--violet)', tintSoft: 'var(--violet-soft)', foot: '৳2.1Cr lifetime' })}
        ${kpi({ label: 'Repeat Rate', value: '39%', icon: 'repeat', tint: 'var(--success)', tintSoft: 'var(--success-soft)', delta: '3 pts', foot: 'booked 2+ trips' })}
      </div>
      <div class="card">
        <div class="toolbar">
          <div class="segmented" id="tagSeg">${tags.map((t) => `<button class="${custState.tag === t ? 'active' : ''}" data-t="${t}">${t}</button>`).join('')}</div>
          <div class="input-icon"><i data-lucide="search"></i><input class="input" id="custQ" placeholder="Search customers…" value="${esc(custState.q)}"></div>
          <div class="segmented" style="margin-left:auto" id="viewSeg"><button data-v="table" class="${custState.view === 'table' ? 'active' : ''}" title="Table"><i data-lucide="list"></i></button><button data-v="grid" class="${custState.view === 'grid' ? 'active' : ''}" title="Cards"><i data-lucide="layout-grid"></i></button></div>
        </div>
        <div id="custBody"></div>
      </div>`;
    },
    mount() {
      const draw = () => {
        const q = custState.q.toLowerCase();
        const rows = C.customers.filter((c) => (custState.tag === 'All' || c.tag === custState.tag) && (!q || (c.name + c.phone + c.city).toLowerCase().includes(q)));
        $('#custBody').innerHTML = !rows.length ? U.empty('users', 'No customers found') : custState.view === 'table' ? `
          <div class="table-wrap"><table class="table"><thead><tr><th>Customer</th><th>Tag</th><th>Trips</th><th>Lifetime value</th><th>Last travel</th><th>Preferred</th><th>Agent</th></tr></thead><tbody>
          ${rows.map((c) => `<tr class="clickable" data-href="#/customers/${c.id}">
            <td><div class="person">${avatar(c.name, 'sm')}<div><div class="name">${esc(c.name)}</div><div class="meta">${esc(c.phone)} · ${esc(c.city)}</div></div></div></td>
            <td>${tagBadge(c.tag)}</td><td class="num">${c.trips}</td><td class="num strong">${tk(c.spent)}</td>
            <td>${relDay(c.lastTravel)}</td><td><div class="chips">${c.destinations.slice(0, 2).map((x) => `<span class="chip">${esc(x)}</span>`).join('')}</div></td><td>${agentChip(c.agent)}</td></tr>`).join('')}
          </tbody></table></div>` : `
          <div class="grid g-3" style="padding:16px;gap:16px">${rows.map((c) => `<a class="card" href="#/customers/${c.id}" style="padding:18px;display:flex;flex-direction:column;gap:14px">
            <div class="row">${avatar(c.name)}<div class="grow"><div class="strong ellipsis">${esc(c.name)}</div><div class="xs muted">${esc(c.city)} · since ${new Date(c.since).getFullYear()}</div></div>${tagBadge(c.tag)}</div>
            <div class="emp-stats"><div><div class="v">${c.trips}</div><div class="l">Trips</div></div><div><div class="v">${tkShort(c.spent)}</div><div class="l">Spent</div></div><div><div class="v" style="font-size:13px;padding-top:3px">${relDay(c.lastTravel)}</div><div class="l">Last trip</div></div></div>
            <div class="chips">${c.destinations.map((x) => `<span class="chip"><i data-lucide="map-pin"></i>${esc(x)}</span>`).join('')}</div></a>`).join('')}</div>`;
        U.icons();
      };
      draw();
      $$('#tagSeg button').forEach((b) => b.addEventListener('click', () => { custState.tag = b.dataset.t; $$('#tagSeg button').forEach((x) => x.classList.toggle('active', x === b)); draw(); }));
      $$('#viewSeg button').forEach((b) => b.addEventListener('click', () => { custState.view = b.dataset.v; $$('#viewSeg button').forEach((x) => x.classList.toggle('active', x === b)); draw(); }));
      $('#custQ').addEventListener('input', (e) => { custState.q = e.target.value; draw(); });
      $('#custBody').addEventListener('click', (e) => { const tr = e.target.closest('tr[data-href]'); if (tr) location.hash = tr.dataset.href; });
      $('#addCust').addEventListener('click', () => U.drawer('Add Customer', `
        <div class="form-grid"><div class="field full"><label>Full name / Company</label><input class="input" placeholder="e.g. Shahriar Kabir"></div>
        <div class="field"><label>Phone</label><input class="input" placeholder="+880 1XXX-XXXXXX"></div><div class="field"><label>Email</label><input class="input" placeholder="name@email.com"></div>
        <div class="field"><label>City</label><input class="input" placeholder="Dhaka"></div><div class="field"><label>Tag</label><select class="select"><option>Regular</option><option>VIP</option><option>Corporate</option></select></div>
        <div class="field full"><label>Preferred airlines</label><input class="input" placeholder="Emirates, Qatar Airways"></div></div>`,
        `<button class="btn" data-close>Cancel</button><button class="btn primary" id="saveCust">Save customer</button>`) && $('#saveCust').addEventListener('click', () => { U.closeModal(); U.toast('Customer added'); }));
    },
  };

  /* =====================================================
     5. CUSTOMER PROFILE
     ===================================================== */
  Pages.customer = {
    render(id) {
      const c = C.customers.find((x) => x.id === id);
      if (!c) return U.empty('search-x', 'Customer not found');
      const trips = C.bookings.filter((b) => b.ref === c.id);
      const inquiries = C.leads.filter((l) => l.name === c.name);
      const fus = C.followups.filter((f) => f.ref === c.id || inquiries.some((l) => l.id === f.ref));
      const history = trips.length ? trips : [];
      const pastTrips = [
        ...history.map((b) => ({ date: b.travel, route: `${b.from} → ${b.to}`, airline: b.airline, pax: b.pax, amount: b.amount, status: b.status })),
        ...c.destinations.map((dst, i) => ({ date: new Date(new Date(c.lastTravel).getTime() - (i + 1) * 120 * C.DAY).toISOString(), route: `DAC → ${dst}`, airline: c.airlines[i % c.airlines.length], pax: c.tag === 'Corporate' ? 3 + i : 1 + (i % 2), amount: Math.round(c.spent / (c.trips + 1) * (1 + i * 0.1)), status: 'Completed' })),
      ];
      return `
      ${crumb([['Customers', '#/customers'], [esc(c.name)]])}
      <div class="card mb">
        <div class="profile-head">
          ${avatar(c.name, 'xl')}
          <div class="grow">
            <h2>${esc(c.name)} ${tagBadge(c.tag)}</h2>
            <div class="contact-line"><span><i data-lucide="phone"></i>${esc(c.phone)}</span><span><i data-lucide="mail"></i>${esc(c.email)}</span><span><i data-lucide="map-pin"></i>${esc(c.city)}</span><span><i data-lucide="user-round-check"></i>${esc(U.agent(c.agent).name)}</span></div>
          </div>
          <div class="row wrap">
            <button class="btn" data-q="call"><i data-lucide="phone"></i>Call</button>
            <button class="btn" data-q="wa"><i data-lucide="message-circle"></i>WhatsApp</button>
            <button class="btn" id="custFu"><i data-lucide="calendar-plus"></i>Follow-up</button>
            <button class="btn primary" data-action="new-lead"><i data-lucide="plus"></i>New Inquiry</button>
          </div>
        </div>
        <div class="stat-strip">
          <div><div class="l">Lifetime value</div><div class="v">${tk(c.spent)}</div></div>
          <div><div class="l">Total trips</div><div class="v">${c.trips}</div></div>
          <div><div class="l">Last travel</div><div class="v">${relDay(c.lastTravel)}</div></div>
          <div><div class="l">Customer since</div><div class="v">${fmtDate(c.since, { month: 'short', year: 'numeric' })}</div></div>
        </div>
      </div>

      <div class="tabs" id="cpTabs">
        <button class="tab active" data-p="overview">Overview</button>
        <button class="tab" data-p="history">Travel history<span class="pill">${pastTrips.length}</span></button>
        <button class="tab" data-p="comms">Communication</button>
        <button class="tab" data-p="inq">Inquiries<span class="pill">${inquiries.length}</span></button>
      </div>

      <div data-pane="overview" class="grid g-main-side">
        <div class="stack" style="gap:20px">
          <div class="card">${cardHead('Travel Preferences', 'Used to personalise quotations & offers')}
            <div class="card-body">
              <dl class="kv">
                <dt>Preferred airlines</dt><dd><div class="chips">${c.airlines.map((a) => `<span class="chip"><i data-lucide="plane"></i>${esc(a)}</span>`).join('')}</div></dd>
                <dt>Destinations</dt><dd><div class="chips">${c.destinations.map((a) => `<span class="chip"><i data-lucide="map-pin"></i>${esc(a)}</span>`).join('')}</div></dd>
                <dt>Seat</dt><dd>${c.seat}</dd><dt>Meal</dt><dd>${c.meal}</dd>
                <dt>Passport</dt><dd>${c.passport}</dd><dt>Birthday</dt><dd>${c.birthday}</dd>
              </dl>
            </div>
          </div>
          <div class="card">${cardHead('Recent Trips', '', '<button class="link" data-goto="history">View all<i data-lucide="arrow-right"></i></button>')}
            <div class="list" style="margin-top:8px">${pastTrips.slice(0, 4).map((t) => `<div class="list-item">${typeIc('quote', 'plane')}<div class="grow"><div class="strong sm">${t.route}</div><div class="xs muted">${esc(t.airline)} · ${t.pax} pax · ${fmtDate(t.date, { day: 'numeric', month: 'short', year: 'numeric' })}</div></div><span class="num sm strong">${tk(t.amount)}</span>${bookingBadge(t.status)}</div>`).join('')}</div>
          </div>
        </div>
        <div class="stack" style="gap:20px">
          <div class="card">${cardHead('Retention Opportunities')}
            <div class="card-body stack" style="gap:10px">
              <div class="quote">${typeIc('meeting', 'gift')}<div class="grow"><div class="strong sm">Birthday on ${c.birthday}</div><div class="xs muted">Send wishes + loyalty voucher</div></div></div>
              <div class="quote">${typeIc('whatsapp', 'sparkles')}<div class="grow"><div class="strong sm">${esc(c.destinations[0])} fare drop</div><div class="xs muted">${esc(c.airlines[0])} −14% next month</div></div><button class="btn sm" data-q="wa">Send</button></div>
              <div class="quote">${typeIc('call', 'repeat')}<div class="grow"><div class="strong sm">Usual travel window</div><div class="xs muted">Books every ~4 months — due soon</div></div></div>
            </div>
          </div>
          <div class="card">${cardHead('Follow-ups')}
            <div class="list" style="margin-top:8px">${fus.length ? fus.map((f) => `<div class="list-item">${typeIc(f.type)}<div class="grow"><div class="sm strong ellipsis">${esc(f.note)}</div><div class="xs muted">${U.agent(f.agent).name}</div></div>${f.status === 'done' ? '<span class="badge green">Done</span>' : dueLabel(f.due)}</div>`).join('') : U.empty('calendar', 'No follow-ups', 'Schedule one to keep in touch.')}</div>
          </div>
          <div class="card">${cardHead('Notes')}
            <div class="card-body"><div class="tl-note" style="margin:0 0 10px">${c.tag === 'Corporate' ? 'Invoices go to finance@ — net 30 terms. Always book refundable fares for executives.' : 'Prefers WhatsApp over calls. Responds quickly in the evening.'}</div><textarea class="textarea" placeholder="Add a note…" style="min-height:64px"></textarea></div>
          </div>
        </div>
      </div>

      <div data-pane="history" hidden><div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Date</th><th>Route</th><th>Airline</th><th>Passengers</th><th>Amount</th><th>Status</th></tr></thead><tbody>
        ${pastTrips.map((t) => `<tr><td>${fmtDate(t.date, { day: 'numeric', month: 'short', year: 'numeric' })}</td><td class="strong">${t.route}</td><td>${esc(t.airline)}</td><td>${t.pax}</td><td class="num">${tk(t.amount)}</td><td>${bookingBadge(t.status)}</td></tr>`).join('')}
      </tbody></table></div></div></div>

      <div data-pane="comms" hidden><div class="card"><div class="card-body"><div class="timeline">
        ${tlHtml([
          { type: 'whatsapp', title: 'WhatsApp · <b>Fare alert sent</b>', time: new Date(Date.now() - 2 * 864e5).toISOString(), note: `Hi ${c.name.split(' ')[0]}! ${c.airlines[0]} has a special fare to ${c.destinations[0]} next month. Want me to hold seats?` },
          { type: 'call', title: `Call · <b>${U.agent(c.agent).name}</b> · 5m 12s`, time: new Date(Date.now() - 9 * 864e5).toISOString(), note: 'Post-trip feedback: very happy with the hotel. Planning another trip with family.' },
          { type: 'email', title: 'Email · <b>E-ticket & invoice</b>', time: new Date(Date.now() - 45 * 864e5).toISOString() },
          { type: 'note', title: 'Internal note', time: new Date(Date.now() - 60 * 864e5).toISOString(), note: 'Always offer aisle seat and halal meal.' },
        ])}
      </div></div></div></div>

      <div data-pane="inq" hidden><div class="card">${inquiries.length ? `<div class="list">${inquiries.map((l) => `<a class="list-item" href="#/leads/${l.id}">${typeIc('note', 'inbox')}<div class="grow"><div class="strong sm">${l.from} → ${esc(l.destination)} · ${l.pax} pax</div><div class="xs muted">${l.id} · ${relDay(l.created)}</div></div>${stageBadge(l.stage)}</a>`).join('')}</div>` : U.empty('inbox', 'No previous inquiries on record')}</div></div>`;
    },
    mount(id) {
      const show = (p) => { $$('#cpTabs .tab').forEach((x) => x.classList.toggle('active', x.dataset.p === p)); $$('[data-pane]').forEach((x) => (x.hidden = x.dataset.pane !== p)); };
      $$('#cpTabs .tab').forEach((b) => b.addEventListener('click', () => show(b.dataset.p)));
      $$('[data-goto]').forEach((b) => b.addEventListener('click', () => show(b.dataset.goto)));
      $$('[data-q]').forEach((b) => b.addEventListener('click', () => U.toast(b.dataset.q === 'call' ? 'Calling…' : 'Opening WhatsApp…', b.dataset.q === 'call' ? 'phone' : 'message-circle')));
      $('#custFu')?.addEventListener('click', () => U.toast('Follow-up scheduled for tomorrow 11:00 AM', 'calendar-check'));
    },
  };

  /* =====================================================
     6. SALES PIPELINE (drag & drop)
     ===================================================== */
  const pipeState = { agent: '', q: '' };
  Pages.pipeline = {
    render() {
      return `
      ${head('Sales Pipeline', 'Drag deals between stages. Every move is logged on the lead timeline.',
        `<div class="input-icon" style="width:220px"><i data-lucide="search"></i><input class="input" id="pipeQ" placeholder="Filter deals…" value="${esc(pipeState.q)}"></div>
         <select class="select" id="pipeAgent" style="width:auto">${agentOptions(pipeState.agent)}</select>
         <button class="btn primary" data-action="new-lead"><i data-lucide="plus"></i>New Deal</button>`)}
      <div class="kanban" id="kanban"></div>`;
    },
    mount() {
      const board = $('#kanban');
      const draw = () => {
        const q = pipeState.q.toLowerCase();
        const vis = C.leads.filter((l) => (!pipeState.agent || l.agent === pipeState.agent) && (!q || (l.name + l.destination).toLowerCase().includes(q)));
        board.innerHTML = C.stages.map((s) => {
          const items = vis.filter((l) => l.stage === s.id);
          return `<div class="k-col" data-stage="${s.id}">
            <div class="k-head"><div class="k-title"><span class="sw" style="background:${s.color}"></span>${s.name}<span class="count">${items.length}</span></div>
            <div class="k-sum">${tk(items.reduce((a, l) => a + l.budget, 0))}</div></div>
            <div class="k-list">${items.map((l) => `<div class="k-card" draggable="true" data-id="${l.id}">
              <div class="row between"><span class="strong sm ellipsis">${esc(l.name)}</span>${prio(l.priority)}</div>
              <div class="route"><i data-lucide="plane"></i>${l.from} → ${esc(l.destination)} · ${l.pax} pax</div>
              <div class="route"><i data-lucide="calendar"></i>${fmtDate(l.travelDate, { day: 'numeric', month: 'short' })}${l.followUp && dayDiff(l.followUp) < 0 && !['converted', 'lost'].includes(l.stage) ? ' · <span class="danger-text strong">follow-up overdue</span>' : ''}</div>
              <div class="k-card-foot"><span class="strong sm num">${tk(l.budget)}</span>${agentAvatar(l.agent)}</div>
            </div>`).join('') || '<div class="xs muted" style="text-align:center;padding:16px 0">Drop deals here</div>'}</div>
            ${s.id === 'new' ? '<button class="k-add" data-action="new-lead"><i data-lucide="plus"></i>Add lead</button>' : ''}
          </div>`;
        }).join('');
        U.icons();
      };
      draw();
      let dragId = null;
      board.addEventListener('dragstart', (e) => { const c = e.target.closest('.k-card'); if (!c) return; dragId = c.dataset.id; c.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
      board.addEventListener('dragend', (e) => { e.target.closest('.k-card')?.classList.remove('dragging'); $$('.k-col', board).forEach((c) => c.classList.remove('drag-over')); });
      board.addEventListener('dragover', (e) => { const col = e.target.closest('.k-col'); if (!col) return; e.preventDefault(); $$('.k-col', board).forEach((c) => c.classList.toggle('drag-over', c === col)); });
      board.addEventListener('drop', (e) => {
        const col = e.target.closest('.k-col'); if (!col || !dragId) return; e.preventDefault();
        const l = C.leads.find((x) => x.id === dragId), to = col.dataset.stage;
        if (l.stage !== to) {
          l.stage = to; leadTimeline(l).unshift({ type: 'stage', title: `Stage changed to <b>${U.stage(to).name}</b>`, time: new Date().toISOString() });
          U.toast(to === 'converted' ? `${l.name} converted 🎉` : `${l.name} → ${U.stage(to).name}`, to === 'converted' ? 'party-popper' : 'arrow-right-left');
        }
        dragId = null; draw();
      });
      board.addEventListener('click', (e) => { const c = e.target.closest('.k-card'); if (c) location.hash = `#/leads/${c.dataset.id}`; });
      $('#pipeAgent').addEventListener('change', (e) => { pipeState.agent = e.target.value; draw(); });
      $('#pipeQ').addEventListener('input', (e) => { pipeState.q = e.target.value; draw(); });
    },
  };

  /* =====================================================
     7. FOLLOW-UPS & TASKS
     ===================================================== */
  const fuState = { tab: 'today', agent: '' };
  Pages.followups = {
    render() {
      const p = pendingFU();
      const n = { overdue: overdueFU().length, today: todayFU().filter((f) => f.status === 'pending').length, upcoming: p.filter((f) => dayDiff(f.due) > 0).length, done: C.followups.filter((f) => f.status === 'done').length };
      const doneRate = 87; // team average this week (demo)
      return `
      ${head('Follow-ups & Tasks', 'Never miss a touchpoint. Overdue items float to the top automatically.', `<select class="select" id="fuAgent" style="width:auto">${agentOptions(fuState.agent)}</select><button class="btn primary" id="newFU"><i data-lucide="calendar-plus"></i>Schedule Follow-up</button>`)}
      <div class="grid g-4 mb">
        ${kpi({ label: 'Overdue', value: n.overdue, icon: 'alarm-clock', tint: 'var(--danger)', tintSoft: 'var(--danger-soft)', foot: 'oldest 4 days late', alert: n.overdue > 0 })}
        ${kpi({ label: 'Due Today', value: n.today, icon: 'clock', tint: 'var(--warning)', tintSoft: 'var(--warning-soft)', foot: `${todayFU().filter((f) => f.status === 'done').length} already done` })}
        ${kpi({ label: 'Upcoming', value: n.upcoming, icon: 'calendar-range', foot: 'next 7 days' })}
        ${kpi({ label: 'Completion Rate', value: doneRate + '%', icon: 'check-check', tint: 'var(--success)', tintSoft: 'var(--success-soft)', delta: '6 pts', foot: 'this week' })}
      </div>
      <div class="grid g-main-side">
        <div class="card">
          <div class="tabs" id="fuTabs" style="padding:0 12px;margin:0">
            ${[['overdue', 'Overdue', n.overdue], ['today', 'Today', n.today], ['upcoming', 'Upcoming', n.upcoming], ['done', 'Completed', n.done]].map((t) => `<button class="tab ${fuState.tab === t[0] ? 'active' : ''}" data-t="${t[0]}">${t[1]}<span class="pill">${t[2]}</span></button>`).join('')}
          </div>
          <div id="fuList"></div>
        </div>
        <div class="stack" style="gap:20px">
          <div class="card">${cardHead(new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }))}<div class="card-body">${miniCal()}</div></div>
          <div class="card">${cardHead('Automated Reminders', 'Applied to every agent')}
            <div class="card-body">
              ${[['Remind agent 30 min before follow-up', true], ['Daily 9 AM digest of today’s tasks', true], ['Alert admin when follow-up is 24h overdue', true], ['Auto-create follow-up 2 days after quotation', true], ['Re-engage customers 90 days after travel', false]].map((r, i) => `<div class="set-row"><span class="sm">${r[0]}</span><label class="toggle"><input type="checkbox" ${r[1] ? 'checked' : ''} data-rem="${i}"><span></span></label></div>`).join('')}
            </div>
          </div>
        </div>
      </div>`;
    },
    mount() {
      const draw = () => {
        let rows = C.followups.filter((f) => !fuState.agent || f.agent === fuState.agent);
        const t = fuState.tab;
        rows = rows.filter((f) => t === 'done' ? f.status === 'done' : f.status === 'pending' && (t === 'overdue' ? dayDiff(f.due) < 0 : t === 'today' ? dayDiff(f.due) === 0 : dayDiff(f.due) > 0));
        rows.sort((a, b) => new Date(a.due) - new Date(b.due));
        const groups = {};
        rows.forEach((f) => { const k = t === 'upcoming' ? relDay(f.due) : t === 'overdue' ? (dayDiff(f.due) === -1 ? 'Yesterday' : `${-dayDiff(f.due)} days ago`) : t === 'today' ? 'Today' : 'Completed'; (groups[k] = groups[k] || []).push(f); });
        $('#fuList').innerHTML = rows.length ? Object.entries(groups).map(([k, items]) => `<div class="fu-group-title"><span>${k}</span><span>${items.length}</span></div>
          ${items.map((f) => `<div class="list-item ${f.status === 'done' ? 'done' : ''}">
            <input type="checkbox" class="cb" data-id="${f.id}" ${f.status === 'done' ? 'checked' : ''} aria-label="Mark done">
            ${typeIc(f.type)}
            <a class="grow" href="${linkFor(f.ref)}" style="min-width:0"><div class="name strong sm ellipsis">${esc(f.name)} <span class="muted" style="font-weight:400">· ${U.typeLabel[f.type]}</span></div><div class="xs muted ellipsis">${esc(f.note)}</div></a>
            <span class="hide-sm">${agentChip(f.agent)}</span>
            ${f.status === 'done' ? '<span class="badge green"><i data-lucide="check"></i>Done</span>' : dueLabel(f.due)}
            <button class="icon-btn sm" title="Reschedule to tomorrow" data-snooze="${f.id}"><i data-lucide="calendar-clock"></i></button>
          </div>`).join('')}`).join('')
          : U.empty(t === 'overdue' ? 'party-popper' : 'calendar-check', t === 'overdue' ? 'No overdue follow-ups — great job!' : 'Nothing here', '');
        U.icons();
      };
      draw();
      $$('#fuTabs .tab').forEach((b) => b.addEventListener('click', () => { fuState.tab = b.dataset.t; $$('#fuTabs .tab').forEach((x) => x.classList.toggle('active', x === b)); draw(); }));
      $('#fuAgent').addEventListener('change', (e) => { fuState.agent = e.target.value; draw(); });
      $('#fuList').addEventListener('change', (e) => {
        const f = C.followups.find((x) => x.id === e.target.dataset.id); if (!f) return;
        f.status = e.target.checked ? 'done' : 'pending'; U.toast(e.target.checked ? `Completed: ${f.name}` : 'Moved back to pending'); window.App.refreshCounts(); setTimeout(() => window.App.route(), 350);
      });
      $('#fuList').addEventListener('click', (e) => {
        const b = e.target.closest('[data-snooze]'); if (!b) return;
        const f = C.followups.find((x) => x.id === b.dataset.snooze); const nd = new Date(C.today.getTime() + C.DAY); nd.setHours(11); f.due = nd.toISOString();
        U.toast(`Rescheduled ${f.name} to tomorrow 11:00 AM`, 'calendar-clock'); window.App.refreshCounts(); window.App.route();
      });
      $$('[data-rem]').forEach((t) => t.addEventListener('change', () => U.toast(t.checked ? 'Reminder enabled' : 'Reminder disabled', 'bell')));
      $('#newFU').addEventListener('click', () => openFollowupDrawer());
    },
  };
  function miniCal() {
    const t = C.today, first = new Date(t.getFullYear(), t.getMonth(), 1), start = (first.getDay() + 6) % 7, days = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
    const has = new Set(), over = new Set();
    C.followups.filter((f) => f.status === 'pending').forEach((f) => { const x = new Date(f.due); if (x.getMonth() === t.getMonth()) { has.add(x.getDate()); if (dayDiff(f.due) < 0) over.add(x.getDate()); } });
    let cells = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => `<div class="dow">${d}</div>`).join('');
    for (let i = 0; i < start; i++) cells += '<div class="d other"></div>';
    for (let d = 1; d <= days; d++) cells += `<div class="d ${d === t.getDate() ? 'today' : ''} ${has.has(d) ? 'has' : ''} ${over.has(d) ? 'over' : ''}">${d}</div>`;
    return `<div class="mini-cal">${cells}</div><div class="row xs muted" style="margin-top:12px;gap:14px"><span class="row" style="gap:6px"><span style="width:6px;height:6px;border-radius:50%;background:var(--primary)"></span>Scheduled</span><span class="row" style="gap:6px"><span style="width:6px;height:6px;border-radius:50%;background:var(--danger)"></span>Overdue</span></div>`;
  }
  function openFollowupDrawer() {
    U.drawer('Schedule Follow-up', `
      <div class="form-grid">
        <div class="field full"><label>Lead or customer</label><select class="select" id="nfRef">${C.leads.filter((l) => !['converted', 'lost'].includes(l.stage)).map((l) => `<option value="${l.id}">${esc(l.name)} — ${esc(l.destination)}</option>`).join('')}</select></div>
        <div class="field full"><label>Type</label><div class="choice">${['call', 'whatsapp', 'email', 'meeting'].map((t, i) => `<label><input type="radio" name="nfType" value="${t}" ${i ? '' : 'checked'}><i data-lucide="${U.typeIcon[t]}"></i><span>${U.typeLabel[t]}</span></label>`).join('')}</div></div>
        <div class="field"><label>Date</label><input type="date" class="input" id="nfDate" value="${new Date(C.today.getTime() + C.DAY).toISOString().slice(0, 10)}"></div>
        <div class="field"><label>Time</label><input type="time" class="input" id="nfTime" value="11:00"></div>
        <div class="field full"><label>Assign to</label><select class="select" id="nfAgent">${agentOptions('A1', '')}</select></div>
        <div class="field full"><label>What's the goal?</label><textarea class="textarea" id="nfNote" placeholder="e.g. Confirm passport details and send final quotation"></textarea></div>
        <label class="row sm full" style="gap:8px"><input type="checkbox" class="cb" checked> Remind agent 30 minutes before</label>
      </div>`, `<button class="btn" data-close>Cancel</button><button class="btn primary" id="nfSave"><i data-lucide="calendar-check"></i>Schedule</button>`);
    $('#nfSave').addEventListener('click', () => {
      const l = C.leads.find((x) => x.id === $('#nfRef').value);
      C.followups.push({ id: 'F-' + Date.now(), ref: l.id, name: l.name, type: $('input[name=nfType]:checked').value, due: new Date(`${$('#nfDate').value}T${$('#nfTime').value}`).toISOString(), agent: $('#nfAgent').value, status: 'pending', note: $('#nfNote').value || 'Follow up' });
      U.closeModal(); U.toast(`Follow-up scheduled with ${l.name}`, 'calendar-check'); window.App.refreshCounts(); window.App.route();
    });
  }

  /* =====================================================
     8. BOOKINGS & TICKETS
     ===================================================== */
  const bkState = { status: 'All' };
  Pages.bookings = {
    render() {
      const st = ['All', 'Pending', 'Confirmed', 'Ticketed', 'Completed', 'Cancelled'];
      const total = C.bookings.filter((b) => b.status !== 'Cancelled').reduce((s, b) => s + b.amount, 0);
      return `
      ${head('Bookings & Tickets', 'Booking records linked to each customer relationship.', `<button class="btn"><i data-lucide="download"></i>Export</button><button class="btn primary" id="newBk"><i data-lucide="plus"></i>New Booking</button>`)}
      <div class="grid g-4 mb">
        ${kpi({ label: 'Booking Value', value: tkShort(total), icon: 'banknote', delta: '10.6%', foot: 'this month' })}
        ${kpi({ label: 'Tickets Issued', value: C.bookings.filter((b) => b.status === 'Ticketed').length, icon: 'ticket-check', tint: 'var(--success)', tintSoft: 'var(--success-soft)', foot: 'ready to fly' })}
        ${kpi({ label: 'Awaiting Ticketing', value: C.bookings.filter((b) => ['Pending', 'Confirmed'].includes(b.status)).length, icon: 'hourglass', tint: 'var(--warning)', tintSoft: 'var(--warning-soft)', foot: 'payment / issue pending' })}
        ${kpi({ label: 'Departing in 7 days', value: C.bookings.filter((b) => dayDiff(b.travel) >= 0 && dayDiff(b.travel) <= 7 && b.status !== 'Cancelled').length, icon: 'plane-takeoff', tint: 'var(--info)', tintSoft: 'var(--info-soft)', foot: 'send travel reminders' })}
      </div>
      <div class="card">
        <div class="toolbar"><div class="segmented" id="bkSeg">${st.map((s) => `<button data-s="${s}" class="${bkState.status === s ? 'active' : ''}">${s}</button>`).join('')}</div>
          <div class="input-icon" style="margin-left:auto"><i data-lucide="search"></i><input class="input" id="bkQ" placeholder="Search PNR, customer…"></div></div>
        <div class="table-wrap"><table class="table"><thead><tr><th>Booking</th><th>Customer</th><th>Route</th><th>Travel date</th><th>Pax</th><th>Amount</th><th>Status</th><th>Agent</th></tr></thead><tbody id="bkBody"></tbody></table></div>
      </div>`;
    },
    mount() {
      let q = '';
      const draw = () => {
        const rows = C.bookings.filter((b) => (bkState.status === 'All' || b.status === bkState.status) && (!q || (b.customer + b.pnr + b.id).toLowerCase().includes(q)));
        $('#bkBody').innerHTML = rows.length ? rows.map((b) => `<tr class="clickable" data-href="#/customers/${b.ref}">
          <td><div class="strong">${b.id}</div><div class="xs muted">PNR ${b.pnr}</div></td>
          <td><div class="person">${avatar(b.customer, 'xs')}<span class="sm strong">${esc(b.customer)}</span></div></td>
          <td><div class="strong sm">${b.from} → ${b.to}</div><div class="xs muted">${esc(b.airline)}</div></td>
          <td>${fmtDate(b.travel, { day: 'numeric', month: 'short', year: 'numeric' })}<div class="xs muted">${relDay(b.travel)}</div></td>
          <td>${b.pax}</td><td class="num strong">${tk(b.amount)}</td><td>${bookingBadge(b.status)}</td><td>${agentChip(b.agent)}</td></tr>`).join('')
          : `<tr><td colspan="8">${U.empty('ticket', 'No bookings in this view')}</td></tr>`;
        U.icons();
      };
      draw();
      $$('#bkSeg button').forEach((b) => b.addEventListener('click', () => { bkState.status = b.dataset.s; $$('#bkSeg button').forEach((x) => x.classList.toggle('active', x === b)); draw(); }));
      $('#bkQ').addEventListener('input', (e) => { q = e.target.value.toLowerCase(); draw(); });
      $('#bkBody').addEventListener('click', (e) => { const tr = e.target.closest('tr[data-href]'); if (tr) location.hash = tr.dataset.href; });
      $('#newBk').addEventListener('click', () => U.toast('Convert a lead to create a booking — opening pipeline', 'info') || (location.hash = '#/pipeline'));
    },
  };

  /* =====================================================
     9. COMMUNICATION INBOX
     ===================================================== */
  const ibState = { active: 'T1', channel: 'all', q: '' };
  const chIcon = { whatsapp: 'message-circle', email: 'mail', call: 'phone' };
  Pages.inbox = {
    render() {
      return `
      ${head('Communication Inbox', 'WhatsApp, email and calls — one timeline per customer.', `<button class="btn"><i data-lucide="file-text"></i>Templates</button><button class="btn primary" id="newMsg"><i data-lucide="square-pen"></i>New Message</button>`)}
      <div class="card inbox" id="inbox">
        <div class="ib-list">
          <div class="ib-list-head">
            <div class="input-icon"><i data-lucide="search"></i><input class="input" id="ibQ" placeholder="Search conversations…"></div>
            <div class="segmented" id="ibCh" style="width:100%">${[['all', 'All'], ['whatsapp', 'WhatsApp'], ['email', 'Email'], ['call', 'Calls']].map((c) => `<button data-c="${c[0]}" class="${ibState.channel === c[0] ? 'active' : ''}" style="flex:1;justify-content:center">${c[1]}</button>`).join('')}</div>
          </div>
          <div class="ib-items" id="ibItems"></div>
        </div>
        <div class="ib-thread" id="ibThread"></div>
        <div class="ib-side" id="ibSide"></div>
      </div>`;
    },
    mount() {
      const drawList = () => {
        const q = ibState.q.toLowerCase();
        const rows = C.conversations.filter((c) => (ibState.channel === 'all' || c.channel === ibState.channel) && (!q || c.name.toLowerCase().includes(q))).sort((a, b) => new Date(b.time) - new Date(a.time));
        $('#ibItems').innerHTML = rows.map((c) => { const last = c.messages[c.messages.length - 1]; return `<div class="ib-item ${c.id === ibState.active ? 'active' : ''} ${c.unread ? 'unread' : ''}" data-id="${c.id}">
          ${avatar(c.name)}<span class="ch-ic ${c.channel}"><i data-lucide="${chIcon[c.channel]}"></i></span>
          <div class="grow"><div class="row between"><span class="name sm ellipsis">${esc(c.name)}</span><span class="xs muted">${ago(c.time)}</span></div>
          <div class="row between" style="gap:8px"><span class="preview">${last.dir === 'out' ? 'You: ' : ''}${esc(c.subject || last.text)}</span>${c.unread ? `<span class="unread-dot">${c.unread}</span>` : ''}</div></div></div>`; }).join('') || U.empty('inbox', 'No conversations');
        U.icons();
      };
      const drawThread = () => {
        const c = C.conversations.find((x) => x.id === ibState.active);
        const ref = C.leads.find((l) => l.id === c.ref) || C.customers.find((x) => x.id === c.ref);
        $('#ibThread').innerHTML = `
          <div class="ib-thread-head">
            <button class="icon-btn sm only-mobile" id="ibBack"><i data-lucide="arrow-left"></i></button>
            ${avatar(c.name, 'sm')}<div class="grow"><div class="strong">${esc(c.name)}</div><div class="xs muted">${c.subject ? esc(c.subject) : `${c.channel === 'whatsapp' ? 'WhatsApp' : c.channel === 'call' ? 'Call log' : 'Email'} · handled by ${U.agent(c.agent).name}`}</div></div>
            <button class="icon-btn sm" title="Call"><i data-lucide="phone"></i></button><a class="icon-btn sm" title="Open profile" href="${linkFor(c.ref)}"><i data-lucide="external-link"></i></a>
          </div>
          <div class="ib-msgs" id="ibMsgs">${c.messages.map((m) => m.dir === 'sys' ? `<div class="sys-msg"><i data-lucide="${c.channel === 'call' ? 'phone' : 'info'}"></i>${esc(m.text)} · ${fmtTime(m.t)}</div>`
            : `<div class="msg ${m.dir}"><div class="bubble">${esc(m.text)}</div><div class="t">${m.dir === 'internal' ? `<i data-lucide="lock"></i>Internal note · ${esc(m.by)} · ` : ''}${relDay(m.t)} ${fmtTime(m.t)}${m.dir === 'out' ? ' <i data-lucide="check-check"></i>' : ''}</div></div>`).join('')}</div>
          <div class="composer">
            <div class="segmented" id="cmpMode" style="margin-bottom:8px"><button class="active" data-m="out">Reply</button><button data-m="internal"><i data-lucide="lock" style="width:13px;height:13px"></i>Internal note</button></div>
            <textarea id="cmpText" placeholder="Type a message…  (Enter to send, Shift+Enter for new line)"></textarea>
            <div class="composer-bar"><button class="icon-btn sm" title="Attach"><i data-lucide="paperclip"></i></button><button class="icon-btn sm" title="Emoji"><i data-lucide="smile"></i></button><button class="icon-btn sm" title="Templates" id="tplBtn"><i data-lucide="file-text"></i></button><span class="xs muted grow">via ${c.channel === 'email' ? 'Email' : 'WhatsApp'}</span><button class="btn primary sm" id="cmpSend"><i data-lucide="send"></i>Send</button></div>
          </div>`;
        $('#ibSide').innerHTML = `
          <div style="text-align:center">${avatar(c.name, 'lg')}<div class="strong" style="margin-top:8px">${esc(c.name)}</div><div class="xs muted">${esc(ref?.phone || '')}</div>
            <div style="margin-top:8px">${ref?.stage ? stageBadge(ref.stage) : ref?.tag ? tagBadge(ref.tag) : ''}</div></div>
          ${ref?.destination ? `<div><div class="section-label">Trip</div><div class="info-grid"><div class="info-cell"><div class="l">Destination</div><div class="v sm">${esc(ref.destination)}</div></div><div class="info-cell"><div class="l">Budget</div><div class="v sm">${tkShort(ref.budget)}</div></div><div class="info-cell"><div class="l">Date</div><div class="v sm">${fmtDate(ref.travelDate)}</div></div><div class="info-cell"><div class="l">Pax</div><div class="v sm">${ref.pax}</div></div></div></div>` : ''}
          <div><div class="section-label">Quick replies</div><div class="stack" style="gap:8px">${C.templates.map((t, i) => `<div class="tpl" data-tpl="${i}"><b>${t.title}</b><span class="muted">${esc(t.text.slice(0, 64))}…</span></div>`).join('')}</div></div>`;
        U.icons();
        const box = $('#ibMsgs'); box.scrollTop = box.scrollHeight;
        let mode = 'out';
        $$('#cmpMode button').forEach((b) => b.addEventListener('click', () => { mode = b.dataset.m; $$('#cmpMode button').forEach((x) => x.classList.toggle('active', x === b)); $('#cmpText').placeholder = mode === 'internal' ? 'Only your team will see this note…' : 'Type a message…'; }));
        const send = () => {
          const v = $('#cmpText').value.trim(); if (!v) return;
          c.messages.push({ dir: mode, text: v, t: new Date().toISOString(), by: 'Arif Hasan' }); c.time = new Date().toISOString();
          drawThread(); drawList(); U.toast(mode === 'internal' ? 'Internal note added' : 'Message sent', mode === 'internal' ? 'lock' : 'send');
        };
        $('#cmpSend').addEventListener('click', send);
        $('#cmpText').addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
        $$('[data-tpl]').forEach((t) => t.addEventListener('click', () => { $('#cmpText').value = C.templates[+t.dataset.tpl].text; $('#cmpText').focus(); }));
        $('#tplBtn').addEventListener('click', () => { $('#cmpText').value = C.templates[0].text; $('#cmpText').focus(); });
        $('#ibBack')?.addEventListener('click', () => $('#inbox').classList.remove('thread-open'));
      };
      drawList(); drawThread();
      $('#ibItems').addEventListener('click', (e) => {
        const it = e.target.closest('.ib-item'); if (!it) return;
        ibState.active = it.dataset.id; const c = C.conversations.find((x) => x.id === ibState.active); c.unread = 0;
        drawList(); drawThread(); $('#inbox').classList.add('thread-open'); window.App.refreshCounts();
      });
      $$('#ibCh button').forEach((b) => b.addEventListener('click', () => { ibState.channel = b.dataset.c; $$('#ibCh button').forEach((x) => x.classList.toggle('active', x === b)); drawList(); }));
      $('#ibQ').addEventListener('input', (e) => { ibState.q = e.target.value; drawList(); });
      $('#newMsg').addEventListener('click', () => $('#cmpText').focus());
    },
  };

  /* =====================================================
     10. EMPLOYEE MANAGEMENT
     ===================================================== */
  Pages.employees = {
    render() {
      const st = { on: 'Online', away: 'Away', off: 'Offline' };
      return `
      ${head('Employee Management', 'Manage your sales team, workload and lead assignment.', `<button class="btn" id="autoAssign"><i data-lucide="shuffle"></i>Auto-assign rules</button><button class="btn primary" id="addEmp"><i data-lucide="user-plus"></i>Add Employee</button>`)}
      <div class="grid g-4 mb">
        ${kpi({ label: 'Team Members', value: C.agents.length, icon: 'users', foot: `${C.agents.filter((a) => a.status === 'on').length} online now` })}
        ${kpi({ label: 'Open Leads / Agent', value: '14', icon: 'inbox', tint: 'var(--info)', tintSoft: 'var(--info-soft)', foot: 'healthy load < 20' })}
        ${kpi({ label: 'Avg. Response Time', value: '11 min', icon: 'timer', tint: 'var(--success)', tintSoft: 'var(--success-soft)', delta: '3 min', foot: 'faster than last month' })}
        ${kpi({ label: 'Unassigned Leads', value: C.leads.filter((l) => !l.agent).length, icon: 'user-x', tint: 'var(--warning)', tintSoft: 'var(--warning-soft)', foot: 'assign to avoid going cold', alert: true })}
      </div>
      <div class="grid g-3">
        ${C.agents.map((a) => { const open = C.leads.filter((l) => l.agent === a.id && !['converted', 'lost'].includes(l.stage)).length; const pct = Math.round((a.achieved / a.target) * 100); return `
        <div class="card emp-card">
          <div class="row">
            <div class="avatar-wrap">${avatar(a.name, 'lg', a.hue)}<span class="presence ${a.status}"></span></div>
            <div class="grow"><div class="strong">${esc(a.name)}</div><div class="xs muted">${a.role}</div><div class="xs muted">${st[a.status]} · joined ${fmtDate(a.joined, { month: 'short', year: 'numeric' })}</div></div>
            <button class="icon-btn sm" title="More"><i data-lucide="more-horizontal"></i></button>
          </div>
          <div class="emp-stats"><div><div class="v">${a.leads}</div><div class="l">Leads</div></div><div><div class="v">${a.converted}</div><div class="l">Converted</div></div><div><div class="v">${Math.round((a.converted / a.leads) * 100)}%</div><div class="l">Conv. rate</div></div></div>
          <div><div class="row between xs" style="margin-bottom:6px"><span class="muted">Monthly target</span><span class="strong num">${tkShort(a.achieved)} / ${tkShort(a.target)}</span></div><div class="progress ${pct >= 90 ? 'green' : pct < 60 ? 'amber' : ''}"><span style="width:${Math.min(pct, 100)}%"></span></div></div>
          <div class="row between"><span class="xs muted"><b class="text-2">${open}</b> open leads · replies ~${a.avgResponse}</span><button class="btn sm" data-assign="${a.id}"><i data-lucide="user-plus"></i>Assign</button></div>
        </div>`; }).join('')}
      </div>`;
    },
    mount() {
      $$('[data-assign]').forEach((b) => b.addEventListener('click', () => {
        const a = U.agent(b.dataset.assign); const un = C.leads.filter((l) => !l.agent || l.stage === 'new');
        U.drawer(`Assign leads to ${esc(a.name)}`, `<p class="sm muted" style="margin-top:0">Select the leads to hand over. ${esc(a.name.split(' ')[0])} will be notified instantly.</p>
          <div class="stack" style="gap:8px">${un.map((l) => `<label class="quote" style="cursor:pointer"><input type="checkbox" class="cb" value="${l.id}" ${!l.agent ? 'checked' : ''}>${avatar(l.name, 'sm')}<div class="grow"><div class="strong sm">${esc(l.name)}</div><div class="xs muted">${esc(l.destination)} · ${tk(l.budget)}</div></div>${l.agent ? agentAvatar(l.agent) : '<span class="badge amber">Unassigned</span>'}</label>`).join('')}</div>`,
          `<button class="btn" data-close>Cancel</button><button class="btn primary" id="doAssign"><i data-lucide="user-check"></i>Assign selected</button>`);
        $('#doAssign').addEventListener('click', () => { const ids = $$('#modalRoot input:checked').map((i) => i.value); ids.forEach((id) => (C.leads.find((l) => l.id === id).agent = a.id)); U.closeModal(); U.toast(`${ids.length} lead(s) assigned to ${a.name}`); window.App.route(); });
      }));
      $('#addEmp').addEventListener('click', () => {
        U.drawer('Add Employee', `<div class="form-grid">
          <div class="field"><label>First name</label><input class="input"></div><div class="field"><label>Last name</label><input class="input"></div>
          <div class="field full"><label>Work email</label><input class="input" placeholder="name@aerotravels.com"></div>
          <div class="field"><label>Phone</label><input class="input" placeholder="+880"></div>
          <div class="field"><label>Role</label><select class="select"><option>Sales Agent</option><option>Senior Sales Agent</option><option>Sales Manager</option><option>Support</option></select></div>
          <div class="field full"><label>Monthly target (৳)</label><input class="input" placeholder="15,00,000"></div>
          <label class="row sm full" style="gap:8px"><input type="checkbox" class="cb" checked> Include in automatic lead rotation</label>
          <label class="row sm full" style="gap:8px"><input type="checkbox" class="cb" checked> Send invite email</label></div>`,
          `<button class="btn" data-close>Cancel</button><button class="btn primary" id="saveEmp">Send invite</button>`);
        $('#saveEmp').addEventListener('click', () => { U.closeModal(); U.toast('Invitation sent', 'mail-check'); });
      });
      $('#autoAssign').addEventListener('click', () => {
        U.drawer('Auto-assign Rules', `<div class="field"><label>Distribution method</label><div class="choice"><label><input type="radio" name="m" checked><span>Round-robin</span></label><label><input type="radio" name="m"><span>Least busy</span></label><label><input type="radio" name="m"><span>By destination</span></label></div></div>
          <div class="form-section" style="margin-top:22px">Rules</div>
          ${[['Corporate inquiries → Tanvir Ahmed', true], ['Umrah / Hajj inquiries → Farhana Akter', true], ['Leads > ৳4L budget → Senior agents only', true], ['Skip offline agents', true]].map((r) => `<div class="set-row"><span class="sm">${r[0]}</span><label class="toggle"><input type="checkbox" ${r[1] ? 'checked' : ''}><span></span></label></div>`).join('')}`,
          `<button class="btn" data-close>Cancel</button><button class="btn primary" data-close id="saveRules">Save rules</button>`);
        $('#saveRules').addEventListener('click', () => U.toast('Assignment rules saved'));
      });
    },
  };

  /* =====================================================
     11. SALES PERFORMANCE & REPORTS
     ===================================================== */
  Pages.performance = {
    render() {
      const ranked = [...C.agents].sort((a, b) => b.revenue - a.revenue);
      return `
      ${head('Sales Performance', 'How the team is converting inquiries into revenue.', `<div class="segmented" id="perSeg"><button>Week</button><button class="active">Month</button><button>Quarter</button><button>Year</button></div><button class="btn"><i data-lucide="file-down"></i>Download report</button>`)}
      <div class="grid g-4 mb">
        ${kpi({ label: 'Revenue', value: '৳1.19Cr', icon: 'banknote', delta: '10.6%', foot: 'team total, this month' })}
        ${kpi({ label: 'Deals Won', value: '105', icon: 'trophy', tint: 'var(--success)', tintSoft: 'var(--success-soft)', delta: '14.1%', foot: 'vs last month' })}
        ${kpi({ label: 'Avg. Deal Size', value: '৳1.13L', icon: 'scale', tint: 'var(--violet)', tintSoft: 'var(--violet-soft)', delta: '2.4%', deltaDir: 'down', foot: 'vs last month' })}
        ${kpi({ label: 'Follow-up Completion', value: '87%', icon: 'check-check', tint: 'var(--info)', tintSoft: 'var(--info-soft)', delta: '4 pts', foot: 'team average' })}
      </div>
      <div class="grid g-2 mb">
        <div class="card">${cardHead('Revenue Trend', 'Monthly revenue in ৳ lakh · dashed line = monthly target')}<div class="card-body">${U.lineChart(C.monthly.map((m) => ({ label: m.m, value: m.revenue })), { target: 15, format: (v) => `৳${v}L`, id: 'revChart' })}</div></div>
        <div class="card">${cardHead('Revenue by Agent', 'This month')}<div class="card-body">${U.bars(ranked.map((a) => ({ label: a.name, short: a.name.split(' ')[0], value: a.revenue, extra: `${a.converted} deals` })), { format: tkShort })}</div></div>
      </div>
      <div class="card">
        ${cardHead('Performance Leaderboard', 'Ranked by revenue generated', '<span class="badge outline"><i data-lucide="info"></i>Updated live</span>')}
        <div style="margin-top:14px">
          <div class="leader head"><span>#</span><span>Agent</span><span>Leads</span><span class="hide-sm2">Converted</span><span class="hide-md hide-sm2">Conv. rate</span><span class="hide-md hide-sm2">Follow-ups</span><span>Revenue</span></div>
          ${ranked.map((a, i) => `<div class="leader">
            <span class="rank ${i < 3 ? 'r' + (i + 1) : ''}">${i + 1}</span>
            <div class="person">${avatar(a.name, 'sm', a.hue)}<div style="min-width:0"><div class="name sm">${esc(a.name)}</div><div class="meta">${a.role}</div></div></div>
            <span class="num">${a.leads}</span>
            <span class="num hide-sm2">${a.converted}</span>
            <span class="hide-md hide-sm2"><div class="row" style="gap:8px"><div class="progress grow" style="max-width:70px"><span style="width:${(a.converted / a.leads) * 100 * 2}%"></span></div><span class="num sm">${Math.round((a.converted / a.leads) * 100)}%</span></div></span>
            <span class="num hide-md hide-sm2 ${a.followRate < 80 ? 'warning-text' : ''}">${a.followRate}%</span>
            <span class="num strong">${tkShort(a.revenue)}</span>
          </div>`).join('')}
        </div>
      </div>`;
    },
    mount() {
      U.bindLineChart($('#revChart'));
      $$('#perSeg button').forEach((b) => b.addEventListener('click', () => { $$('#perSeg button').forEach((x) => x.classList.remove('active')); b.classList.add('active'); }));
    },
  };

  /* =====================================================
     12. SALES TARGETS
     ===================================================== */
  Pages.targets = {
    render() {
      const T = C.agents.reduce((s, a) => s + a.target, 0), A = C.agents.reduce((s, a) => s + a.achieved, 0);
      const day = new Date().getDate(), days = new Date(C.today.getFullYear(), C.today.getMonth() + 1, 0).getDate();
      return `
      ${head('Sales Targets', `${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })} · ${days - day} days left in the month`, `<button class="btn"><i data-lucide="copy"></i>Copy last month</button><button class="btn primary" id="saveT"><i data-lucide="save"></i>Save targets</button>`)}
      <div class="grid g-3 mb">
        <div class="card span-2"><div class="card-body" style="padding:22px">
          <div class="row between wrap"><div><div class="kpi-label">Team target progress</div><div class="kpi-value" style="font-size:30px;margin-top:6px">${tkShort(A)} <span class="muted" style="font-size:16px;font-weight:500">of ${tkShort(T)}</span></div></div>
          <div style="text-align:right"><div class="kpi-value success-text">${Math.round((A / T) * 100)}%</div><div class="xs muted">Expected by today: ${Math.round((day / days) * 100)}%</div></div></div>
          <div class="progress lg green" style="margin-top:16px;position:relative;overflow:visible"><span style="width:${(A / T) * 100}%"></span><i style="position:absolute;top:-4px;bottom:-4px;left:${(day / days) * 100}%;width:2px;background:var(--text-2);border-radius:2px" title="Expected pace"></i></div>
          <div class="row xs muted" style="margin-top:10px;gap:16px"><span>Remaining ${tkShort(T - A)}</span><span>Needed per day ${tkShort((T - A) / Math.max(1, days - day))}</span></div>
        </div></div>
        <div class="card"><div class="card-body" style="padding:22px">
          <div class="kpi-label">On track</div>
          <div class="row" style="margin-top:12px;gap:24px">
            <div><div class="kpi-value success-text">${C.agents.filter((a) => a.achieved / a.target >= 0.8).length}</div><div class="xs muted">≥ 80%</div></div>
            <div><div class="kpi-value warning-text">${C.agents.filter((a) => a.achieved / a.target < 0.8 && a.achieved / a.target >= 0.6).length}</div><div class="xs muted">60–80%</div></div>
            <div><div class="kpi-value danger-text">${C.agents.filter((a) => a.achieved / a.target < 0.6).length}</div><div class="xs muted">&lt; 60%</div></div>
          </div>
        </div></div>
      </div>
      <div class="card"><div class="table-wrap"><table class="table">
        <thead><tr><th>Agent</th><th>Monthly target (৳)</th><th>Achieved</th><th style="min-width:200px">Progress</th><th>Remaining</th><th>Deals target</th><th>Status</th></tr></thead>
        <tbody>${C.agents.map((a) => { const p = a.achieved / a.target; return `<tr>
          <td><div class="person">${avatar(a.name, 'sm', a.hue)}<div><div class="name">${esc(a.name)}</div><div class="meta">${a.role}</div></div></div></td>
          <td><input class="input num" style="width:140px;height:32px" value="${a.target.toLocaleString('en-IN')}" data-tgt="${a.id}"></td>
          <td class="num strong">${tk(a.achieved)}</td>
          <td><div class="row" style="gap:10px"><div class="progress grow ${p >= 0.8 ? 'green' : p < 0.6 ? 'amber' : ''}"><span style="width:${Math.min(p * 100, 100)}%"></span></div><span class="num sm strong" style="width:38px">${Math.round(p * 100)}%</span></div></td>
          <td class="num">${tk(Math.max(0, a.target - a.achieved))}</td>
          <td><input class="input num" style="width:80px;height:32px" value="${Math.round(a.target / 100000)}"></td>
          <td>${p >= 0.8 ? '<span class="badge green"><i data-lucide="trending-up"></i>On track</span>' : p >= 0.6 ? '<span class="badge amber"><i data-lucide="minus"></i>At risk</span>' : '<span class="badge red"><i data-lucide="trending-down"></i>Behind</span>'}</td></tr>`; }).join('')}</tbody>
      </table></div></div>`;
    },
    mount() { $('#saveT').addEventListener('click', () => U.toast('Targets saved & shared with the team')); },
  };

  /* =====================================================
     13. NOTIFICATIONS
     ===================================================== */
  Pages.notifications = {
    render() {
      return `
      ${head('Notifications', 'Lead alerts, follow-up reminders and team updates.', `<button class="btn" id="markAll"><i data-lucide="check-check"></i>Mark all as read</button>`)}
      <div class="grid g-main-side">
        <div class="card"><div class="list" id="notifList">${notifList(C.notifications)}</div></div>
        <div class="card">${cardHead('Notify me about', 'In-app · Email · SMS')}
          <div class="card-body">${[['New lead assigned', 1, 1, 0], ['Follow-up reminder', 1, 0, 1], ['Follow-up overdue', 1, 1, 1], ['Customer replied', 1, 0, 0], ['Lead converted', 1, 1, 0], ['Target milestones', 1, 1, 0], ['Upcoming customer travel', 1, 0, 0]].map((r) => `<div class="set-row"><span class="sm">${r[0]}</span><div class="row" style="gap:10px">${[1, 2, 3].map((i) => `<label class="toggle" title="${['In-app', 'Email', 'SMS'][i - 1]}"><input type="checkbox" ${r[i] ? 'checked' : ''}><span></span></label>`).join('')}</div></div>`).join('')}</div>
        </div>
      </div>`;
    },
    mount() {
      $('#markAll').addEventListener('click', () => { C.notifications.forEach((n) => (n.unread = false)); $('#notifList').innerHTML = notifList(C.notifications); U.icons(); window.App.refreshCounts(); U.toast('All caught up'); });
    },
  };
  function notifList(items) {
    return items.map((n) => `<a class="notif ${n.unread ? 'unread' : ''}" href="${n.link}" data-n="${n.id}">
      <span class="type-ic" style="background:var(--${{ blue: 'primary', red: 'danger', green: 'success', amber: 'warning', violet: 'violet', cyan: 'info' }[n.tone]}-soft);color:var(--${{ blue: 'primary', red: 'danger', green: 'success', amber: 'warning', violet: 'violet', cyan: 'info' }[n.tone]})"><i data-lucide="${n.icon}"></i></span>
      <div class="grow" style="padding-right:16px"><div class="sm strong">${esc(n.title)}</div><div class="xs muted">${esc(n.text)}</div><div class="xs muted" style="margin-top:2px">${ago(n.t)}</div></div></a>`).join('');
  }
  Pages.notifList = notifList;

  /* =====================================================
     14. ROLES & PERMISSIONS
     ===================================================== */
  const roles = [
    { id: 'admin', name: 'Administrator', users: 1, desc: 'Full access to every module and setting.' },
    { id: 'manager', name: 'Sales Manager', users: 1, desc: 'Manages team, targets and all leads.' },
    { id: 'agent', name: 'Sales Agent', users: 4, desc: 'Works on assigned leads and customers.' },
    { id: 'support', name: 'Support', users: 1, desc: 'Handles bookings and communication.' },
  ];
  const modules = [
    ['CRM Workspace', [['Leads & Inquiries', 'admin:VCED manager:VCED agent:VCE support:V'], ['Customers', 'admin:VCED manager:VCED agent:VCE support:VE'], ['Sales Pipeline', 'admin:VCED manager:VCED agent:VE support:'], ['Follow-ups & Tasks', 'admin:VCED manager:VCED agent:VCE support:VC'], ['Bookings & Tickets', 'admin:VCED manager:VCE agent:VC support:VCE'], ['Communication Inbox', 'admin:VCED manager:VCE agent:VC support:VC']]],
    ['Team & Performance', [['Employee Management', 'admin:VCED manager:VE agent: support:'], ['Sales Performance', 'admin:V manager:V agent:V support:'], ['Sales Targets', 'admin:VCED manager:VCE agent:V support:']]],
    ['Administration', [['Roles & Permissions', 'admin:VCED manager: agent: support:'], ['Activity Logs', 'admin:V manager:V agent: support:'], ['CRM Settings', 'admin:VCED manager:V agent: support:'], ['Export data', 'admin:V manager:V agent: support:']]],
  ];
  let activeRole = 'agent';
  Pages.roles = {
    render() {
      return `
      ${head('Roles & Permissions', 'Control what each team member can see and do.', `<button class="btn primary" id="newRole"><i data-lucide="plus"></i>New Role</button>`)}
      <div class="grid" style="grid-template-columns:minmax(0,300px) minmax(0,1fr)" id="rolesGrid">
        <div class="stack" style="gap:10px" id="roleList">${roles.map((r) => `<button class="card" data-role="${r.id}" style="text-align:left;padding:14px 16px;cursor:pointer;${r.id === activeRole ? 'border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-soft)' : ''}">
          <div class="row between"><span class="strong">${r.name}</span><span class="badge outline"><i data-lucide="users"></i>${r.users}</span></div><div class="xs muted" style="margin-top:4px">${r.desc}</div></button>`).join('')}</div>
        <div class="card">
          ${cardHead(`${roles.find((r) => r.id === activeRole).name} permissions`, 'Changes apply immediately to everyone with this role', '<button class="btn sm primary" id="savePerm">Save changes</button>')}
          <div class="table-wrap" style="margin-top:14px"><table class="table matrix">
            <thead><tr><th>Module</th><th>View</th><th>Create</th><th>Edit</th><th>Delete</th></tr></thead>
            <tbody>${modules.map(([g, items]) => `<tr class="group"><td colspan="5">${g}</td></tr>${items.map(([m, rule]) => { const p = (rule.split(' ').find((x) => x.startsWith(activeRole + ':')) || '').split(':')[1] || ''; return `<tr><td class="strong sm">${m}</td>${'VCED'.split('').map((k) => `<td><input type="checkbox" class="cb" ${p.includes(k) ? 'checked' : ''} ${activeRole === 'admin' ? 'disabled' : ''}></td>`).join('')}</tr>`; }).join('')}`).join('')}</tbody>
          </table></div>
          <div class="card-foot row sm"><i data-lucide="shield" style="color:var(--muted)"></i><span class="muted">Agents only see leads assigned to them unless “View all leads” is granted in Settings.</span></div>
        </div>
      </div>`;
    },
    mount() {
      $$('[data-role]').forEach((b) => b.addEventListener('click', () => { activeRole = b.dataset.role; window.App.route(); }));
      $('#savePerm').addEventListener('click', () => U.toast('Permissions updated', 'shield-check'));
      $('#newRole').addEventListener('click', () => U.toast('Role editor coming soon', 'info'));
      if (innerWidth < 900) $('#rolesGrid').style.gridTemplateColumns = '1fr';
    },
  };

  /* =====================================================
     15. ACTIVITY LOGS
     ===================================================== */
  Pages.activity = {
    render() {
      const logs = [...C.activities, ...C.activities.map((a) => ({ ...a, t: new Date(new Date(a.t).getTime() - 3 * C.DAY).toISOString() }))];
      return `
      ${head('Activity Logs', 'A complete audit trail of what every team member did.', `<button class="btn"><i data-lucide="download"></i>Export CSV</button>`)}
      <div class="card">
        <div class="toolbar"><div class="input-icon"><i data-lucide="search"></i><input class="input" id="actQ" placeholder="Search activity…"></div>
          <select class="select" id="actAgent" style="width:auto">${agentOptions('', 'All employees')}</select>
          <select class="select" style="width:auto"><option>Last 7 days</option><option>Last 30 days</option><option>This quarter</option></select></div>
        <div class="table-wrap"><table class="table"><thead><tr><th>Employee</th><th>Action</th><th>Record</th><th>Details</th><th>When</th><th>IP / Device</th></tr></thead>
          <tbody id="actBody">${logs.map((a) => `<tr data-agent="${a.who}" data-text="${esc((U.agent(a.who).name + a.action + a.target + a.extra).toLowerCase())}">
            <td>${agentChip(a.who)}</td><td><span class="row sm" style="gap:8px"><span class="type-ic ${a.type}" style="width:26px;height:26px;border-radius:7px"><i data-lucide="${a.icon}"></i></span>${a.action}</span></td>
            <td class="strong sm">${esc(a.target)}</td><td class="sm muted">${esc(a.extra) || '—'}</td><td class="sm">${relDay(a.t)} · ${fmtTime(a.t)}</td><td class="xs muted">103.${(a.who.charCodeAt(1) * 7) % 255}.42.${(a.who.charCodeAt(1) * 13) % 255} · ${a.who === 'A3' ? 'macOS' : 'Windows'}</td></tr>`).join('')}</tbody></table></div>
      </div>`;
    },
    mount() {
      const f = () => { const q = $('#actQ').value.toLowerCase(), ag = $('#actAgent').value; $$('#actBody tr').forEach((tr) => (tr.hidden = (ag && tr.dataset.agent !== ag) || (q && !tr.dataset.text.includes(q)))); };
      $('#actQ').addEventListener('input', f); $('#actAgent').addEventListener('change', f);
    },
  };

  /* =====================================================
     16. CRM SETTINGS
     ===================================================== */
  Pages.settings = {
    render() {
      return `
      ${head('CRM Settings', 'Configure how Aero CRM works for your agency.')}
      <div class="settings">
        <nav class="settings-nav" id="setNav">${[['general', 'building', 'Agency profile'], ['sources', 'radio-tower', 'Lead sources'], ['stages', 'kanban', 'Pipeline stages'], ['followup', 'bell-ring', 'Follow-up automation'], ['templates', 'file-text', 'Message templates'], ['integrations', 'plug', 'Integrations']].map((s, i) => `<a href="#set-${s[0]}" class="${i ? '' : 'active'}"><i data-lucide="${s[1]}"></i>${s[2]}</a>`).join('')}</nav>
        <div class="stack" style="gap:20px">
          <div class="card" id="set-general">${cardHead('Agency profile', 'Shown on quotations and customer messages')}<div class="card-body"><div class="form-grid">
            <div class="field"><label>Agency name</label><input class="input" value="Aero Travels Ltd."></div><div class="field"><label>Support phone</label><input class="input" value="+880 9612-345678"></div>
            <div class="field"><label>Default currency</label><select class="select"><option>BDT (৳)</option><option>USD ($)</option></select></div><div class="field"><label>Timezone</label><select class="select"><option>Asia/Dhaka (GMT+6)</option></select></div>
            <div class="field full"><label>Office address</label><input class="input" value="House 12, Road 7, Gulshan-1, Dhaka 1212"></div></div></div></div>

          <div class="card" id="set-sources">${cardHead('Lead sources', 'Where inquiries come from', '<button class="btn sm"><i data-lucide="plus"></i>Add source</button>')}<div class="card-body"><div class="stack" style="gap:8px">
            ${C.sources.map((s) => `<div class="stage-row"><span class="type-ic" style="width:30px;height:30px;background:var(--surface-3)"><i data-lucide="${s.icon}"></i></span><span class="strong sm grow">${s.id}</span><span class="xs muted">Auto-assign: round-robin</span><label class="toggle"><input type="checkbox" checked><span></span></label></div>`).join('')}
          </div></div></div>

          <div class="card" id="set-stages">${cardHead('Pipeline stages', 'Drag to reorder · used across Leads and Pipeline', '<button class="btn sm"><i data-lucide="plus"></i>Add stage</button>')}<div class="card-body"><div class="stack" style="gap:8px">
            ${C.stages.map((s, i) => `<div class="stage-row"><i data-lucide="grip-vertical" class="grip"></i><span style="width:10px;height:10px;border-radius:50%;background:${s.color}"></span><span class="strong sm grow">${s.name}</span><span class="xs muted">${['Default for new inquiries', 'Auto follow-up in 1 day', 'Auto follow-up in 2 days', 'Manager notified', 'Moves customer to Retention', 'Requires reason'][i]}</span><button class="icon-btn sm"><i data-lucide="pencil"></i></button></div>`).join('')}
          </div></div></div>

          <div class="card" id="set-followup">${cardHead('Follow-up automation')}<div class="card-body">
            ${[['Auto-create follow-up when a lead is assigned', 'Within 2 hours of assignment', true], ['Escalate overdue follow-ups to manager', 'After 24 hours', true], ['Mark lead cold after no response', 'After 3 unanswered attempts', true], ['Post-travel feedback message', '2 days after return date', true], ['Retention offer for past customers', '90 days after last trip', false]].map((r) => `<div class="set-row"><div><div class="sm strong">${r[0]}</div><div class="xs muted">${r[1]}</div></div><label class="toggle"><input type="checkbox" ${r[2] ? 'checked' : ''}><span></span></label></div>`).join('')}
          </div></div>

          <div class="card" id="set-templates">${cardHead('Message templates', 'Available in the Communication Inbox', '<button class="btn sm"><i data-lucide="plus"></i>New template</button>')}<div class="card-body"><div class="grid g-2" style="gap:10px">${C.templates.map((t) => `<div class="tpl"><b>${t.title}</b><span class="muted">${esc(t.text)}</span></div>`).join('')}</div></div></div>

          <div class="card" id="set-integrations">${cardHead('Integrations')}<div class="card-body"><div class="grid g-3" style="gap:12px">
            ${[['message-circle', 'WhatsApp Business', 'Connected', true], ['facebook', 'Facebook Lead Ads', 'Connected', true], ['mail', 'Gmail / SMTP', 'Connected', true], ['phone-call', 'Cloud telephony', 'Not connected', false], ['globe', 'Website form', 'Connected', true], ['message-square', 'SMS gateway', 'Not connected', false]].map((x) => `<div class="info-cell row"><span class="type-ic" style="background:var(--surface)"><i data-lucide="${x[0]}"></i></span><div class="grow"><div class="strong sm">${x[1]}</div><div class="xs ${x[3] ? 'success-text' : 'muted'}">${x[2]}</div></div><button class="btn sm">${x[3] ? 'Manage' : 'Connect'}</button></div>`).join('')}
          </div></div></div>

          <div class="row" style="justify-content:flex-end"><button class="btn">Discard</button><button class="btn primary" id="saveSet">Save settings</button></div>
        </div>
      </div>`;
    },
    mount() {
      $$('#setNav a').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); $$('#setNav a').forEach((x) => x.classList.toggle('active', x === a)); document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
      $('#saveSet').addEventListener('click', () => U.toast('Settings saved'));
    },
  };

  /* =====================================================
     NEW LEAD DRAWER (global)
     ===================================================== */
  Pages.openNewLead = function () {
    U.drawer('New Lead', `
      <div class="form-section">Customer</div>
      <div class="form-grid">
        <div class="field full"><label>Full name *</label><input class="input" id="nlName" placeholder="e.g. Shakil Mahmud"></div>
        <div class="field"><label>Phone / WhatsApp *</label><input class="input" id="nlPhone" placeholder="+880 1XXX-XXXXXX"></div>
        <div class="field"><label>Email</label><input class="input" placeholder="optional"></div>
        <div class="field full"><label>Lead source</label><div class="choice">${C.sources.map((s, i) => `<label><input type="radio" name="nlSrc" value="${s.id}" ${i ? '' : 'checked'}><i data-lucide="${s.icon}"></i><span>${s.id}</span></label>`).join('')}</div></div>
      </div>
      <div class="form-section">Trip requirements</div>
      <div class="form-grid">
        <div class="field"><label>From</label><select class="select" id="nlFrom"><option>DAC</option><option>CGP</option><option>ZYL</option></select></div>
        <div class="field"><label>Destination *</label><input class="input" id="nlDest" placeholder="e.g. Dubai" list="destList"><datalist id="destList">${['Dubai', 'Kuala Lumpur', 'Bangkok', 'Singapore', 'Jeddah', 'London', 'Toronto', 'Maldives', 'Kolkata', 'Istanbul'].map((x) => `<option>${x}</option>`).join('')}</datalist></div>
        <div class="field"><label>Travel date</label><input type="date" class="input" id="nlDate" value="${new Date(C.today.getTime() + 20 * C.DAY).toISOString().slice(0, 10)}"></div>
        <div class="field"><label>Passengers</label><input type="number" min="1" class="input" id="nlPax" value="1"></div>
        <div class="field"><label>Budget (৳)</label><input class="input" id="nlBudget" placeholder="1,00,000"></div>
        <div class="field"><label>Trip type</label><select class="select" id="nlType"><option>Return</option><option>One-way</option><option>Multi-city</option></select></div>
      </div>
      <div class="form-section">Assignment</div>
      <div class="form-grid">
        <div class="field full"><label>Priority</label><div class="choice">${['hot', 'warm', 'cold'].map((p, i) => `<label><input type="radio" name="nlPrio" value="${p}" ${i === 1 ? 'checked' : ''}>${prio(p)}</label>`).join('')}</div></div>
        <div class="field"><label>Assign agent</label><select class="select" id="nlAgent"><option value="">Auto-assign (round-robin)</option>${agentOptions('', '')}</select></div>
        <div class="field"><label>First follow-up</label><input type="date" class="input" id="nlFu" value="${C.today.toISOString().slice(0, 10)}"></div>
        <div class="field full"><label>Notes</label><textarea class="textarea" id="nlNotes" placeholder="Anything the agent should know…"></textarea></div>
      </div>`,
      `<button class="btn" data-close>Cancel</button><button class="btn primary" id="nlSave"><i data-lucide="check"></i>Create lead</button>`);
    $('#nlSave').addEventListener('click', () => {
      const name = $('#nlName').value.trim(), phone = $('#nlPhone').value.trim(), dest = $('#nlDest').value.trim();
      if (!name || !phone || !dest) { [['#nlName', name], ['#nlPhone', phone], ['#nlDest', dest]].forEach(([s, v]) => { if (!v) $(s).style.borderColor = 'var(--danger)'; }); return U.toast('Please fill the required fields', 'alert-circle'); }
      const num = Math.max(...C.leads.map((l) => +l.id.slice(2))) + 1;
      const agentId = $('#nlAgent').value || C.agents[num % C.agents.length].id;
      const lead = { id: 'L-' + num, name, phone, email: '', source: $('input[name=nlSrc]:checked').value, agent: agentId, priority: $('input[name=nlPrio]:checked').value, from: $('#nlFrom').value, destination: dest, travelDate: new Date($('#nlDate').value).toISOString(), budget: +$('#nlBudget').value.replace(/\D/g, '') || 0, pax: +$('#nlPax').value || 1, stage: 'new', followUp: new Date($('#nlFu').value + 'T11:00').toISOString(), created: new Date().toISOString(), notes: $('#nlNotes').value || 'No notes yet.', tripType: $('#nlType').value };
      lead.email = name.toLowerCase().replace(/[^a-z]+/g, '.') + '@gmail.com';
      C.leads.unshift(lead);
      U.closeModal(); U.toast(`Lead created & assigned to ${U.agent(agentId).name}`); window.App.refreshCounts();
      location.hash = `#/leads/${lead.id}`;
    });
  };
  Pages.openFollowupDrawer = openFollowupDrawer;

  window.Pages = Pages;
})();
