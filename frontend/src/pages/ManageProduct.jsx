import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { API_URL, formatPrice, getProducts, stockStatus } from '../lib/products';
import { Alert, ConfirmDialog, EmptyState, Loading, Toast } from '../components/ui/Feedback';
import StockBadge from '../components/product/StockBadge';

function ManageProduct() {


    // =========================
    // STATE
    // =========================
    const [products, setProducts] = useState([]);

    // ใช้ร่วมกันทั้ง Create และ Update
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");

    // id สินค้าที่กำลังแก้ไข
    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState('');
    const closeToast = useCallback(() => setToast(''), []);
    const [deleting, setDeleting] = useState(null);
    const [deleteBusy, setDeleteBusy] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [loadError, setLoadError] = useState('');
    const nameInput = useRef(null);
    const [searchParams] = useSearchParams();

    // =========================
    // GET PRODUCTS
    // =========================
    const fetchProducts = async () => {
        setLoading(true);
        try { setProducts(await getProducts()); setLoadError(''); }
        catch (err) { setLoadError(err.message); }
        finally { setLoading(false); }
    };
    useEffect(() => {
        const controller = new AbortController();
        getProducts(controller.signal).then(setProducts).catch(err => {
            if (err.name !== 'AbortError') setLoadError(err.message);
        }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, []);

    // =========================
    // RESET FORM
    // =========================
    const resetForm = () => {
        setName("");
        setPrice("");
        setQuantity("");
        setEditingId(null);
    };

    // =========================
    // VALIDATE FORM
    // =========================
    const validateForm = () => {
        if (!name.trim()) {
            setError("กรุณากรอกชื่อสินค้า");
            return false;
        }

        if (price === "") {
            setError("กรุณากรอกราคาสินค้า");
            return false;
        }

        if (quantity === "") {
            setError("กรุณากรอกจำนวนสินค้า");
            return false;
        }

        if (!Number.isFinite(Number(price)) || Number(price) < 0) {
            setError("ราคาสินค้าต้องไม่น้อยกว่า 0");
            return false;
        }

        if (!Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
            setError("จำนวนสินค้าต้องไม่น้อยกว่า 0");
            return false;
        }

        return true;
    };

    // =========================
    // CREATE PRODUCT
    // =========================
    const handleCreateProduct = async (e) => {
        e.preventDefault();

        setError("");

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    price: Number(price),
                    quantity: Number(quantity),
                }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);

                throw new Error(
                    data?.message || data?.error || "เกิดข้อผิดพลาดในการเพิ่มสินค้า",
                );
            }

            resetForm();

            setToast("Product created");
            await fetchProducts();
        } catch (error) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // =========================
    // START EDIT
    // =========================
    const startEditingProduct = (product) => {
        setEditingId(product.id);

        setName(product.name ?? "");
        setPrice(product.price?.toString() ?? "");
        setQuantity(product.quantity?.toString() ?? "0");

        setError("");
        nameInput.current?.focus({ preventScroll: true });

        window.scrollTo({
            top: 0,
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        });
    };

    // =========================
    // CANCEL EDIT
    // =========================
    const cancelEditing = () => {
        resetForm();
        setError("");
    };

    // =========================
    // UPDATE PRODUCT
    // =========================
    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        setError("");

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    price: Number(price),
                    quantity: Number(quantity),
                }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);

                throw new Error(
                    data?.message || data?.error || "เกิดข้อผิดพลาดในการแก้ไขสินค้า",
                );
            }

            // อัปเดตหน้าเว็บทันที
            setProducts((currentProducts) =>
                currentProducts.map((product) =>
                    product.id === editingId
                        ? {
                            ...product,
                            name: name.trim(),
                            price: Number(price),
                            quantity: Number(quantity),
                        }
                        : product,
                ),
            );

            resetForm();
            setToast("Product updated");
        } catch (error) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // =========================
    // DELETE PRODUCT
    // =========================
    const handleDeleteProduct = async (product) => {
        if (deleteBusy) return;
        setDeleteError('');
        setDeleteBusy(true);
        try {
            const response = await fetch(`${API_URL}/${product.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);

                throw new Error(
                    data?.message || data?.error || "เกิดข้อผิดพลาดในการลบสินค้า",
                );
            }

            // ลบสินค้าออกจากหน้าจอ
            setProducts((currentProducts) =>
                currentProducts.filter((item) => item.id !== product.id),
            );

            // ถ้าลบสินค้าที่กำลังแก้ไขอยู่
            if (editingId === product.id) {
                resetForm();
            }
            setDeleting(null);
            setToast('Product deleted');
        } catch (error) {
            setDeleteError(error.message);
        } finally { setDeleteBusy(false); }
    };

    const visible = products.filter(product =>
        (product.name.toLowerCase().includes(query.toLowerCase()) || String(product.id).includes(query)) &&
        (filter === 'all' || stockStatus(product.quantity).tone === filter));
    const focusForm = () => { resetForm(); nameInput.current?.focus(); };
    const actions = product => <div className="row-actions">
        <button className="icon-button" disabled={submitting || deleteBusy} aria-label={`Edit ${product.name}`} onClick={() => startEditingProduct(product)}><Pencil /><span>Edit</span></button>
        <button className="icon-button delete-button" disabled={submitting || deleteBusy} aria-label={`Delete ${product.name}`} onClick={() => { setDeleteError(''); setDeleting(product); }}><Trash2 /><span>Delete</span></button>
    </div>;
    return <main id="main" className="container manage-page">
        <header className="glass manage-header"><div><p className="eyebrow">YOUR WORKSPACE / INVENTORY</p><h1 className="fluid-text">Product Management</h1><p>Manage pricing, inventory and product information.</p></div><div className="product-count"><strong className="metallic-text">{loading || loadError ? '—' : products.length}</strong><span>Products</span></div></header>
        <section className="glass form-panel" aria-labelledby="form-title"><div className="form-heading"><div><p className="eyebrow">{editingId !== null ? `EDITING / #${editingId}` : 'BUILD YOUR COLLECTION'}</p><h2 id="form-title">{editingId !== null ? 'Edit product' : 'Add a new product'}</h2></div>{editingId !== null ? <Pencil /> : <Plus />}</div>
            <form noValidate onSubmit={editingId !== null ? handleUpdateProduct : handleCreateProduct}>
                <fieldset disabled={submitting || deleteBusy} className="product-form">
                    <label className="name-field" htmlFor="product-name">Product Name<input id="product-name" ref={nameInput} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Studio headphones" required maxLength={255} /></label>
                    <label htmlFor="product-price">Price <span>(THB)</span><input id="product-price" type="number" min="0" step="any" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" required /></label>
                    <label htmlFor="product-quantity">Quantity<input id="product-quantity" type="number" min="0" step="1" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" required /></label>
                    <div className="form-actions"><button className="button primary" type="submit">{submitting ? 'Saving…' : editingId !== null ? 'Save Changes' : <><Plus /> Add Product</>}</button>{editingId !== null && <button type="button" className="button secondary" onClick={cancelEditing}><X /> Cancel</button>}</div>
                </fieldset>
            </form>
            {error && <Alert onClose={() => setError('')}>{error}</Alert>}
        </section>
        <section className="inventory-section" aria-labelledby="inventory-title"><div className="section-heading"><div><p className="eyebrow">THE COLLECTION</p><h2 id="inventory-title">Product inventory <span className="count-pill">{products.length}</span></h2></div><div className="inventory-tools"><label className="search-field"><Search /><span className="sr-only">Search products</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products…" type="search" /></label><label><span className="sr-only">Stock filter</span><select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All stock</option><option value="success">In stock</option><option value="warning">Low stock</option><option value="error">Out of stock</option></select></label></div></div>
        {loading ? <Loading /> : loadError ? <Alert onRetry={fetchProducts}>{loadError}</Alert> : !products.length ? <EmptyState onAdd={focusForm} /> : !visible.length ? <div className="glass empty-state"><Search /><h3>No matching products.</h3><p>Try another name or stock status.</p><button className="button secondary" onClick={() => { setQuery(''); setFilter('all'); }}>Clear filters</button></div> : <>
            <div className="glass table-panel"><table><caption className="sr-only">Product inventory</caption><thead><tr>{['ID','Product','Price','Quantity','Status','Actions'].map(title => <th key={title} scope="col">{title}</th>)}</tr></thead><tbody>{visible.map(product => <tr key={product.id} className={searchParams.get('product') === String(product.id) ? 'highlighted' : ''}><td className="product-id">#{product.id}</td><th scope="row">{product.name}</th><td className="price-cell">{formatPrice(product.price)}</td><td>{product.quantity ?? 0}</td><td><StockBadge quantity={product.quantity} /></td><td>{actions(product)}</td></tr>)}</tbody></table></div>
            <div className="mobile-products">{visible.map(product => <article key={product.id} className={`glass mobile-product ${searchParams.get('product') === String(product.id) ? 'highlighted' : ''}`}><div className="card-top"><span className="product-id">#{product.id}</span><StockBadge quantity={product.quantity} /></div><h3>{product.name}</h3><p className="product-price">{formatPrice(product.price)}</p><div className="mobile-quantity"><span>Quantity</span><strong>{product.quantity ?? 0}</strong></div>{actions(product)}</article>)}</div>
            <p className="list-caption">Showing {visible.length} of {products.length} products</p>
        </>}
        </section>
        <Toast message={toast} onClose={closeToast} />
        <ConfirmDialog product={deleting} busy={deleteBusy} error={deleteError} onCancel={() => setDeleting(null)} onConfirm={() => handleDeleteProduct(deleting)} />
    </main>;
}
export default ManageProduct;
