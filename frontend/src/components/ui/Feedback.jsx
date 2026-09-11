import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert, CircleCheck, Info, PackageOpen, TriangleAlert, X } from 'lucide-react';
export function Alert({ children, tone = 'error', onClose, onRetry }) {
  const Icon = { error: CircleAlert, success: CircleCheck, warning: TriangleAlert, info: Info }[tone];
  return <div className={`notice ${tone}`} role={tone === 'error' ? 'alert' : 'status'}><Icon /><span>{children}</span>{onRetry && <button className="button secondary" onClick={onRetry}>Try again</button>}{onClose && <button className="icon-button" aria-label="Dismiss message" onClick={onClose}><X /></button>}</div>;
}
export function Toast({ message, onClose }) {
  useEffect(() => { if (message) { const timer = setTimeout(onClose, 3500); return () => clearTimeout(timer); } }, [message, onClose]);
  return <div className="toast-region" aria-live="polite" aria-atomic="true">{message && <Alert tone="success" onClose={onClose}>{message}</Alert>}</div>;
}
export function Loading() {
  return <div className="skeleton-grid" role="status" aria-label="Loading products"><span className="sr-only">Loading products…</span>{[0,1,2].map(i => <div key={i} className="glass skeleton"><i /><i /><i /></div>)}</div>;
}
export function EmptyState({ onAdd }) {
  return <div className="glass empty-state"><PackageOpen /><h3 className="fluid-text">No products yet.</h3><p>Add your first product to start building your inventory.</p>{onAdd ? <button className="button primary" onClick={onAdd}>Add Product</button> : <Link className="button primary" to="/manage-products">Add Product</Link>}</div>;
}
export function ConfirmDialog({ product, busy, error, onCancel, onConfirm }) {
  const dialog = useRef(null);
  useEffect(() => {
    if (!product) return;
    const previous = document.activeElement;
    const node = dialog.current;
    node.showModal();
    return () => { node.close(); if (previous?.isConnected) previous.focus(); else document.getElementById('product-name')?.focus(); };
  }, [product]);
  if (!product) return null;
  return <dialog ref={dialog} className="glass confirm-dialog" aria-labelledby="delete-title" aria-describedby="delete-description" onKeyDown={event => {
    if (event.key !== 'Tab') return;
    const buttons = [...dialog.current.querySelectorAll('button:not(:disabled)')];
    const first = buttons[0];
    const last = buttons.at(-1);
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }} onCancel={event => { event.preventDefault(); if (!busy) onCancel(); }}><TriangleAlert className="danger-icon" /><h2 id="delete-title">Delete product?</h2><p id="delete-description">“{product.name}” will be removed.<br />This action cannot be undone.</p>{error && <Alert>{error}</Alert>}<div className="dialog-actions"><button autoFocus className="button secondary" disabled={busy} onClick={onCancel}>Cancel</button><button className="button danger" disabled={busy} onClick={onConfirm}>{busy ? 'Deleting…' : 'Delete'}</button></div></dialog>;
}
