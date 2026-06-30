// src/utils/db.js
import api from '../api/client';

const DB_KEY = 'movitea_products_v3';

const INITIAL_SEED_PRODUCTS = [
  // Hero Category
  {
    id: 'hero_combo', name: '20 Sachets Combo', slug: '20-sachets-combo', category: 'Hero', flavour: 'Mixed', type: 'combo', image: '/assets/combo-pack.jpeg', basePrice: 429, sellingPrice: 349, stock: 100, orderNumber: 0, featured: true, description: 'Our flagship curated gift box containing all 4 core flavours (20 Sachets).', shortDesc: 'First Order Offer Available'
  },

  // Collection 1: 10 Sachets
  {
    id: 'choc_10', name: 'Chocolate 10 Sachets', slug: 'chocolate-10-sachets', category: '10 Sachets', flavour: 'Chocolate', type: 'flavour', image: '/images/New folder/choclate 10 sachets.png', basePrice: 299, sellingPrice: 199, stock: 100, orderNumber: 1, featured: true, description: 'Rich cocoa infused black tea in convenient sachets.', shortDesc: 'Rich & Bold'
  },
  {
    id: 'van_10', name: 'Vanilla 10 Sachets', slug: 'vanilla-10-sachets', category: '10 Sachets', flavour: 'Vanilla', type: 'flavour', image: '/images/New folder/vanila 10 sachets.png', basePrice: 299, sellingPrice: 199, stock: 100, orderNumber: 2, featured: true, description: 'Madagascar vanilla beans blended with premium black tea.', shortDesc: 'Smooth & Warm'
  },
  {
    id: 'rose_10', name: 'Rose 10 Sachets', slug: 'rose-10-sachets', category: '10 Sachets', flavour: 'Rose', type: 'flavour', image: '/images/New folder/rose10 sachets.png', basePrice: 299, sellingPrice: 219, stock: 100, orderNumber: 3, featured: true, description: 'Organic rose petals for a delicate floral aroma.', shortDesc: 'Floral & Delicate'
  },
  {
    id: 'butt_10', name: 'Butterscotch 10 Sachets', slug: 'butterscotch-10-sachets', category: '10 Sachets', flavour: 'Butterscotch', type: 'flavour', image: '/images/New folder/butterscotch 10 sachets.png', basePrice: 299, sellingPrice: 219, stock: 100, orderNumber: 4, featured: true, description: 'Toasted sugar and caramel notes in a soothing blend.', shortDesc: 'Sweet & Indulgent'
  },
  {
    id: 'combo_10', name: '10 Sachets Combo', slug: '10-sachets-combo', category: '10 Sachets', flavour: 'Mixed', type: 'combo', image: '/images/New folder/10 satches combo.png', basePrice: 899, sellingPrice: 799, stock: 50, orderNumber: 5, featured: true, description: 'Experience all 4 signature flavours in one perfect gift box.', shortDesc: 'Best Value Collection'
  },

  // Collection 2: 100gm Packs
  {
    id: 'choc_100', name: 'Chocolate 100gm', slug: 'chocolate-100gm', category: '100gm Packs', flavour: 'Chocolate', type: 'flavour', image: '/images/New folder/choclate 100 gm.png', basePrice: 219, sellingPrice: 149, stock: 100, orderNumber: 6, featured: true, description: 'Rich cocoa infused loose leaf black tea.', shortDesc: 'Rich & Bold'
  },
  {
    id: 'van_100', name: 'Vanilla 100gm', slug: 'vanilla-100gm', category: '100gm Packs', flavour: 'Vanilla', type: 'flavour', image: '/images/New folder/vanila100 gm.png', basePrice: 249, sellingPrice: 149, stock: 100, orderNumber: 7, featured: true, description: 'Madagascar vanilla beans with loose leaf black tea.', shortDesc: 'Smooth & Warm'
  },
  {
    id: 'rose_100', name: 'Rose 100gm', slug: 'rose-100gm', category: '100gm Packs', flavour: 'Rose', type: 'flavour', image: '/images/New folder/rose 100 gm.png', basePrice: 299, sellingPrice: 179, stock: 100, orderNumber: 8, featured: true, description: 'Organic rose petals in loose leaf premium black tea.', shortDesc: 'Floral & Delicate'
  },
  {
    id: 'butt_100', name: 'Butterscotch 100gm', slug: 'butterscotch-100gm', category: '100gm Packs', flavour: 'Butterscotch', type: 'flavour', image: '/images/New folder/butterscotch 100 gm.png', basePrice: 299, sellingPrice: 179, stock: 100, orderNumber: 9, featured: true, description: 'Toasted sugar and caramel notes in loose leaf format.', shortDesc: 'Sweet & Indulgent'
  },
  {
    id: 'combo_100', name: '100gm Combo', slug: '100gm-combo', category: '100gm Packs', flavour: 'Mixed', type: 'combo', image: '/images/New folder/100 gm combo.png', basePrice: 699, sellingPrice: 499, stock: 50, orderNumber: 10, featured: true, description: 'The complete artisan collection for everyday brewing.', shortDesc: 'Most Popular'
  },

  // Collection 3: Premium Jars
  {
    id: 'choc_jar', name: 'Chocolate Jar', slug: 'chocolate-jar', category: 'Premium Jars', flavour: 'Chocolate', type: 'flavour', image: '/images/New folder/choclate jar.png', basePrice: 849, sellingPrice: 649, stock: 100, orderNumber: 11, featured: true, description: 'Rich cocoa infused black tea in a premium glass jar.', shortDesc: 'Rich & Bold'
  },
  {
    id: 'van_jar', name: 'Vanilla Jar', slug: 'vanilla-jar', category: 'Premium Jars', flavour: 'Vanilla', type: 'flavour', image: '/images/New folder/vanila jar.png', basePrice: 849, sellingPrice: 649, stock: 100, orderNumber: 12, featured: true, description: 'Madagascar vanilla beans in a premium glass jar.', shortDesc: 'Smooth & Warm'
  },
  {
    id: 'rose_jar', name: 'Rose Jar', slug: 'rose-jar', category: 'Premium Jars', flavour: 'Rose', type: 'flavour', image: '/images/New folder/rose jar.png', basePrice: 899, sellingPrice: 699, stock: 100, orderNumber: 13, featured: true, description: 'Organic rose petals in a premium glass jar.', shortDesc: 'Floral & Delicate'
  },
  {
    id: 'butt_jar', name: 'Butterscotch Jar', slug: 'butterscotch-jar', category: 'Premium Jars', flavour: 'Butterscotch', type: 'flavour', image: '/images/New folder/buttercoth jar.png', basePrice: 899, sellingPrice: 699, stock: 100, orderNumber: 14, featured: true, description: 'Toasted sugar and caramel notes in a premium glass jar.', shortDesc: 'Sweet & Indulgent'
  },
  {
    id: 'combo_jar', name: 'Jar Combo', slug: 'jar-combo', category: 'Premium Jars', flavour: 'Mixed', type: 'combo', image: '/images/New folder/jar combo.png', basePrice: 3499, sellingPrice: 1999, stock: 25, orderNumber: 15, featured: true, description: 'The ultimate reserve collection crafted for true tea lovers.', shortDesc: 'Gift Collection'
  }
];

export const getProducts = () => {
  api.get('/products').then(res => {
    if (res.data && res.data.data) {
      localStorage.setItem(DB_KEY, JSON.stringify(res.data.data));
    }
  }).catch(err => console.error('Error syncing products', err));

  const stored = localStorage.getItem(DB_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch(e){}
  }
  // Initialize if empty
  localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_SEED_PRODUCTS));
  return INITIAL_SEED_PRODUCTS;
};

export const saveProducts = (products) => {
  localStorage.setItem(DB_KEY, JSON.stringify(products));
};

// Helper for flat exact sorting
export const getSortedProducts = (products) => {
  const categoryOrder = ['Hero', '10 Sachets', '100gm Packs', 'Premium Jars'];
  const flavourOrder = ['Chocolate', 'Vanilla', 'Rose', 'Butterscotch'];
  
  return [...products].sort((a, b) => {
    // 1. Sort by Category
    const catA = categoryOrder.indexOf(a.category);
    const catB = categoryOrder.indexOf(b.category);
    const catScoreA = catA !== -1 ? catA : 999; // unknown categories go last
    const catScoreB = catB !== -1 ? catB : 999;
    
    if (catScoreA !== catScoreB) return catScoreA - catScoreB;
    
    // 2. Within same category: Flavours first, Combos last
    const isComboA = a.type === 'combo';
    const isComboB = b.type === 'combo';
    
    if (isComboA !== isComboB) return isComboA ? 1 : -1; // combos go to the end
    
    // 3. If both are flavours, sort by exact flavour order
    if (!isComboA && !isComboB) {
      const flavA = flavourOrder.indexOf(a.flavour);
      const flavB = flavourOrder.indexOf(b.flavour);
      const flavScoreA = flavA !== -1 ? flavA : 999;
      const flavScoreB = flavB !== -1 ? flavB : 999;
      
      if (flavScoreA !== flavScoreB) return flavScoreA - flavScoreB;
    }
    
    return 0; // Fallback
  });
};
