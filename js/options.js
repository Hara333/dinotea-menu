// Options sheet: pick size / sugar / ice for a drink, then add it to the cart

import { tg, $, money } from './telegram.js';
import { byId, OPTION_GROUPS, DEFAULT_OPTIONS } from './data.js';
import { addLine, unitPrice } from './cart.js';
import { updateMainButton } from './order.js';

let current = null;   // { item, opts, qty } while the sheet is open

export const isOptionsOpen = () => current !== null;

function render() {
  const { item, opts, qty } = current;
  $('optHead').innerHTML = `
    <div class="tile ${item.cat}">${item.emoji}</div>
    <div class="info"><div class="name">${item.name}</div><div class="sub">${item.desc}</div></div>`;
  $('optGroups').innerHTML = item.options.map((g) => {
    const group = OPTION_GROUPS[g];
    return `<div class="opt-group">
      <div class="opt-label">${group.label}</div>
      <div class="choices">${group.choices.map((c) => `
        <button class="choice ${opts[g] === c.id ? 'active' : ''}" data-group="${g}" data-choice="${c.id}">
          ${c.label}${c.extra ? ` <small>+${money(c.extra)}</small>` : ''}
        </button>`).join('')}
      </div>
    </div>`;
  }).join('');
  $('optQty').textContent = qty;
  $('optAdd').textContent = `Add to order · ${money(unitPrice(item.id, opts) * qty)}`;
}

export function openOptions(id) {
  const item = byId[id];
  current = { item, opts: Object.fromEntries(item.options.map((g) => [g, DEFAULT_OPTIONS[g]])), qty: 1 };
  render();
  $('optionsSheet').classList.add('show');
  $('scrim').classList.add('show');
  // the sheet has its own Add button, so hide the order button underneath
  tg.MainButton.hide();
  $('cartBar').classList.remove('show');
  tg.BackButton.show();
}

export function closeOptions() {
  current = null;
  $('optionsSheet').classList.remove('show');
  $('scrim').classList.remove('show');
  tg.BackButton.hide();
  updateMainButton();
}

$('optionsSheet').addEventListener('click', (e) => {
  const t = e.target.closest('button');
  if (!t || !current) return;
  if (t.dataset.choice) {
    current.opts[t.dataset.group] = t.dataset.choice;
    tg.HapticFeedback?.selectionChanged();
    render();
  } else if (t.dataset.optqty) {
    current.qty = Math.max(1, current.qty + Number(t.dataset.optqty));
    render();
  } else if (t.id === 'optAdd') {
    const { item, opts, qty } = current;
    closeOptions();
    addLine(item.id, { ...opts }, qty);
  }
});
