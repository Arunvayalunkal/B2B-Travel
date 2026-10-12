// Replace this array with your real API response.
const fares = [
  { name: 'Saver',   price: 28950, publish: 29950, commission: 500, cabin: '7 kg',  checkin: '15 kg',
    cancel: { text: 'Non-refundable', tone: 'danger' }, change: { text: 'Not allowed', tone: 'danger' }, badge: 'Lowest price' },
  { name: 'Special', price: 29400, publish: 30400, commission: 550, cabin: '7 kg',  checkin: '20 kg',
    cancel: { text: 'Fee ₹3,500', tone: 'primary' },    change: { text: 'Fee ₹2,500', tone: 'primary' } },
  { name: 'Flexi',   price: 30150, publish: 31150, commission: 600, cabin: '7 kg',  checkin: '25 kg',
    cancel: { text: 'Fee ₹2,000', tone: 'primary' },    change: { text: 'Free', tone: 'success' }, badge: 'Best value' },
  { name: 'Gold',    price: 31200, publish: 32200, commission: 700, cabin: '10 kg', checkin: '30 kg',
    cancel: { text: 'Free', tone: 'success' },          change: { text: 'Free', tone: 'success' } }
];

const money = n => '₹' + n.toLocaleString('en-IN');
const list = document.getElementById('fareList');
let selected = 0;

function render() {
  list.innerHTML = fares.map((f, i) => `
    <div class="fare-row ${i === selected ? 'selected' : ''}" data-index="${i}"
         role="radio" aria-checked="${i === selected}" tabindex="0">
      <div class="row g-2 align-items-center">
        <div class="col-12 col-md-3 d-flex align-items-center gap-2">
          <span class="fare-radio"></span>
          <div>
            <div class="fw-semibold">${f.name}</div>
            ${f.badge ? `<span class="badge bg-primary-subtle text-primary-emphasis">${f.badge}</span>` : ''}
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

list.addEventListener('click', e => {
  const row = e.target.closest('.fare-row');
  if (row) { selected = +row.dataset.index; render(); }
});
list.addEventListener('keydown', e => {
  const row = e.target.closest('.fare-row');
  if (row && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); selected = +row.dataset.index; render(); row.focus(); }
});
document.getElementById('bookBtn').addEventListener('click', () => alert('Booking fare: ' + fares[selected].name));

render();
