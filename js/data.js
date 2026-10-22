// Menu data. Later this can be loaded from the backend instead.

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'bread', label: 'Bread' },
  { id: 'food', label: 'Food' },
];

// Option groups a menu item can offer. `extra` is added to the item price.
export const OPTION_GROUPS = {
  size: {
    label: 'Size',
    choices: [
      { id: 'medium', label: 'Medium' },
      { id: 'large', label: 'Large', extra: 0.50 },
    ],
  },
  sugar: {
    label: 'Sugar level',
    suffix: ' sugar',
    choices: [
      { id: '0', label: '0%' },
      { id: '25', label: '25%' },
      { id: '50', label: '50%' },
      { id: '75', label: '75%' },
      { id: '100', label: '100%' },
    ],
  },
  ice: {
    label: 'Ice level',
    choices: [
      { id: 'none', label: 'No ice' },
      { id: 'less', label: 'Less ice' },
      { id: 'normal', label: 'Normal ice' },
      { id: 'extra', label: 'Extra ice' },
    ],
  },
};

export const DEFAULT_OPTIONS = { size: 'medium', sugar: '50', ice: 'normal' };

const DRINK = ['size', 'sugar', 'ice'];

export const MENU = [
  { id: 'latte',     cat: 'drinks', options: DRINK, emoji: '☕', name: 'Caffè Latte',    desc: 'Double espresso, steamed milk', price: 3.80 },
  { id: 'flatwhite', cat: 'drinks', options: DRINK, emoji: '☕', name: 'Flat White',     desc: 'Ristretto, velvety microfoam', price: 3.60 },
  { id: 'iced',      cat: 'drinks', options: DRINK, emoji: '🧊', name: 'Iced Americano', desc: 'Espresso over ice and water', price: 3.20 },
  { id: 'matcha',    cat: 'drinks', options: DRINK, emoji: '🍵', name: 'Matcha Latte',   desc: 'Ceremonial grade, oat milk', price: 4.20 },
  { id: 'cocoa',     cat: 'drinks', options: DRINK, emoji: '🍫', name: 'Hot Chocolate',  desc: 'Dark cocoa, whipped cream', price: 3.50 },
  { id: 'juice',     cat: 'drinks', options: DRINK, emoji: '🍊', name: 'Fresh Orange',   desc: 'Squeezed to order', price: 3.90 },

  { id: 'croissant', cat: 'bread',  emoji: '🥐', name: 'Butter Croissant', desc: 'Laminated, baked every morning', price: 2.60 },
  { id: 'sourdough', cat: 'bread',  emoji: '🍞', name: 'Sourdough Loaf',   desc: '48-hour ferment, crisp crust', price: 5.50 },
  { id: 'baguette',  cat: 'bread',  emoji: '🥖', name: 'Baguette',         desc: 'Classic French, light crumb', price: 2.40 },
  { id: 'bagel',     cat: 'bread',  emoji: '🥯', name: 'Sesame Bagel',     desc: 'Boiled then baked, chewy', price: 2.20 },

  { id: 'toast',     cat: 'food',   emoji: '🥑', name: 'Avocado Toast',  desc: 'Sourdough, chili flakes, lime', price: 7.50 },
  { id: 'sandwich',  cat: 'food',   emoji: '🥪', name: 'Ham & Cheese',   desc: 'Toasted, Dijon butter', price: 6.80 },
  { id: 'eggs',      cat: 'food',   emoji: '🍳', name: 'Breakfast Plate', desc: 'Eggs, toast, roast tomato', price: 8.90 },
  { id: 'salad',     cat: 'food',   emoji: '🥗', name: 'Garden Bowl',    desc: 'Greens, quinoa, lemon dressing', price: 7.90 },
];

export const byId = Object.fromEntries(MENU.map((m) => [m.id, m]));
