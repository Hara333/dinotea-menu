// Order sheet, Telegram MainButton / fallback cart bar, and placing the order

import { tg, inTelegram, $, money, cssVar } from './telegram.js';
import { byId } from './data.js';
import { lines, totals, clearCart, stepper, unitPrice, optionSummary, subscribe } from './cart.js';

let sheetOpen = false;

export const isSheetOpen = () => sheetOpen;

function renderSheet() {
  $('lines').innerHTML = [...lines.values()].map((l) => {
    const item = byId[l.id];
    const summary = optionSummary(l.opts);
    return `<div class="line">
      <div class="tile ${item.cat}">${item.emoji}</div>
      <div class="info"><div class="name" style="margin:0">${item.name}</div>
        ${summary ? `<div class="sub">${summary}</div>` : ''}
        <div class="sub">${money(unitPrice(l.id, l.opts))} each</div></div>
      ${stepper(l.key, l.qty)}
    </div>`;
  }).join('');
  $('total').textContent = money(totals().sum);
}

export function updateMainButton() {
  const { count, sum } = totals();
  const label = sheetOpen ? `Place order · ${money(sum)}` : `View order · ${count} item${count === 1 ? '' : 's'}`;

  if (inTelegram) {
    if (!count) return tg.MainButton.hide();
    tg.MainButton.setParams({ text: label, color: cssVar('--accent'), text_color: cssVar('--accent-text'), is_visible: true });
  } else {
    $('cartBar').classList.toggle('show', count > 0);
    $('cartBarCount').textContent = sheetOpen ? 'Place order' : `View order · ${count}`;
    $('cartBarTotal').textContent = money(sum);
    $('cartBar').style.zIndex = sheetOpen ? 12 : 4;
  }
}

export function openSheet() {
  sheetOpen = true;
  renderSheet();
  $('orderSheet').classList.add('show');
  $('scrim').classList.add('show');
  tg.BackButton.show();
  updateMainButton();
}

export function closeSheet() {
  sheetOpen = false;
  $('orderSheet').classList.remove('show');
  $('scrim').classList.remove('show');
  tg.BackButton.hide();
  updateMainButton();
}

function placeOrder() {
  const { sum } = totals();
  const order = {
    items: [...lines.values()].map((l) => ({
      id: l.id,
      name: byId[l.id].name,
      options: l.opts,
      optionsText: optionSummary(l.opts),
      qty: l.qty,
      price: unitPrice(l.id, l.opts),
    })),
    note: $('note').value.trim(),
    total: Number(sum.toFixed(2)),
  };
  // TODO: send `order` to your bot backend here.
  console.log('Order', order);
  tg.HapticFeedback?.notificationOccurred('success');
  const done = () => {
    $('note').value = '';
    clearCart();
    closeSheet();
  };
  if (inTelegram) tg.showAlert(`Thanks! Your order (${money(sum)}) has been placed ☕`, done);
  else { alert(`Thanks! Your order (${money(sum)}) has been placed ☕`); done(); }
}

export function onPrimary() { sheetOpen ? placeOrder() : openSheet(); }

subscribe(() => {
  if (sheetOpen) {
    if (!lines.size) closeSheet();
    else renderSheet();
  }
  updateMainButton();
});
