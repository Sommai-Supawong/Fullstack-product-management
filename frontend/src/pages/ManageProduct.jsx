import { useEffect, useState } from "react";
import "../App.css";

import {
    Package,
    PackageSearch,
    Pencil,
    PlusCircle,
    Trash2,
    X,
} from "lucide-react";

function ManageProduct() {
    const API_URL = import.meta.env.VITE_API_URL + "/products";

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
    const [isAlertClosing, setIsAlertClosing] = useState(false);

    // =========================
    // GET PRODUCTS
    // =========================
    const fetchProducts = async () => {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("ไม่สามารถดึงข้อมูลสินค้าได้");
            }

            const data = await response.json();

            setProducts(data);
            setError("");
        } catch (error) {
            setError(error.message);
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error("ไม่สามารถดึงข้อมูลสินค้าได้");
                }

                const data = await response.json();

                setProducts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [API_URL]);

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

        window.scrollTo({
            top: 0,
            behavior: "smooth",
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
        const confirmed = window.confirm(
            `คุณต้องการลบสินค้า "${product.name}" ใช่หรือไม่?`,
        );

        if (!confirmed) {
            return;
        }

        setError("");

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
        } catch (error) {
            setError(error.message);
        }
    };

    // =========================
    // FORMAT PRICE
    // =========================
    const formatPrice = (value) => {
        const number = Number(value);

        if (Number.isNaN(number)) {
            return value;
        }

        return new Intl.NumberFormat("th-TH", {
            style: "currency",
            currency: "THB",
        }).format(number);
    };

    // =========================
    // Alert Close Animation
    // =========================
    const closeAlert = () => {
        setIsAlertClosing(true);

        setTimeout(() => {
            setError("");
            setIsAlertClosing(false);
        }, 300);
    };
    return (
        <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* ========================= */}
                {/* HEADER */}
                {/* ========================= */}

                <header className="hero-panel rounded-box px-5 py-7 shadow-xl sm:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="rounded-2xl bg-primary/10 p-4">
                            <PackageSearch className="h-12 w-12 text-primary" />
                        </div>

                        <div className="font-kanit">
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Product Management
                            </h1>

                            <p className="mt-1 text-sm text-base-content/60 sm:text-base">
                                ระบบจัดการสินค้า
                            </p>
                        </div>
                    </div>
                </header>

                {/* ========================= */}
                {/* CREATE / UPDATE FORM */}
                {/* ========================= */}

                <section className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body p-5 sm:p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-xl bg-primary/10 p-2 text-primary">
                                {editingId !== null ? (
                                    <Pencil className="h-5 w-5" />
                                ) : (
                                    <PlusCircle className="h-5 w-5" />
                                )}
                            </div>

                            <div className="font-kanit">
                                <h2 className="card-title text-base-content">
                                    {editingId !== null ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
                                </h2>

                                <p className="text-sm text-base-content/60">
                                    {editingId !== null
                                        ? "แก้ไขรายละเอียดสินค้า แล้วกดบันทึกการแก้ไข"
                                        : "กรอกข้อมูลสินค้าที่ต้องการเพิ่มลงในระบบ"}
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={
                                editingId !== null ? handleUpdateProduct : handleCreateProduct
                            }
                            className="grid grid-cols-1 gap-4 font-kanit md:grid-cols-[1fr_0.65fr_0.45fr_auto] md:items-end"
                        >
                            {/* NAME */}

                            <label className="form-control w-full">
                                <span className="mb-2 font-medium">ชื่อสินค้า</span>

                                <input
                                    className="input input-bordered w-full"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="เช่น iPhone 17"
                                    disabled={submitting}
                                />
                            </label>

                            {/* PRICE */}

                            <label className="form-control w-full">
                                <span className="mb-2 font-medium">ราคา</span>

                                <input
                                    className="input input-bordered w-full"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="เช่น 29990"
                                    disabled={submitting}
                                />
                            </label>

                            {/* QUANTITY */}

                            <label className="form-control w-full">
                                <span className="mb-2 font-medium">จำนวน</span>

                                <input
                                    className="input input-bordered w-full"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="เช่น 10"
                                    disabled={submitting}
                                />
                            </label>

                            {/* BUTTONS */}

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn btn-primary flex-1 md:w-auto"
                                >
                                    {submitting ? (
                                        <span className="loading loading-spinner loading-sm" />
                                    ) : editingId !== null ? (
                                        <Pencil className="h-4 w-4" />
                                    ) : (
                                        <PlusCircle className="h-4 w-4" />
                                    )}

                                    {submitting
                                        ? "กำลังบันทึก..."
                                        : editingId !== null
                                            ? "บันทึกการแก้ไข"
                                            : "เพิ่มสินค้า"}
                                </button>

                                {editingId !== null && (
                                    <button
                                        type="button"
                                        disabled={submitting}
                                        onClick={cancelEditing}
                                        className="btn btn-ghost"
                                    >
                                        <X className="h-4 w-4" />
                                        ยกเลิก
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </section>

                {/* ========================= */}
                {/* ERROR */}
                {/* ========================= */}

                {error && (
                    <div
                        role="alert"
                        className={`alert alert-error font-kanit shadow-lg ${isAlertClosing ? "alert-exit" : "alert-enter"
                            }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>

                        <span>{error}</span>

                        <button
                            type="button"
                            onClick={closeAlert}
                            className="btn btn-ghost btn-sm transition-transform duration-200 hover:rotate-90"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* ========================= */}
                {/* LOADING */}
                {/* ========================= */}

                {loading ? (
                    <div className="flex min-h-48 items-center justify-center gap-3 rounded-box border border-base-300 bg-base-100 font-kanit shadow-sm">
                        <span className="loading loading-spinner loading-md" />

                        <span>กำลังโหลดข้อมูล...</span>
                    </div>
                ) : products.length === 0 ? (
                    /* ========================= */
                    /* EMPTY STATE */
                    /* ========================= */

                    <div className="card border border-dashed border-base-300 bg-base-100 font-kanit shadow-sm">
                        <div className="card-body items-center py-14 text-center">
                            <div className="rounded-full bg-base-200 p-4">
                                <Package className="h-12 w-12 text-base-content/30" />
                            </div>

                            <h2 className="mt-3 text-xl font-bold">ไม่มีข้อมูลสินค้า</h2>

                            <p className="text-sm text-base-content/60">
                                เพิ่มสินค้าใหม่จากแบบฟอร์มด้านบน
                            </p>
                        </div>
                    </div>
                ) : (
                    /* ========================= */
                    /* PRODUCT LIST */
                    /* ========================= */

                    <section className="card border border-base-300 bg-base-100 font-kanit shadow-sm">
                        <div className="card-body p-0">
                            {/* TABLE TITLE */}

                            <div className="flex items-center justify-between px-5 py-5 sm:px-6">
                                <div>
                                    <h2 className="card-title">รายการสินค้าทั้งหมด</h2>

                                    <p className="text-sm text-base-content/60">
                                        มีสินค้า {products.length} รายการ
                                    </p>
                                </div>

                                <span className="badge badge-primary badge-lg">
                                    {products.length}
                                </span>
                            </div>

                            {/* TABLE */}

                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>รหัส</th>
                                            <th>ชื่อสินค้า</th>
                                            <th>ราคา</th>
                                            <th>จำนวน</th>
                                            <th className="text-right">จัดการ</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {products.map((product) => (
                                            <tr
                                                key={product.id}
                                                className={
                                                    editingId === product.id ? "bg-primary/5" : ""
                                                }
                                            >
                                                {/* ID */}

                                                <td className="font-mono text-xs text-base-content/50">
                                                    #{product.id}
                                                </td>

                                                {/* NAME */}

                                                <td>
                                                    <div className="font-medium">{product.name}</div>
                                                </td>

                                                {/* PRICE */}

                                                <td className="font-medium text-success">
                                                    {formatPrice(product.price)}
                                                </td>

                                                {/* QUANTITY */}

                                                <td>
                                                    <span
                                                        className={`badge ${Number(product.quantity) === 0
                                                                ? "badge-error"
                                                                : Number(product.quantity) <= 5
                                                                    ? "badge-warning"
                                                                    : "badge-success"
                                                            } badge-outline`}
                                                    >
                                                        {product.quantity ?? 0}
                                                    </span>
                                                </td>

                                                {/* ACTION */}

                                                <td>
                                                    <div className="flex justify-end gap-1">
                                                        {/* EDIT */}

                                                        <button
                                                            type="button"
                                                            onClick={() => startEditingProduct(product)}
                                                            className="btn btn-square btn-ghost btn-sm text-primary hover:bg-primary/10"
                                                            title="แก้ไข"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>

                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteProduct(product)}
                                                            className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"
                                                            title="ลบ"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}

export default ManageProduct;
