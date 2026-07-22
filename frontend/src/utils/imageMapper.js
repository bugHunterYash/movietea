export const getProductImages = (slug, productName) => {
  const s = (slug || productName || '').toLowerCase();

  // Mapping logic from slug/name to exact filename prefixes found in /shop/
  let prefix = '';

  if (s.includes('combo') || s.includes('atelier')) {
    if (s.includes('100gm') || s.includes('100-gm')) {
      prefix = '100 gm combo image';
    } else if (s.includes('sachet') || s.includes('10-sachet')) {
      prefix = '10 sachets combo';
    } else if (s.includes('jar')) {
      prefix = 'jar combo '; // Notice double space if handled below
    } else {
      prefix = 'combo image';
    }
  } else if (s.includes('chocolate') || s.includes('cacao')) {
    if (s.includes('100gm') || s.includes('100-gm')) {
      prefix = 'choclate100gm';
    } else if (s.includes('jar')) {
      prefix = 'choclate jar';
    } else {
      prefix = 'choaclate 10 sachets';
    }
  } else if (s.includes('vanilla')) {
    if (s.includes('100gm') || s.includes('100-gm')) {
      prefix = 'vanila 100gm';
    } else if (s.includes('jar')) {
      prefix = 'vanila jar';
    } else {
      prefix = 'vanila 10 sachets';
    }
  } else if (s.includes('rose')) {
    if (s.includes('100gm') || s.includes('100-gm')) {
      prefix = 'rose 100gm';
    } else if (s.includes('jar')) {
      prefix = 'rose jar';
    } else {
      prefix = 'rose 10 sachets';
    }
  } else if (s.includes('butterscotch')) {
    if (s.includes('100gm') || s.includes('100-gm')) {
      prefix = 'buttersocth 100gm';
    } else if (s.includes('jar')) {
      prefix = 'butterscoth jar';
    } else {
      prefix = 'butterscoth 10 sachets';
    }
  }

  if (prefix) {
    // Special handling for double space in jar combo
    if (prefix === 'jar combo ') {
      return [
        `/shop/jar combo  1.webp`,
        `/shop/jar combo  2.webp`
      ];
    }
    return [
      `/shop/${prefix} 1.webp`,
      `/shop/${prefix} 2.webp`
    ];
  }

  // Fallback if not found (using default images or provided fallback)
  return [
    '/images/Final.png',
    '/images/Final.png'
  ];
};
