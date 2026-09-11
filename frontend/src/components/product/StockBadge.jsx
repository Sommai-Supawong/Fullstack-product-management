import { stockStatus } from '../../lib/products';
export default function StockBadge({ quantity }) {
  const status = stockStatus(quantity);
  return <span className={`stock-badge ${status.tone}`}><span aria-hidden="true">●</span>{status.label}</span>;
}
