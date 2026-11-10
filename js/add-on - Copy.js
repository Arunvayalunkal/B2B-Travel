(() => {
  'use strict';
  const inr = n => '₹' + Number(n).toLocaleString('en-IN');

  /* ---------- Sample data (replace with API data) ---------- */
  const FARE = { base: 5769, tax: 859, fee: 0 };
  // Add { type:'Child', n:1 } / { type:'Infant', n:1 } here for more passengers
  const PAX = [{ type: 'Adult', n: 1 }];
  const SEGMENTS = [{ id: 'doh-dxb', label: 'DOH → DXB' }, { id: 'dxb-doh', label: 'DXB → DOH' }];
  // Each item: id, name, desc, price, icon (Bootstrap icon) and optional img (thumbnail URL, overrides icon)
  const CATALOG = {
    bag: [
      { id: '', name: 'No extra baggage', desc: 'Your 15 kg check-in is included', price: 0, icon: 'bi-suitcase2', tone: 'grey' },
      { id: '5', name: '+5 kg', desc: 'Small extra bag or sports gear', price: 1500, icon: 'bi-handbag', tone: 'blue' },
      { id: '10', name: '+10 kg', desc: 'One extra medium suitcase', price: 2800, icon: 'bi-suitcase', tone: 'teal' },
      { id: '20', name: '+20 kg', desc: 'Best for long stays and shopping', price: 5200, icon: 'bi-suitcase-lg', tone: 'violet' }
    ],
    meal: [
      { id: '', name: 'No meal', desc: 'Skip pre-booked meal', price: 0, icon: 'bi-slash-circle', tone: 'grey' },
      { id: 'veg', name: 'Veg platter', desc: 'Paneer, rice, salad and dessert', price: 450, icon: 'bi-flower1', tone: 'green' },
      { id: 'nonveg', name: 'Non-veg platter', desc: 'Chicken, rice, salad and dessert', price: 520, icon: 'bi-egg-fried', tone: 'orange' },
      { id: 'snack', name: 'Light snack box', desc: 'Sandwich, fruit and a drink', price: 300, icon: 'bi-cup-straw', tone: 'yellow' }
    ],
    seat: [
      { id: 'auto', name: 'Auto-assign', desc: 'Seat is given at check-in', price: 0, icon: 'bi-shuffle', tone: 'grey', rows: [] },
      { id: 'std', name: 'Standard seat', desc: 'Rows 17–24 · pick your seat', price: 0, icon: 'bi-grid-3x2-gap', tone: 'blue', rows: [17, 24] },
      { id: 'pref', name: 'Preferred seat', desc: 'Rows 13–16 · closer to the exit', price: 350, icon: 'bi-star', tone: 'teal', rows: [13, 16] },
      { id: 'front', name: 'Extra legroom', desc: 'Rows 10–12 · more space, front cabin', price: 600, icon: 'bi-arrows-expand', tone: 'violet', rows: [10, 12] }
    ],
    special: [
      { id: 'wheel', name: 'Wheelchair assistance', desc: 'Help from check-in to boarding', price: 0, icon: 'bi-person-wheelchair', tone: 'blue' },
      { id: 'prio', name: 'Priority boarding', desc: 'Board first, get overhead space', price: 600, icon: 'bi-lightning-charge', tone: 'orange' },
      { id: 'lounge', name: 'Lounge access', desc: 'Food, drinks and Wi-Fi before flight', price: 2200, icon: 'bi-cup-hot', tone: 'violet' },
      { id: 'fast', name: 'Fast-track security', desc: 'Skip the queue at security', price: 750, icon: 'bi-door-open', tone: 'green' }
    ]
  };
  const GROUPS = [['bag', 'Baggage', 'bi-suitcase2'], ['meal', 'Meals', 'bi-cup-hot'], ['seat', 'Seats', 'bi-grid-3x2-gap'], ['special', 'Special services', 'bi-stars']];
  const PLANS = [
    { id: 'silver', name: 'Travel Ace Lite - Silver', price: 899, cover: 'Medical cover up to ₹5 lakh' },
    { id: 'gold', name: 'Travel Ace Lite - Gold', price: 1398, cover: 'Medical cover up to ₹10 lakh' },
    { id: 'plat', name: 'Travel Ace Lite - Platinum', price: 2150, cover: 'Medical cover up to ₹25 lakh' }
  ];

  /* ---------- State ---------- */
  const state = { services: {}, insurance: null };
  const key = (seg, p) => `${seg}|${p.type}${p.n}`;
  SEGMENTS.forEach(s => PAX.forEach(p => state.services[key(s.id, p)] = { bag: '', meal: '', seat: null, special: [] }));

  /* ---------- Passengers ---------- */
  const paxList = document.getElementById('paxList');
  paxList.innerHTML = PAX.map((p, i) => {
    const id = `pax${i}`, titles = p.type === 'Adult' ? ['Mr', 'Mrs', 'Ms'] : ['Master', 'Miss'];
    const dob = p.type === 'Adult' ? 'Date of birth' : 'Date of birth';
    return `<div class="accordion-item pax-card"><h3 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="true">
        <i class="bi bi-person-fill"></i>${p.type} ${p.n}<span class="pax-status text-muted" data-status="${id}">Incomplete</span></button></h3>
      <div id="${id}" class="accordion-collapse collapse show"><div class="accordion-body">
      <div class="row g-3" data-pax="${id}">
        <div class="col-4 col-md-2"><label class="form-label" for="${id}t">Title</label>
          <select class="form-select" id="${id}t" required>${titles.map(t => `<option>${t}</option>`).join('')}</select></div>
        <div class="col-8 col-md-5"><label class="form-label" for="${id}f">First name</label>
          <input class="form-control" id="${id}f" autocomplete="given-name" required><div class="invalid-feedback">Enter first name.</div></div>
        <div class="col-12 col-md-5"><label class="form-label" for="${id}l">Last name</label>
          <input class="form-control" id="${id}l" autocomplete="family-name" required><div class="invalid-feedback">Enter last name.</div></div>
        <div class="col-6 col-md-4"><label class="form-label" for="${id}g">Gender</label>
          <select class="form-select" id="${id}g" required><option value="">Select</option><option>Male</option><option>Female</option></select>
          <div class="invalid-feedback">Select gender.</div></div>
        <div class="col-6 col-md-4"><label class="form-label" for="${id}d">${dob}</label>
          <input type="date" class="form-control" id="${id}d" max="${new Date().toISOString().slice(0, 10)}" ${p.type === 'Adult' ? '' : 'required'}>
          <div class="invalid-feedback">Enter date of birth.</div></div>
      </div></div></div></div>`;
  }).join('');
  paxList.classList.add('accordion');
  paxList.addEventListener('input', e => {
    const row = e.target.closest('[data-pax]'); if (!row) return;
    const ok = [...row.querySelectorAll('[required]')].every(f => f.value.trim());
    const s = document.querySelector(`[data-status="${row.dataset.pax}"]`);
    s.textContent = ok ? 'Complete' : 'Incomplete';
    s.className = 'pax-status ' + (ok ? 'text-success' : 'text-muted');
  });

  /* ---------- Add-ons: flight tabs > passenger > service tabs > thumbnail cards ---------- */
  const tabs = document.getElementById('segTabs'), panes = document.getElementById('segPanes');
  const safe = t => t.replace(/[^\w-]/g, '_');
  const thumb = i => `<div class="thumb tone-${i.tone}">${i.img ? `<img src="${i.img}" alt="" loading="lazy">` : `<i class="bi ${i.icon}"></i>`}</div>`;
  function card(k, g, i) {
    const body = `${thumb(i)}<div class="addon-body"><div class="addon-name">${i.name}</div><div class="addon-desc" data-desc="${i.desc}">${i.desc}</div>
      <div class="addon-price ${i.price ? '' : 'free'}">${i.price ? inr(i.price) : 'Free'}</div></div><span class="addon-check"><i class="bi bi-check-lg"></i></span>`;
    if (g === 'seat') return `<div class="col-12 col-sm-6 col-xl-3"><button type="button" class="addon-card" data-k="${k}" data-cat="${i.id}">${body}</button></div>`;
    const id = safe(`${k}-${g}-${i.id}`);
    return `<div class="col-12 col-sm-6 col-xl-3"><input class="addon-input" type="${g === 'special' ? 'checkbox' : 'radio'}" name="${safe(k + g)}" id="${id}" data-k="${k}" data-g="${g}" data-id="${i.id}">
      <label class="addon-card" for="${id}">${body}</label></div>`;
  }
  SEGMENTS.forEach((s, si) => {
    tabs.insertAdjacentHTML('beforeend', `<li class="nav-item" role="presentation"><button class="nav-link ${si ? '' : 'active'}" data-bs-toggle="tab" data-bs-target="#seg-${s.id}" type="button" role="tab">${s.label}</button></li>`);
    panes.insertAdjacentHTML('beforeend', `<div class="tab-pane fade ${si ? '' : 'show active'}" id="seg-${s.id}" role="tabpanel"><div class="accordion" id="acc-${s.id}">${PAX.map((p, pi) => {
      const k = key(s.id, p), base = safe(k);
      return `<div class="accordion-item pax-addon" data-key="${k}">
        <h3 class="accordion-header"><button class="accordion-button ${pi ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#${base}" aria-expanded="${!pi}">
          <i class="bi bi-person-fill me-2"></i><span class="fw-semibold">${p.type} ${p.n}</span><span class="chips ms-3" data-chips></span></button></h3>
        <div id="${base}" class="accordion-collapse collapse ${pi ? '' : 'show'}" data-bs-parent="#acc-${s.id}"><div class="accordion-body">
          <ul class="nav svc-tabs" role="tablist">${GROUPS.map(([g, l, ic], gi) => `<li class="nav-item" role="presentation"><button type="button" class="nav-link ${gi ? '' : 'active'}" data-bs-toggle="tab" data-bs-target="#${base}-${g}" role="tab"><i class="bi ${ic}"></i><span>${l}</span><em class="dot" data-dot="${g}"></em></button></li>`).join('')}</ul>
          <div class="tab-content pt-3">${GROUPS.map(([g], gi) => `<div class="tab-pane fade ${gi ? '' : 'show active'}" id="${base}-${g}" role="tabpanel"><div class="row g-3">${CATALOG[g].map(i => card(k, g, i)).join('')}</div></div>`).join('')}</div>
        </div></div></div>`;
    }).join('')}</div></div>`);
  });
  panes.addEventListener('change', e => {
    const t = e.target; if (!t.dataset.g) return;
    const v = state.services[t.dataset.k];
    if (t.dataset.g === 'special') v.special = t.checked ? [...v.special, t.dataset.id] : v.special.filter(x => x !== t.dataset.id);
    else v[t.dataset.g] = t.dataset.id;
    render();
  });

  /* ---------- Seat modal (opens from a seat card, limited to that card's rows) ---------- */
  const modal = new bootstrap.Modal('#seatModal'); let activeKey = null, activeCat = null;
  const grid = document.getElementById('seatGrid');
  const taken = new Set(['12B', '12C', '14A', '15D', '15E', '18F', '20A', '20B']);
  function seat(r, c) {
    const id = r + c, cat = activeCat, pr = cat.price;
    const usedByOther = Object.entries(state.services).some(([k, v]) => k.split('|')[0] === activeKey.split('|')[0] && k !== activeKey && v.seat && v.seat.id === id);
    const mine = state.services[activeKey].seat?.id === id;
    const inCat = r >= cat.rows[0] && r <= cat.rows[1];
    const cls = mine ? 'mine' : (!inCat || taken.has(id) || usedByOther) ? 'taken' : pr ? 'paid' : '';
    return `<button type="button" class="seat ${cls}" data-id="${id}" ${cls === 'taken' ? 'disabled' : ''} aria-label="Seat ${id}">${id}</button>`;
  }
  function drawSeats() {
    let h = '';
    for (let r = 10; r <= 24; r++) {
      ['A', 'B', 'C'].forEach(c => h += seat(r, c)); h += `<div class="seat-row">${r}</div>`; ['D', 'E', 'F'].forEach(c => h += seat(r, c));
    }
    grid.innerHTML = h;
  }
  panes.addEventListener('click', e => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    const cat = CATALOG.seat.find(c => c.id === b.dataset.cat); activeKey = b.dataset.k;
    if (cat.id === 'auto') { state.services[activeKey].seat = null; render(); return; }
    activeCat = cat;
    const [seg, who] = activeKey.split('|');
    document.getElementById('seatTitle').textContent = cat.name;
    document.getElementById('seatSub').textContent = `${SEGMENTS.find(x => x.id === seg).label} · ${who.replace(/(\D+)(\d+)/, '$1 $2')} · ${cat.price ? inr(cat.price) : 'Free'}`;
    drawSeats(); modal.show();
  });
  grid.addEventListener('click', e => {
    const s = e.target.closest('.seat'); if (!s || s.disabled) return;
    state.services[activeKey].seat = { id: s.dataset.id, price: activeCat.price, cat: activeCat.id };
    drawSeats(); render();
  });
  document.getElementById('seatClear').addEventListener('click', () => { state.services[activeKey].seat = null; drawSeats(); render(); });

  /* ---------- Insurance ---------- */
  document.getElementById('insList').innerHTML = PLANS.map(p => `
    <div class="col-md-6 col-xl-4"><input type="radio" class="btn-check ins-input" name="ins" id="ins-${p.id}" value="${p.id}" autocomplete="off">
      <label class="card-box ins-card d-block" for="ins-${p.id}">
        <div class="d-flex gap-2 align-items-start"><div class="ins-logo">BA</div>
          <div class="flex-grow-1"><div class="fw-semibold">Bajaj Allianz</div><div class="small text-muted">${p.name}</div></div>
          <span class="check"><i class="bi bi-check-lg"></i></span></div>
        <div class="small mt-2 text-muted">${p.cover}</div>
        <div class="d-flex justify-content-between align-items-end mt-2 pt-2 border-top"><span class="small text-muted">Total premium</span><span class="fw-bold fs-5">${inr(p.price)}</span></div>
      </label></div>`).join('') + `<div class="col-12"><button type="button" class="btn btn-link p-0 small text-muted d-none" id="insClear">No insurance, remove selection</button></div>`;
  document.getElementById('insList').addEventListener('change', e => { if (e.target.name === 'ins') { state.insurance = PLANS.find(p => p.id === e.target.value); render(); } });
  document.getElementById('insClear').addEventListener('click', () => { document.querySelectorAll('[name=ins]').forEach(r => r.checked = false); state.insurance = null; render(); });

  /* ---------- Fare summary ---------- */
  function render() {
    let bag = 0, meal = 0, seats = 0, spec = 0;
    const price = (g, id) => (CATALOG[g].find(i => i.id === id) || { price: 0 }).price;
    Object.entries(state.services).forEach(([k, v]) => {
      bag += price('bag', v.bag); meal += price('meal', v.meal); seats += v.seat ? v.seat.price : 0;
      spec += v.special.reduce((t, id) => t + price('special', id), 0);
      const row = document.querySelector(`[data-key="${k}"]`);
      row.querySelectorAll('.addon-input').forEach(i => i.checked = i.dataset.g === 'special' ? v.special.includes(i.dataset.id) : v[i.dataset.g] === i.dataset.id);
      row.querySelectorAll('[data-cat]').forEach(b => {
        const on = v.seat ? v.seat.cat === b.dataset.cat : b.dataset.cat === 'auto';
        b.classList.toggle('selected', on);
        const d = b.querySelector('.addon-desc'); d.textContent = on && v.seat ? `Seat ${v.seat.id} · tap to change` : d.dataset.desc;
      });
      const marks = { bag: !!v.bag, meal: !!v.meal, seat: !!v.seat, special: v.special.length > 0 };
      Object.entries(marks).forEach(([g, on]) => row.querySelector(`[data-dot="${g}"]`).classList.toggle('on', on));
      const lab = i => (CATALOG.bag.find(x => x.id === v.bag) || {}).name;
      row.querySelector('[data-chips]').innerHTML = [
        v.bag && `<span class="chip"><i class="bi bi-suitcase2"></i>${lab()}</span>`,
        v.meal && `<span class="chip"><i class="bi bi-cup-hot"></i>${CATALOG.meal.find(x => x.id === v.meal).name}</span>`,
        v.seat && `<span class="chip"><i class="bi bi-grid-3x2-gap"></i>${v.seat.id}</span>`,
        v.special.length && `<span class="chip"><i class="bi bi-stars"></i>${v.special.length} special</span>`
      ].filter(Boolean).join('') || '<span class="text-muted small fw-normal">No add-ons</span>';
    });
    const ins = state.insurance ? state.insurance.price : 0, extras = bag + meal + seats + spec + ins;
    const total = (FARE.base + FARE.tax) * PAX.length + FARE.fee + extras;
    const line = (l, v) => `<div><dt>${l}</dt><dd>${v}</dd></div>`, extra = (l, v) => v ? line(l, inr(v)) : '';
    document.getElementById('fareList').innerHTML =
      line(`Base fare (${PAX.map(p => p.type + ' × 1').join(', ')})`, inr(FARE.base * PAX.length)) +
      line('Taxes', inr(FARE.tax * PAX.length)) + line('T.Fee & S.Charges', inr(FARE.fee)) +
      (extras ? '<div class="group"></div>' : '') +
      extra('Excess baggage', bag) + extra('Meals', meal) + extra('Seats', seats) + extra('Special services', spec) + extra('Insurance', ins);
    document.getElementById('grandTotal').textContent = inr(total);
    document.getElementById('barTotal').textContent = inr(total);
    document.getElementById('insClear').classList.toggle('d-none', !state.insurance);
  }

  /* ---------- Validation & continue ---------- */
  const form = document.getElementById('bookingForm'), gst = document.getElementById('gstBox');
  gst.addEventListener('hide.bs.collapse', () => document.querySelectorAll('.gst-field').forEach(f => { f.required = false; f.value = ''; f.classList.remove('is-invalid'); }));
  gst.addEventListener('show.bs.collapse', () => document.querySelectorAll('.gst-field').forEach(f => f.required = true));
  document.querySelectorAll('[data-continue]').forEach(b => b.addEventListener('click', () => {
    form.classList.add('was-validated');
    if (form.checkValidity()) { saveBooking(); window.location.href = 'booking-review.html'; return; }
    const bad = form.querySelector(':invalid');
    const col = bad.closest('.collapse'); if (col && !col.classList.contains('show')) new bootstrap.Collapse(col, { toggle: true });
    bad.scrollIntoView({ behavior: 'smooth', block: 'center' }); bad.focus({ preventScroll: true });
    document.getElementById('toastMsg').textContent = 'Please fix the highlighted fields to continue.';
    bootstrap.Toast.getOrCreateInstance('#toast').show();
  }));

  /* ---------- Save for review page / restore when user clicks Edit ---------- */
  const val = id => (document.getElementById(id) || {}).value || '';
  function saveBooking() {
    const fields = {};
    form.querySelectorAll('input[id],select[id]').forEach(f => { if (!f.classList.contains('addon-input') && f.name !== 'ins' && f.id !== 'gstToggle') fields[f.id] = f.value; });
    const gstOn = document.getElementById('gstToggle').checked, price = (g, id) => (CATALOG[g].find(i => i.id === id) || { price: 0 }).price;
    const fare = { base: FARE.base * PAX.length, tax: FARE.tax * PAX.length, fee: FARE.fee, bag: 0, meal: 0, seats: 0, spec: 0, ins: state.insurance ? state.insurance.price : 0 };
    const addons = Object.entries(state.services).map(([k, v]) => {
      const [seg, who] = k.split('|'), items = [], find = (g, id) => CATALOG[g].find(i => i.id === id);
      if (v.bag) { items.push({ g: 'Baggage', icon: 'bi-suitcase2', text: find('bag', v.bag).name, price: price('bag', v.bag) }); fare.bag += price('bag', v.bag); }
      if (v.meal) { items.push({ g: 'Meal', icon: 'bi-cup-hot', text: find('meal', v.meal).name, price: price('meal', v.meal) }); fare.meal += price('meal', v.meal); }
      if (v.seat) { items.push({ g: 'Seat', icon: 'bi-grid-3x2-gap', text: `${v.seat.id} · ${find('seat', v.seat.cat).name}`, price: v.seat.price }); fare.seats += v.seat.price; }
      v.special.forEach(id => { items.push({ g: 'Special', icon: 'bi-stars', text: find('special', id).name, price: price('special', id) }); fare.spec += price('special', id); });
      return { seg: SEGMENTS.find(x => x.id === seg).label, who: who.replace(/(\D+)(\d+)/, '$1 $2'), items };
    });
    fare.total = fare.base + fare.tax + fare.fee + fare.bag + fare.meal + fare.seats + fare.spec + fare.ins;
    const view = {
      pax: PAX.map((p, i) => ({ label: `${p.type} ${p.n}`, name: `${val(`pax${i}t`)} ${val(`pax${i}f`)} ${val(`pax${i}l`)}`, gender: val(`pax${i}g`), dob: val(`pax${i}d`) })),
      contact: { phone: val('phone'), email: val('email') },
      gst: gstOn ? { no: val('gstNo'), email: val('gstEmail'), phone: val('gstPhone'), name: val('gstName'), addr: val('gstAddr') } : null,
      addons, insurance: state.insurance, fare
    };
    try { sessionStorage.setItem('b2b_booking', JSON.stringify({ fields, gstOn, state, view })); } catch (e) {}
  }
  function restoreBooking() {
    let d; try { d = JSON.parse(sessionStorage.getItem('b2b_booking')); } catch (e) {} if (!d) return;
    Object.entries(d.fields).forEach(([id, v]) => { const el = document.getElementById(id); if (el) { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); } });
    if (d.gstOn) { document.getElementById('gstToggle').checked = true; bootstrap.Collapse.getOrCreateInstance(gst, { toggle: false }).show(); }
    Object.keys(state.services).forEach(k => { if (d.state.services[k]) state.services[k] = d.state.services[k]; });
    if (d.state.insurance) { state.insurance = PLANS.find(x => x.id === d.state.insurance.id); const r = document.getElementById('ins-' + state.insurance.id); if (r) r.checked = true; }
  }

  restoreBooking();
  render();
})();
