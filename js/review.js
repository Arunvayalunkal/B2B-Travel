(() => {
  'use strict';
  const inr = n => '₹' + Number(n).toLocaleString('en-IN');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = id => document.getElementById(id);

  // Data comes from the booking page (sessionStorage). Sample data is used if opened directly.
  let data; try { data = JSON.parse(sessionStorage.getItem('b2b_booking')).view; } catch (e) {}
  if (!data) {
    $('demoNote').classList.remove('d-none');
    data = {
      pax: [{ label: 'Adult 1', name: 'Mr John Doe', gender: 'Male', dob: '1990-05-14' }],
      contact: { phone: '9876543210', email: 'john@example.com' }, gst: null,
      addons: [
        { seg: 'DOH → DXB', who: 'Adult 1', items: [{ g: 'Baggage', icon: 'bi-suitcase2', text: '+10 kg', price: 2800 }, { g: 'Seat', icon: 'bi-grid-3x2-gap', text: '14C · Preferred seat', price: 350 }] },
        { seg: 'DXB → DOH', who: 'Adult 1', items: [] }
      ],
      insurance: { name: 'Travel Ace Lite - Gold', price: 1398, cover: 'Medical cover up to ₹10 lakh' },
      fare: { base: 5769, tax: 859, fee: 0, bag: 2800, meal: 0, seats: 350, spec: 0, ins: 1398, total: 11176 }
    };
  }

  const fmtDob = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  $('rvPax').innerHTML = data.pax.map(p => `
    <div class="pax-row"><div class="pax-avatar"><i class="bi bi-person-fill"></i></div>
      <div class="flex-grow-1"><div class="fw-semibold">${esc(p.name)}</div>
        <div class="small text-muted">${esc(p.gender || '—')} · DOB ${fmtDob(p.dob)}</div></div>
      <span class="badge text-bg-light border">${esc(p.label)}</span></div>`).join('');

  $('rvContact').innerHTML = `
    <div class="col-sm-6"><div class="small text-muted">Mobile</div><div class="fw-medium">+91 ${esc(data.contact.phone)}</div></div>
    <div class="col-sm-6"><div class="small text-muted">Email</div><div class="fw-medium text-break">${esc(data.contact.email)}</div></div>`;

  if (data.gst) {
    $('rvGstBox').classList.remove('d-none');
    const rows = [['GST number', data.gst.no], ['Company name', data.gst.name], ['Company email', data.gst.email], ['Company contact', data.gst.phone], ['Company address', data.gst.addr]];
    $('rvGst').innerHTML = rows.map(([l, v]) => `<dt class="col-5 col-md-3 text-muted fw-normal">${l}</dt><dd class="col-7 col-md-9 mb-0 fw-medium text-break">${esc(v)}</dd>`).join('');
  }

  // Add-ons grouped by flight
  const bySeg = {}; data.addons.forEach(a => (bySeg[a.seg] = bySeg[a.seg] || []).push(a));
  $('rvAddons').innerHTML = Object.entries(bySeg).map(([seg, list]) => `
    <div class="addon-seg"><div class="addon-seg-title">${esc(seg)}</div>
      ${list.map(a => `<div class="addon-who"><div class="small fw-semibold mb-1">${esc(a.who)}</div>
        ${a.items.length ? a.items.map(i => `<div class="addon-line"><span><i class="bi ${i.icon} me-2 text-primary"></i><span class="text-muted">${i.g}:</span> ${esc(i.text)}</span><b>${i.price ? inr(i.price) : 'Free'}</b></div>`).join('') : '<div class="small text-muted">No add-ons selected</div>'}</div>`).join('')}
    </div>`).join('');

  $('rvIns').innerHTML = data.insurance
    ? `<div class="d-flex align-items-center gap-3"><div class="ins-logo">BA</div><div class="flex-grow-1"><div class="fw-semibold">Bajaj Allianz</div><div class="small text-muted">${esc(data.insurance.name)}${data.insurance.cover ? ' · ' + esc(data.insurance.cover) : ''}</div></div><b>${inr(data.insurance.price)}</b></div>`
    : '<div class="small text-muted"><i class="bi bi-x-circle me-1"></i>No insurance selected. <a href="index.html">Add insurance</a></div>';

  // Fare summary
  const f = data.fare, line = (l, v) => `<div><dt>${l}</dt><dd>${inr(v)}</dd></div>`, extra = (l, v) => v ? line(l, v) : '';
  const extras = f.bag + f.meal + f.seats + f.spec + f.ins;
  $('fareList').innerHTML = line('Base fare', f.base) + line('Taxes', f.tax) + line('T.Fee & S.Charges', f.fee) + (extras ? '<div class="group"></div>' : '') +
    extra('Excess baggage', f.bag) + extra('Meals', f.meal) + extra('Seats', f.seats) + extra('Special services', f.spec) + extra('Insurance', f.ins);
  $('grandTotal').textContent = $('barTotal').textContent = inr(f.total);

  // Terms gate + pay
  const pay = document.querySelectorAll('[data-pay]');
  $('terms').addEventListener('change', e => pay.forEach(b => b.disabled = !e.target.checked));
  pay.forEach(b => b.addEventListener('click', () => {
    // TODO: navigate to your payment page, e.g. window.location.href = 'payment.html';
    $('toastMsg').textContent = 'Proceeding to payment…'; bootstrap.Toast.getOrCreateInstance('#toast').show();
  }));
})();
