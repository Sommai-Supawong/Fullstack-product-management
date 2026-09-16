const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
export const API_URL = `${API_BASE_URL}/products`;
export const formatPrice = value => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(Number(value));
export function stockStatus(quantity) {
  return Number(quantity) === 0 ? { label: 'Out of stock', tone: 'error' } : Number(quantity) <= 5 ? { label: 'Low stock', tone: 'warning' } : { label: 'In stock', tone: 'success' };
}
export async function getProducts(signal) {
  const response = await fetch(API_URL, { signal });
  if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลสินค้าได้ กรุณาลองอีกครั้ง');
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error('Invalid product response. Please try again.');
  return data;
}
