// Telegram WebApp handle and small shared helpers

export const tg = window.Telegram.WebApp;
export const inTelegram = Boolean(tg.platform) && tg.platform !== 'unknown';

export const $ = (id) => document.getElementById(id);
export const money = (n) => '$' + n.toFixed(2);
export const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
