import { useEffect, useRef } from 'react';
export default function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    node.classList.add('reveal-ready');
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { node.classList.remove('reveal-ready'); observer.disconnect(); } }, { threshold: .08 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}
