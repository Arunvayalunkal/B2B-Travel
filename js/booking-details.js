(() => {
  'use strict';
  const inr = n => '₹' + Number(n).toLocaleString('en-IN');

  /* ---------- Sample data (replace with API data) ---------- */
  const FARE = { base: 5769, tax: 859, fee: 0 };
  // Add { type:'Child', n:1 } / { type:'Infant', n:1 } here for more passengers
  const PAX = [{ type: 'Adult', n: 1 }];
  const SEGMENTS = [{ id: 'doh-dxb', label: 'DOH → DXB' }, { id: 'dxb-doh', label: 'DXB → DOH' }];
  const BAGGAGE = [['', 'No extra baggage', 0], ['5', '+5 kg', 1500], ['10', '+10 kg', 2800], ['20', '+20 kg', 5200]];
  const MEALS = [['', 'No meal', 0], ['veg', 'Veg platter', 450], ['nonveg', 'Non-veg platter', 520]];
  const PLANS = [
    { id: 'silver', name: 'Travel Ace Lite - Silver', price: 899, cover: 'Medical cover up to ₹5 lakh' },
    { id: 'gold', name: 'Travel Ace Lite - Gold', price: 1398, cover: 'Medical cover up to ₹10 lakh' },
    { id: 'plat', name: 'Travel Ace Lite - Platinum', price: 2150, cover: 'Medical cover up to ₹25 lakh' }
  ];

  /* ---------- State ---------- */
  const state = { services: {}, insurance: null };
  const key = (seg, p) => `${seg}|${p.type}${p.n}`;
  SEGMENTS.forEach(s => PAX.forEach(p => state.services[key(s.id, p)] = { bag: '', meal: '', seat: null }));

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

  /* ---------- Add-ons: tabs per flight, row per passenger (no horizontal scroll) ---------- */
  const tabs = document.getElementById('segTabs'), panes = document.getElementById('segPanes');
  const opts = (list, sel) => list.map(([v, l, pr]) => `<option value="${v}" ${v === sel ? 'selected' : ''}>${l}${pr ? ' – ' + inr(pr) : ''}</option>`).join('');
  SEGMENTS.forEach((s, i) => {
    tabs.insertAdjacentHTML('beforeend', `<li class="nav-item" role="presentation"><button class="nav-link ${i ? '' : 'active'}" data-bs-toggle="tab" data-bs-target="#seg-${s.id}" type="button" role="tab">${s.label}</button></li>`);
    panes.insertAdjacentHTML('beforeend', `<div class="tab-pane fade ${i ? '' : 'show active'}" id="seg-${s.id}" role="tabpanel">${PAX.map(p => `
      <div class="svc-row" data-key="${key(s.id, p)}">
        <div class="svc-name mb-2"><i class="bi bi-person me-1"></i>${p.type} ${p.n} <small class="text-muted" data-summary></small></div>
        <div class="row g-2">
          <div class="col-12 col-md-4"><label class="form-label"><i class="bi bi-suitcase2 me-1"></i>Extra baggage</label><select class="form-select" data-f="bag">${opts(BAGGAGE, '')}</select></div>
          <div class="col-12 col-md-4"><label class="form-label"><i class="bi bi-cup-hot me-1"></i>Meal</label><select class="form-select" data-f="meal">${opts(MEALS, '')}</select></div>
          <div class="col-12 col-md-4"><label class="form-label"><i class="bi bi-grid-3x2-gap me-1"></i>Seat</label>
            <button type="button" class="btn btn-outline-primary seat-btn" data-seat><span data-seat-label>Select seat</span><i class="bi bi-chevron-right"></i></button></div>
        </div></div>`).join('')}</div>`);
  });
  panes.addEventListener('change', e => {
    const row = e.target.closest('[data-key]'); if (!row || !e.target.dataset.f) return;
    state.services[row.dataset.key][e.target.dataset.f] = e.target.value; render();
  });

  /* ---------- Seat modal ---------- */
  const modal = new bootstrap.Modal('#seatModal'); let activeKey = null;
  const grid = document.getElementById('seatGrid');
  const taken = new Set(['12B', '12C', '14A', '15D', '15E', '18F', '20A', '20B']);
  function seatPrice(r) { return r <= 12 ? 600 : r <= 16 ? 350 : 0; }
  function drawSeats() {
    let h = '';
    for (let r = 10; r <= 24; r++) {
      ['A', 'B', 'C'].forEach(c => h += seat(r, c));
      h += `<div class="seat-row">${r}</div>`;
      ['D', 'E', 'F'].forEach(c => h += seat(r, c));
    }
    grid.innerHTML = h;
  }
  function seat(r, c) {
    const id = r + c, pr = seatPrice(r);
    const usedByOther = Object.entries(state.services).some(([k, v]) => k.split('|')[0] === activeKey.split('|')[0] && k !== activeKey && v.seat && v.seat.id === id);
    const mine = state.services[activeKey].seat?.id === id;
    const cls = mine ? 'mine' : (taken.has(id) || usedByOther) ? 'taken' : pr ? 'paid' : '';
    return `<button type="button" class="seat ${cls}" data-id="${id}" data-price="${pr}" ${cls === 'taken' ? 'disabled' : ''} title="${id}${pr ? ' · ' + inr(pr) : ' · Free'}" aria-label="Seat ${id}, ${pr ? inr(pr) : 'free'}">${id}</button>`;
  }
  panes.addEventListener('click', e => {
    const b = e.target.closest('[data-seat]'); if (!b) return;
    activeKey = b.closest('[data-key]').dataset.key;
    const [seg, who] = activeKey.split('|');
    document.getElementById('seatSub').textContent = `${SEGMENTS.find(s => s.id === seg).label} · ${who.replace(/(\D+)(\d+)/, '$1 $2')}`;
    drawSeats(); modal.show();
  });
  grid.addEventListener('click', e => {
    const s = e.target.closest('.seat'); if (!s || s.disabled) return;
    state.services[activeKey].seat = { id: s.dataset.id, price: +s.dataset.price };
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
    let bag = 0, meal = 0, seats = 0;
    Object.entries(state.services).forEach(([k, v]) => {
      bag += (BAGGAGE.find(b => b[0] === v.bag) || [0, 0, 0])[2];
      meal += (MEALS.find(m => m[0] === v.meal) || [0, 0, 0])[2];
      seats += v.seat ? v.seat.price : 0;
      const row = document.querySelector(`[data-key="${k}"]`);
      row.querySelector('[data-seat-label]').textContent = v.seat ? `Seat ${v.seat.id}${v.seat.price ? ' · ' + inr(v.seat.price) : ''}` : 'Select seat';
      row.querySelector('[data-summary]').textContent = [v.bag && `+${v.bag}kg`, v.meal && 'meal', v.seat && v.seat.id].filter(Boolean).join(' · ');
    });
    const ins = state.insurance ? state.insurance.price : 0;
    const total = FARE.base * PAX.length + FARE.tax * PAX.length + FARE.fee + bag + meal + seats + ins;
    const line = (l, v, cls = '') => `<div class="${cls}"><dt>${l}</dt><dd>${v}</dd></div>`;
    const extra = (l, v) => v ? line(l, inr(v)) : '';
    document.getElementById('fareList').innerHTML =
      line(`Base fare (${PAX.map(p => p.type + ' × 1').join(', ')})`, inr(FARE.base * PAX.length)) +
      line('Taxes', inr(FARE.tax * PAX.length)) + line('T.Fee & S.Charges', inr(FARE.fee)) +
      ((bag + meal + seats + ins) ? '<div class="group"></div>' : '') +
      extra('Excess baggage', bag) + extra('Meals', meal) + extra('Seats', seats) + extra('Insurance', ins);
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
    if (form.checkValidity()) { window.location.href = '#review'; return; }
    const bad = form.querySelector(':invalid');
    const col = bad.closest('.collapse'); if (col && !col.classList.contains('show')) new bootstrap.Collapse(col, { toggle: true });
    bad.scrollIntoView({ behavior: 'smooth', block: 'center' }); bad.focus({ preventScroll: true });
    document.getElementById('toastMsg').textContent = 'Please fix the highlighted fields to continue.';
    bootstrap.Toast.getOrCreateInstance('#toast').show();
  }));

  render();
})();
