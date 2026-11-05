// Replace this array with your real API response (fare + rules).
const TIMES = ['More than 24 hrs before departure', 'Within 24 hrs of departure', 'No-show (after departure)'];
const fares = [
  { name: 'Saver', price: 28950, publish: 29950, commission: 500, cabin: '7 kg', checkin: '15 kg',
    cancel: { text: 'Non-refundable', tone: 'danger' }, change: { text: 'Not allowed', tone: 'danger' }, badge: 'Lowest price',
    rules: {
      cancel: [['danger', 'Not permitted'], ['danger', 'Not permitted'], ['danger', 'Not permitted']],
      change: [['danger', 'Not permitted'], ['danger', 'Not permitted'], ['danger', 'Not permitted']],
      note: 'Airport taxes may be refundable on request. Contact support with the ticket number.',
      seat: 'Paid', meal: 'Paid', miles: '50%'
    } },
  { name: 'Special', price: 29400, publish: 30400, commission: 550, cabin: '7 kg', checkin: '20 kg',
    cancel: { text: 'Fee ₹3,500', tone: 'warning' }, change: { text: 'Fee ₹2,500', tone: 'warning' },
    rules: {
      cancel: [['warning', '₹3,500'], ['warning', '₹4,500'], ['danger', 'Not permitted']],
      change: [['warning', '₹2,500 + fare difference'], ['warning', '₹3,500 + fare difference'], ['danger', 'Not permitted']],
      note: 'Date change is subject to seat availability in the same booking class.',
      seat: 'Paid', meal: 'Included', miles: '75%'
    } },
  { name: 'Flexi', price: 30150, publish: 31150, commission: 600, cabin: '7 kg', checkin: '25 kg',
    cancel: { text: 'Fee ₹2,000', tone: 'warning' }, change: { text: 'Free', tone: 'success' }, badge: 'Best value',
    rules: {
      cancel: [['warning', '₹2,000'], ['warning', '₹3,000'], ['danger', 'Not permitted']],
      change: [['success', 'Free + fare difference'], ['warning', '₹1,500 + fare difference'], ['danger', 'Not permitted']],
      note: 'One free date change per passenger. Further changes are charged at the standard fee.',
      seat: 'Included', meal: 'Included', miles: '100%'
    } },
  { name: 'Gold', price: 31200, publish: 32200, commission: 700, cabin: '10 kg', checkin: '30 kg',
    cancel: { text: 'Free', tone: 'success' }, change: { text: 'Free', tone: 'success' },
    rules: {
      cancel: [['success', 'Free'], ['success', 'Free'], ['warning', '₹3,000']],
      change: [['success', 'Free + fare difference'], ['success', 'Free + fare difference'], ['warning', '₹3,000 + fare difference']],
      note: 'Fully flexible fare. Priority check-in and boarding included.',
      seat: 'Included', meal: 'Included', miles: '125%'
    } }
];

const money = n => '₹' + n.toLocaleString('en-IN');
const ICON = { success: 'check-circle-fill', warning: 'exclamation-circle-fill', danger: 'x-circle-fill' };
const list = document.getElementById('fareList');
let selected = 0, ruleIndex = 0;

function render() {
  list.innerHTML = fares.map((f, i) => `
    <div class="fare-row ${i === selected ? 'selected' : ''}" data-index="${i}"
         role="radio" aria-checked="${i === selected}" tabindex="0">
      <div class="row g-2 align-items-center">
        <div class="col-12 col-md-3 d-flex align-items-center gap-2">
          <span class="fare-radio"></span>
          <div>
            <div class="fw-semibold">${f.name}</div>
            ${f.badge ? `<span class="badge bg-primary-subtle text-primary-emphasis">${f.badge}</span><br>` : ''}
            <a href="#" class="fare-link" data-rule="${i}"><i class="bi bi-file-text"></i> Fare rules</a>
          </div>
        </div>
        <div class="col-4 col-md-1"><span class="mlabel">Cabin</span>${f.cabin}</div>
        <div class="col-4 col-md-2"><span class="mlabel">Check-in</span>${f.checkin}</div>
        <div class="col-4 col-md-2"><span class="mlabel">Cancel</span><span class="fw-medium text-${f.cancel.tone}">${f.cancel.text}</span></div>
        <div class="col-6 col-md-2"><span class="mlabel">Change</span><span class="fw-medium text-${f.change.tone}">${f.change.text}</span></div>
        <div class="col-6 col-md-2 text-end">
          <div class="fs-5 fw-semibold lh-sm">${money(f.price)}</div>
          <small class="text-body-secondary text-decoration-line-through">${money(f.publish)}</small>
        </div>
      </div>
    </div>`).join('');

  const f = fares[selected];
  document.getElementById('selName').textContent = f.name;
  document.getElementById('netFare').textContent = money(f.price - f.commission);
  document.getElementById('commission').textContent = '+ ' + money(f.commission);
  document.getElementById('totalPrice').textContent = money(f.price);
}

/* ---------- Fare rules modal ---------- */
const modal = new bootstrap.Modal(document.getElementById('ruleModal'));

const chip = (tone, icon, text) =>
  `<span class="rule-chip bg-${tone}-subtle text-${tone}-emphasis"><i class="bi bi-${icon}"></i>${text}</span>`;

const feeCell = ([tone, text]) =>
  `<span class="fw-semibold text-${tone}-emphasis"><i class="bi bi-${ICON[tone]} text-${tone}"></i> ${text}</span>`;

const ruleTable = rows => `
  <div class="table-responsive border rounded">
    <table class="table table-hover rule-table align-middle mb-0">
      <thead class="table-light"><tr><th>When</th><th>Fee per passenger</th></tr></thead>
      <tbody>${rows.map((r, i) => `<tr><td>${TIMES[i]}</td><td>${feeCell(r)}</td></tr>`).join('')}</tbody>
    </table>
  </div>`;

function openRules(i) {
  ruleIndex = i;
  const f = fares[i], r = f.rules;
  document.getElementById('ruleTitle').textContent = f.name + ' fare rules';
  document.getElementById('rulePrice').textContent = money(f.price);

  document.getElementById('ruleChips').innerHTML =
    chip('secondary', 'backpack', 'Cabin ' + f.cabin) +
    chip('secondary', 'luggage', 'Check-in ' + f.checkin) +
    chip(f.cancel.tone, ICON[f.cancel.tone], 'Cancel: ' + f.cancel.text) +
    chip(f.change.tone, ICON[f.change.tone], 'Change: ' + f.change.text);

  document.getElementById('tab-cancel').innerHTML = ruleTable(r.cancel) + `<div class="rule-note mt-3">${r.note}</div>`;
  document.getElementById('tab-change').innerHTML = ruleTable(r.change) + `<div class="rule-note mt-3">Fare difference and taxes are charged on top of the change fee.</div>`;
  document.getElementById('tab-bag').innerHTML = `
    <div class="row g-3">
      <div class="col-6"><div class="border rounded p-3 h-100"><i class="bi bi-backpack fs-4 text-primary"></i>
        <div class="small text-body-secondary mt-1">Cabin baggage</div><div class="fs-5 fw-semibold">${f.cabin}</div></div></div>
      <div class="col-6"><div class="border rounded p-3 h-100"><i class="bi bi-luggage fs-4 text-primary"></i>
        <div class="small text-body-secondary mt-1">Check-in baggage</div><div class="fs-5 fw-semibold">${f.checkin}</div></div></div>
    </div>
    <div class="rule-note mt-3">Excess baggage is charged at the airport. Pre-book online for a lower rate.</div>`;
  document.getElementById('tab-other').innerHTML = `
    <ul class="list-unstyled rule-list mb-0">
      <li><i class="bi bi-person-check text-primary"></i><strong>Seat selection:</strong> ${r.seat}</li>
      <li><i class="bi bi-cup-hot text-primary"></i><strong>Meal:</strong> ${r.meal}</li>
      <li><i class="bi bi-award text-primary"></i><strong>Miles earned:</strong> ${r.miles}</li>
      <li><i class="bi bi-clock-history text-primary"></i><strong>Fee timing:</strong> Based on scheduled departure time at the origin airport.</li>
    </ul>`;

  const btn = document.getElementById('ruleSelectBtn');
  btn.textContent = i === selected ? 'Selected' : 'Select this fare';
  btn.disabled = i === selected;

  bootstrap.Tab.getOrCreateInstance(document.querySelector('#ruleTabs .nav-link')).show();
  modal.show();
}

document.getElementById('ruleSelectBtn').addEventListener('click', () => {
  selected = ruleIndex; render(); modal.hide();
});

/* ---------- Events ---------- */
list.addEventListener('click', e => {
  const link = e.target.closest('[data-rule]');
  if (link) { e.preventDefault(); openRules(+link.dataset.rule); return; }
  const row = e.target.closest('.fare-row');
  if (row) { selected = +row.dataset.index; render(); }
});
list.addEventListener('keydown', e => {
  if (e.target.closest('[data-rule]')) return;
  const row = e.target.closest('.fare-row');
  if (row && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); selected = +row.dataset.index; render(); row.focus(); }
});
document.getElementById('bookBtn').addEventListener('click', () => alert('Booking fare: ' + fares[selected].name));

render();
