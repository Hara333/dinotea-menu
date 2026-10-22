// Category tabs and the menu grid

import { $, money } from './telegram.js';
import { CATEGORIES, MENU } from './data.js';
import { controls } from './cart.js';

let activeCat = 'all';

export function renderTabs() {
  $('tabs').innerHTML = CATEGORIES.map((c) =>
    `<button class="tab ${c.id === activeCat ? 'active' : ''}" data-cat="${c.id}">${c.label}</button>`
  ).join('');
}

function card(item) {
  return `<article class="card">
    <div class="tile ${item.cat}">${item.emoji}</div>
    <div class="name">${item.name}</div>
    <div class="desc">${item.desc}</div>
    <div class="row"><span class="price">${money(item.price)}</span>${controls(item)}</div>
  </article>`;
}

export function renderMenu() {
  const cats = activeCat === 'all' ? CATEGORIES.slice(1) : CATEGORIES.filter((c) => c.id === activeCat);
  $('menu').innerHTML = cats.map((c) => `
    <h3 class="section-title">${c.label}</h3>
    <div class="grid">${MENU.filter((m) => m.cat === c.id).map(card).join('')}</div>
  `).join('');
}

export function setCategory(cat) {
  activeCat = cat;
  renderTabs();
  renderMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
