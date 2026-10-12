(() => {
  'use strict';
  const inr = n => '₹' + Number(n).toLocaleString('en-IN');
  const $ = id => document.getElementById(id);
  const WALLET = { balance: 18476174.81, limit: 22500435.00 };   // replace with API data
  const METHODS = [['wallet', 'BTA Wallet', 'bi-wallet2'], ['credit', 'Credit Card', 'bi-credit-card-2-front'], ['debit', 'Debit Card', 'bi-credit-card'], ['netbanking', 'Net Banking', 'bi-bank'], ['upi', 'UPI', 'bi-phone']];
  const BANKS = ['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Yes Bank'];
  const UPI_SFX = ['@okhdfcbank', '@oksbi', '@ybl', '@paytm'];

  /* ---------- Fare summary (from review/booking page) ---------- */
  let f; try { f = JSON.parse(sessionStorage.getItem('b2b_booking')).view.fare; } catch (e) {}
  f = f || { base: 5769, tax: 859, fee: 0, bag: 0, meal: 0, seats: 0, spec: 0, ins: 0, total: 6628 };
  const line = (l, v) => `<div><dt>${l}</dt><dd>${inr(v)}</dd></div>`, extra = (l, v) => v ? line(l, v) : '';
  $('fareList').innerHTML = line('Base fare', f.base) + line('Taxes', f.tax) + line('T.Fee & S.Charges', f.fee) +
    ((f.bag + f.meal + f.seats + f.spec + f.ins) ? '<div class="group"></div>' : '') +
    extra('Excess baggage', f.bag) + extra('Meals', f.meal) + extra('Seats', f.seats) + extra('Special services', f.spec) + extra('Insurance', f.ins);
  $('grandTotal').textContent = $('barTotal').textContent = inr(f.total);
  document.querySelectorAll('.pay-label').forEach(l => l.textContent = `Pay Now ${inr(f.total)}`);

  /* ---------- Method tiles ---------- */
  $('methods').innerHTML = METHODS.map(([id, label, ic], i) => `
    <div class="col-4 col-md"><input type="radio" class="btn-check pm-input" name="pm" id="pm-${id}" value="${id}" ${i ? '' : 'checked'} autocomplete="off">
    <label class="pm-tile" for="pm-${id}"><span class="pm-dot"><i class="bi bi-check-lg"></i></span><i class="bi ${ic} pm-ic"></i><span>${label}</span></label></div>`).join('');
  let method = 'wallet';
  const showPanel = () => document.querySelectorAll('.pm-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === method));
  $('methods').addEventListener('change', e => { method = e.target.value; showPanel(); });

  /* ---------- Wallet ---------- */
  $('wBal').textContent = '₹ ' + WALLET.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  $('wLimit').textContent = '₹ ' + WALLET.limit.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const walletOk = f.total <= WALLET.balance;
  $('wNote').className = 'alert small mt-3 mb-0 ' + (walletOk ? 'alert-success' : 'alert-danger');
  $('wNote').innerHTML = walletOk
    ? `<i class="bi bi-check-circle me-1"></i>${inr(f.total)} will be deducted. Balance after payment: <b>₹ ${(WALLET.balance - f.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</b>`
    : '<i class="bi bi-exclamation-circle me-1"></i>Insufficient wallet balance. Recharge your wallet or choose another method.';

  /* ---------- Card forms (credit + debit) ---------- */
  const cardForm = p => `
    <div class="row g-3">
      <div class="col-12"><label class="form-label" for="${p}Num">Card number</label>
        <div class="position-relative"><input class="form-control pe-5" id="${p}Num" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" maxlength="23"><span class="brand-tag" id="${p}Brand"></span></div>
        <div class="invalid-feedback">Enter a valid card number.</div></div>
      <div class="col-12"><label class="form-label" for="${p}Name">Name on card</label><input class="form-control" id="${p}Name" autocomplete="cc-name" placeholder="As printed on card"><div class="invalid-feedback">Enter the name on the card.</div></div>
      <div class="col-6"><label class="form-label" for="${p}Exp">Expiry (MM/YY)</label><input class="form-control" id="${p}Exp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY" maxlength="5"><div class="invalid-feedback">Enter a valid expiry date.</div></div>
      <div class="col-6"><label class="form-label" for="${p}Cvv">CVV</label><input class="form-control" id="${p}Cvv" type="password" inputmode="numeric" autocomplete="cc-csc" placeholder="•••" maxlength="4"><div class="invalid-feedback">Enter the 3 or 4 digit CVV.</div></div>
    </div>`;
  ['credit', 'debit'].forEach(p => {
    document.querySelector(`[data-panel="${p}"]`).innerHTML = cardForm(p);
    $(p + 'Num').addEventListener('input', e => {
      const d = e.target.value.replace(/\D/g, '').slice(0, 19);
      e.target.value = d.replace(/(.{4})/g, '$1 ').trim();
      $(p + 'Brand').textContent = /^4/.test(d) ? 'VISA' : /^(5[1-5]|2[2-7])/.test(d) ? 'MASTERCARD' : /^3[47]/.test(d) ? 'AMEX' : /^(60|65|81|82|508)/.test(d) ? 'RUPAY' : '';
    });
    $(p + 'Exp').addEventListener('input', e => { let d = e.target.value.replace(/\D/g, '').slice(0, 4); if (d.length > 2) d = d.slice(0, 2) + '/' + d.slice(2); e.target.value = d; });
    $(p + 'Cvv').addEventListener('input', e => e.target.value = e.target.value.replace(/\D/g, ''));
  });
  const luhn = n => { let s = 0, alt = false; for (let i = n.length - 1; i >= 0; i--) { let d = +n[i]; if (alt) { d *= 2; if (d > 9) d -= 9; } s += d; alt = !alt; } return s % 10 === 0; };
  const expOk = v => { const m = /^(\d{2})\/(\d{2})$/.exec(v); if (!m || +m[1] < 1 || +m[1] > 12) return false; const end = new Date(2000 + +m[2], +m[1], 1); return end > new Date(); };

  /* ---------- Net banking ---------- */
  $('banks').innerHTML = BANKS.map((b, i) => `<div class="col-6 col-sm-4"><input type="radio" class="btn-check bank-input" name="bank" id="bk${i}" value="${b}" autocomplete="off">
    <label class="bank-card" for="bk${i}"><span class="bank-logo">${b.split(' ').map(w => w[0]).slice(0, 2).join('')}</span><span>${b}</span></label></div>`).join('');
  $('banks').addEventListener('change', () => { $('otherBank').value = ''; $('bankErr').classList.add('d-none'); });
  $('otherBank').addEventListener('change', e => { if (e.target.value) document.querySelectorAll('.bank-input').forEach(r => r.checked = false); $('bankErr').classList.add('d-none'); });

  /* ---------- UPI ---------- */
  $('upiSfx').innerHTML = UPI_SFX.map(s => `<button type="button" class="btn btn-sm btn-outline-secondary rounded-pill" data-sfx="${s}">${s}</button>`).join('');
  $('upiSfx').addEventListener('click', e => { const b = e.target.closest('[data-sfx]'); if (!b) return; $('upiId').value = $('upiId').value.split('@')[0] + b.dataset.sfx; $('upiId').focus(); });

  /* ---------- Validate + pay ---------- */
  const flag = (el, ok) => { el.classList.toggle('is-invalid', !ok); return ok; };
  document.addEventListener('input', e => e.target.classList.remove('is-invalid'));
  const validate = () => {
    if (method === 'wallet') return walletOk;
    if (method === 'credit' || method === 'debit') {
      const p = method, n = $(p + 'Num').value.replace(/\s/g, '');
      return [flag($(p + 'Num'), n.length >= 13 && luhn(n)), flag($(p + 'Name'), $(p + 'Name').value.trim().length > 1),
        flag($(p + 'Exp'), expOk($(p + 'Exp').value)), flag($(p + 'Cvv'), /^\d{3,4}$/.test($(p + 'Cvv').value))].every(Boolean);
    }
    if (method === 'netbanking') { const ok = !!(document.querySelector('.bank-input:checked') || $('otherBank').value); $('bankErr').classList.toggle('d-none', ok); return ok; }
    return flag($('upiId'), /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test($('upiId').value.trim()));
  };
  const toast = m => { $('toastMsg').textContent = m; bootstrap.Toast.getOrCreateInstance('#toast').show(); };
  document.querySelectorAll('[data-pay]').forEach(btn => btn.addEventListener('click', () => {
    if (!$('terms').checked) return toast('Please accept the terms & conditions to continue.');
    if (!validate()) {
      toast(method === 'wallet' ? 'Insufficient wallet balance. Choose another method.' : 'Please fix the highlighted details.');
      const bad = document.querySelector('.pm-panel.active .is-invalid'); if (bad) bad.focus(); return;
    }
    const all = document.querySelectorAll('[data-pay]'); all.forEach(b => { b.disabled = true; b.querySelector('.pay-label').innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing…'; });
    // TODO: call your payment API here, then show the result.
    setTimeout(() => {
      const via = METHODS.find(m => m[0] === method)[1], ref = 'B2B' + Date.now().toString().slice(-8);
      $('okAmt').textContent = inr(f.total); $('okVia').textContent = via; $('okRef').textContent = ref;
      try { sessionStorage.setItem('b2b_payment', JSON.stringify({ ref, via, amount: f.total })); } catch (e) {}
      new bootstrap.Modal('#okModal').show();
    }, 1600);
  }));

  showPanel();
})();
