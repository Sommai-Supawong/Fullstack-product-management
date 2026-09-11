import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, Box, Layers, Package, TriangleAlert, CircleSlash } from 'lucide-react';
import { getProducts } from '../lib/products';
import { Alert, EmptyState, Loading } from '../components/ui/Feedback';
import ProductCarousel from '../components/product/ProductCarousel';
import Reveal from '../components/motion/Reveal';
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const hero = useRef(null);
  useEffect(() => {
    const controller = new AbortController();
    getProducts(controller.signal).then(setProducts).catch(err => { if (err.name !== 'AbortError') setError(err.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame;
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { hero.current?.style.setProperty('--depth', media.matches ? 0 : Math.min(window.scrollY / 800, 1)); }); };
    window.addEventListener('scroll', update, { passive: true }); media.addEventListener('change', update); update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); media.removeEventListener('change', update); };
  }, []);
  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, note: 'Your entire collection' },
    { label: 'Total Units', value: products.reduce((sum, p) => sum + Number(p.quantity ?? 0), 0), icon: Layers, note: 'Across your inventory' },
    { label: 'Low Stock', value: products.filter(p => Number(p.quantity) > 0 && Number(p.quantity) <= 5).length, icon: TriangleAlert, note: '5 units or fewer' },
    { label: 'Out of Stock', value: products.filter(p => Number(p.quantity) === 0).length, icon: CircleSlash, note: 'Ready to replenish' },
  ];
  return <main id="main"><section ref={hero} className="hero-section container">
    <div className="hero-copy"><p className="eyebrow"><span className="tiny-dot" /> PRODUCT MANAGEMENT SYSTEM</p><h1><span className="brush-reveal">Inventory,</span><span className="brush-reveal metallic-text">in motion.</span></h1><p className="hero-subtitle">{'A focused workspace for organizing products, pricing and inventory in one fluid experience.'.split(' ').map((word, i) => <span key={i} className="fluid-word" style={{ '--delay': `${i * 35 + 250}ms` }}>{word} </span>)}</p><div className="hero-actions"><Link to="/manage-products" className="button primary">Manage Products <ArrowUpRight /></Link><a href="#featured" className="text-link">Explore inventory <ArrowDown /></a></div><p className="hero-footnote">LESS FRICTION. MORE FOCUS.</p></div>
    <div className="hero-art" aria-hidden="true"><div className="orb-orbit orbit-one" /><div className="orb-orbit orbit-two" /><div className="glass-orb"><div className="orb-core"><Box /></div></div><div className="art-label glass"><span className="tiny-dot" /> A clearer perspective.<span>EVERY PRODUCT. IN PLACE.</span></div><span className="art-coordinate">01 / THE INVENTORY SPACE</span></div><div className="hero-baseline"><span>DESIGNED FOR YOUR EVERYDAY FLOW</span><span>SCROLL TO DISCOVER <ArrowDown /></span></div>
    </section><div className="marquee" aria-hidden="true"><div className="marquee-track">{[0,1].map(i => <span key={i}>PRODUCTS <b>✦</b> INVENTORY <b>✦</b> CREATE <b>✦</b> UPDATE <b>✦</b> ORGANIZE <b>✦</b> CONTROL <b>✦</b>&nbsp;</span>)}</div></div>
    <div className="container"><Reveal className="showcase-section"><div className="section-heading" id="featured"><div><p className="eyebrow">01 / THE COLLECTION</p><h2>Every product. In focus.</h2></div><Link className="text-link" to="/manage-products">View all products <ArrowUpRight /></Link></div>{loading ? <Loading /> : error ? <Alert onRetry={() => { setError(''); setLoading(true); setAttempt(a => a + 1); }}>{error}</Alert> : products.length ? <ProductCarousel products={products} /> : <EmptyState />}</Reveal>
    <Reveal className="overview-section"><div className="section-heading"><div><p className="eyebrow">02 / AT A GLANCE</p><h2>A little more clarity.</h2></div><p>Your inventory, in perspective.</p></div><div className="stats-grid">{stats.map(({ label, value, icon: Icon, note }) => <div className="glass stat-card" key={label}><div><span>{label}</span><Icon /></div><strong className="metallic-text">{loading || error ? '—' : value.toLocaleString()}</strong><p>{note}</p></div>)}</div></Reveal>
    <Reveal><section className="glass closing-cta"><div><p className="eyebrow">MAKE ROOM FOR WHAT’S NEXT</p><h2>Ready to manage<br />your inventory?</h2><p>Everything you need. One focused workspace.</p></div><Link to="/manage-products" className="button primary">Open Product Manager <ArrowRight /></Link></section></Reveal></div></main>;
}
