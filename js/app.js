// Entry point: theme, greeting, event wiring, boot

import { tg, inTelegram, $, cssVar } from './telegram.js';
import { changeLine, subscribe } from './cart.js';
import { renderTabs, renderMenu, setCategory } from './menu.js';
import { closeSheet, onPrimary, updateMainButton } from './order.js';
import { openOptions, closeOptions, isOptionsOpen } from './options.js';
import { initCarousel } from './carousel.js';

// ---------- Theme & greeting ----------
function applyTheme() {
  const dark = inTelegram ? tg.colorScheme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const bg = cssVar('--bg');
  tg.setHeaderColor?.(bg);
  tg.setBackgroundColor?.(bg);
  if (!isOptionsOpen()) updateMainButton();
}

const hour = new Date().getHours();
const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
const user = tg.initDataUnsafe?.user;
$('greeting').textContent = user ? `${part}, ${user.first_name}` : part;

// ---------- Events ----------
const back = () => (isOptionsOpen() ? closeOptions() : closeSheet());

document.addEventListener('click', (e) => {
  const t = e.target.closest('button');
  if (!t) return;
  if (t.dataset.cat) setCategory(t.dataset.cat);
  else if (t.dataset.options) openOptions(t.dataset.options);
  else if (t.dataset.inc) changeLine(t.dataset.inc, +1);
  else if (t.dataset.dec) changeLine(t.dataset.dec, -1);
});
$('scrim').onclick = back;
$('cartBar').onclick = onPrimary;
tg.MainButton.onClick(onPrimary);
tg.BackButton.onClick(back);
tg.onEvent('themeChanged', applyTheme);
subscribe(renderMenu);

// ---------- Boot ----------
tg.ready();
tg.expand();
initCarousel($('carousel'), $('dots'));
renderTabs();
renderMenu();
applyTheme();
