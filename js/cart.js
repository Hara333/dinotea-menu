// Cart state. Other modules re-render through subscribe().
// Each line is one item + one set of options, so "Large latte, 0% sugar" and
// "Medium latte, 50% sugar" are separate lines.

import { tg } from './telegram.js';
import { byId, OPTION_GROUPS } from './data.js';

export const lines = new Map();   // key -> { key, id, opts, qty }  (opts is null for items without options)
const listeners = [];

export function subscribe(fn) { listeners.push(fn); }
function notify() { listeners.forEach((fn) => fn()); }

const choiceOf = (group, id) => OPTION_GROUPS[group].choices.find((c) => c.id === id);

export function lineKey(id, opts) {
  return opts ? [id, ...Object.entries(opts).map(([g, c]) => `${g}:${c}`)].join('|') : id;
}

export function unitPrice(id, opts) {
  let price = byId[id].price;
  for (const [g, c] of Object.entries(opts || {})) price += choiceOf(g, c).extra || 0;
  return price;
}

// "Large · 50% sugar · Less ice"
export function optionSummary(opts) {
  return Object.entries(opts || {})
    .map(([g, c]) => choiceOf(g, c).label + (OPTION_GROUPS[g].suffix || ''))
    .join(' · ');
}

export function totals() {
  let count = 0, sum = 0;
  for (const l of lines.values()) { count += l.qty; sum += unitPrice(l.id, l.opts) * l.qty; }
  return { count, sum };
}

// Total quantity of an item across all its option combinations
export function qtyOf(id) {
  let n = 0;
  for (const l of lines.values()) if (l.id === id) n += l.qty;
  return n;
}

export function addLine(id, opts, qty = 1) {
  const key = lineKey(id, opts);
  const line = lines.get(key);
  if (line) line.qty += qty;
  else lines.set(key, { key, id, opts, qty });
  tg.HapticFeedback?.selectionChanged();
  notify();
}

// +/- on a line. For items without options the key is just the item id.
export function changeLine(key, delta) {
  const line = lines.get(key);
  if (!line) {
    if (delta > 0) addLine(key, null, delta);
    return;
  }
  line.qty += delta;
  if (line.qty <= 0) lines.delete(key);
  tg.HapticFeedback?.selectionChanged();
  notify();
}

export function clearCart() {
  lines.clear();
  notify();
}

export function stepper(key, qty) {
  return `<div class="stepper">
    <button data-dec="${key}" aria-label="Remove one">−</button>
    <span>${qty}</span>
    <button data-inc="${key}" aria-label="Add one">+</button>
  </div>`;
}

// Card button: items with options always open the options sheet (badge shows how many
// are in the cart); simple items get "+" and then a stepper.
export function controls(item) {
  const qty = qtyOf(item.id);
  if (item.options) {
    return `<button class="add" data-options="${item.id}" aria-label="Choose options for ${item.name}">+${
      qty ? `<span class="badge">${qty}</span>` : ''}</button>`;
  }
  if (!qty) return `<button class="add" data-inc="${item.id}" aria-label="Add ${item.name}">+</button>`;
  return stepper(item.id, qty);
}
