import { useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowUpRight, Box, Menu, X } from 'lucide-react';
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  return <header className="nav-shell" onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } }}>
    <nav className="glass navbar" aria-label="Main navigation">
      <Link to="/" className="brand" onClick={() => setOpen(false)}><span className="brand-mark"><Box /></span> PRODUCT OS</Link>
      <button ref={toggle} className="icon-button menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <div id="nav-links" className={`nav-links ${open ? 'is-open' : ''}`}><NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink><NavLink to="/manage-products" onClick={() => setOpen(false)}>Manage Products <ArrowUpRight /></NavLink></div>
    </nav>
  </header>;
}
