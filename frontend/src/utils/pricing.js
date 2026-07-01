export const PRICING = {
  combo: {
    id: 'combo',
    name: 'The Assorted Atelier Box',
    mrp: 429,
    sale: 349,
    firstOrder: 219,
    desc: 'Why settle for one when you can experience them all? Our flagship gift box features a curated selection of Rose, Chocolate, Vanilla, and Butterscotch blends.',
    size: '20 Sachets'
  },
  rose: {
    id: 'rose',
    name: 'Rose Atelier',
    mrp: 269,
    sale: 219,
    firstOrder: 109,
  },
  chocolate: {
    id: 'chocolate',
    name: 'Cacao Reserve',
    mrp: 269,
    sale: 199,
    firstOrder: 99,
  },
  vanilla: {
    id: 'vanilla',
    name: 'Vanilla Orchid',
    mrp: 269,
    sale: 199,
    firstOrder: 99,
  },
  butterscotch: {
    id: 'butterscotch',
    name: 'Toasted Butterscotch',
    mrp: 269,
    sale: 219,
    firstOrder: 109,
  }
};

export const FEES = {
  platform: 7,
  shipping: 49,
  freeShippingMin: 499
};

export function getSavings(product, isFirstOrder = true) {
  const currentPrice = isFirstOrder ? product.firstOrder : product.sale;
  return product.mrp - currentPrice;
}
