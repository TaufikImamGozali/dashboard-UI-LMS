/**
 * Currency and Price Utility
 */

export const formatPrice = (price?: number | null): string => {
  if (price === undefined || price === null || price === 0) {
    return 'GRATIS';
  }
  if (price > 1000) {
    return `Rp ${price.toLocaleString('id-ID')}`;
  }
  return `$${price}`;
};

export const isPaidCourse = (price?: number | null): boolean => {
  return typeof price === 'number' && price > 0;
};

