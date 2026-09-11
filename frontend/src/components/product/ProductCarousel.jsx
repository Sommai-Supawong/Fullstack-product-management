import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Box, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice } from '../../lib/products';
import StockBadge from './StockBadge';
export default function ProductCarousel({ products }) {
  const [index, setIndex] = useState(0);
  const start = useRef(null);
  const dragged = useRef(false);
  const active = Math.min(index, products.length - 1);
  const move = step => setIndex(current => (current + step + products.length) % products.length);
  return <section className="carousel" aria-label="Featured products" aria-roledescription="carousel">
    <div className="carousel-stage" tabIndex={0} aria-label="Use left and right arrow keys to browse products" onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); } }}
    onPointerDown={event => { if (event.button !== 0) return; start.current = { x: event.clientX, y: event.clientY }; dragged.current = false; }}
    onPointerMove={event => { if (start.current && Math.abs(event.clientX - start.current.x) > 12) { dragged.current = true; event.currentTarget.setPointerCapture(event.pointerId); } }}
    onPointerUp={event => { if (start.current) { const x = event.clientX - start.current.x; const y = event.clientY - start.current.y; if (Math.abs(x) > 40 && Math.abs(x) > Math.abs(y)) move(x < 0 ? 1 : -1); } start.current = null; }} onPointerCancel={() => { start.current = null; }}
    onClickCapture={event => { if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false; } }}>
      {products.map((product, i) => {
        let offset = (i - active + products.length) % products.length;
        if (offset > products.length / 2) offset -= products.length;
        if (Math.abs(offset) > 1) return null;
        return <article key={product.id} className={`glass product-slide ${offset === 0 ? 'is-active' : 'is-side'}`} style={{ '--offset': offset }} aria-hidden={offset !== 0} inert={offset !== 0} aria-roledescription="slide" aria-label={`${i + 1} of ${products.length}: ${product.name}`}>
          <div className="card-top"><span className="product-id">#{String(product.id).padStart(3, '0')}</span><StockBadge quantity={product.quantity} /></div>
          <div className="product-visual" aria-hidden="true"><div className="product-cube"><Box /></div><span>PRODUCT / {String(product.id).padStart(3, '0')}</span></div><h3>{product.name}</h3><p className="product-price">{formatPrice(product.price)}</p>
          <div className="card-bottom"><div><span className="small-label">AVAILABLE UNITS</span><strong>{product.quantity ?? 0} <small>units</small></strong></div><Link className="text-link" to={`/manage-products?product=${encodeURIComponent(product.id)}`}>View Product <ArrowUpRight /></Link></div>
        </article>;
      })}
    </div><div className="carousel-controls"><button className="icon-button" aria-label="Previous product" disabled={products.length < 2} onClick={() => move(-1)}><ChevronLeft /></button><span aria-live="polite" aria-atomic="true" className="carousel-count">{String(active + 1).padStart(2, '0')} <span>/ {String(products.length).padStart(2, '0')}</span></span><button className="icon-button" aria-label="Next product" disabled={products.length < 2} onClick={() => move(1)}><ChevronRight /></button></div><progress className="carousel-progress" aria-label="Product position" value={active + 1} max={products.length} />
  </section>;
}
