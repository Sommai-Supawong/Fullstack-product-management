import { useState, useEffect } from 'react'
import './App.css'
import { Divide, Package, Plus, PlusCircle } from 'lucide-react';
import { PackageSearch, Pencil, Trash2 } from 'lucide-react';

function App() {
  const API_URL = "http://localhost:5000/products"
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error("ไม่สามารถดึงข้อมูลได้")
      const data = await response.json();
      console.log(data);
      setProducts(data);
    }
    catch (error) {
      setError(error.message);
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    //fetch data from API
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      setError("กรุณากรอกชื่อสินค้าและราคา");
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, price })
      });
      if (!response.ok) throw new Error("ไม่สามารถเพิ่มสินค้าได้");
      const newProduct = await response.json();
      fetchProducts(); // Refresh the product list after adding a new product
      setName("");
      setPrice("");
    }
    catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <main className='min-h-screen px-4 py-6 sm:px6 lg:px8'>
        <div className='mx-auto max-w-6xl space-y-6'>
          <header className='hero-panel rounded-box px-5 py-7 text-primary-contecnt shadow-x1 sm:px-8'>
            <div className='flex flex-col gap-6 sm:flex-row sm:item-end sm:justify-between'>
              <div>

                <div className='rounded-box px-5 py-5'>
                  <PackageSearch className="text-black w-12 h-12 " />
                </div>
              </div>
              <div className='font-kanit'>
                <h1 className='text-2xl font-bold  tracking-tight sm:text-3xl'>Product Management</h1>
                <p className='mt-2 max-w-xl text-sm text-primary-content/75 sm:text-base'>ระบบจัดการสินค้า</p>
              </div>
            </div>
          </header>
           {/* Add Product Form */}
        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <PlusCircle className="size-5" />
              </div>
              <div>
                <h2 className="card-title text-base-content">เพิ่มสินค้าใหม่</h2>
                <p className="text-sm text-base-content/60">
                  กรอกชื่อสินค้าและราคาที่ต้องการเพิ่มลงในระบบ
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateProduct} className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_0.65fr_auto] md:items-end">
              <label className="form-control w-full">
                <span className="label-text mb-2 font-medium">ชื่อสินค้า</span>
                <input
                  className="input input-bordered w-full"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น iPhone"
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text mb-2 font-medium">ราคา</span>
                <input
                  className="input input-bordered w-full"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="เช่น 29990"
                />
              </label>
              <button type="submit" className="btn btn-primary w-full md:w-auto" onClick={handleCreateProduct}>
                <PlusCircle className="size-4" /> เพิ่มสินค้า
              </button>
            </form>
          </div>
        </section>
          <section className='font-kanit font-bold'>Form</section>
          {error && (
            <div role="alert" className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Error! Task failed successfully.</span>
            </div>)}


          {loading ? (
            <div className='font-kanit flex min-h-48 item-center jutify-center rounded-box border border-base-300 bg-base-100 shadow-sm '>
              <span className="loading loading-spinner loading-md"></span>
              <span className='sr-only'>กำลังโหลดข้อมูล</span>
            </div>
          ) : products.length === 0 ? (
            <div className='font-kanit card border border-dashed border-base-300 bg-base-100 shadow-sm'>
              <div className='card-body item-center py-14 text-center'>
                <Package className='size-12 text-base-300 bg-base-100 shadow-sm' />
                <h2 className=''>ไม่มีข้อมูลสินค้า</h2>
                <p className='text-sm text-base-content/60'>เพิ่มส้นค้าใหม่ด้านบน</p>
              </div>
            </div>
          ) : (
            <section className="card border font-kanit border-base-300 bg-base-100 shadow-sm">
              <div className="card-body p-0">
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
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ชื่อสินค้า</th>
                        <th>ราคา</th>
                        <th>จำนวน</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td className='text-green-500'>{product.price}</td>
                          <td className=''>{product.quantity}</td>
                          <td className="text-right">
                            <button className="btn btn-square btn-ghost btn-sm text-primary hover:bg-primary/10 "><Pencil className="size-4" /></button>
                            <button className="btn btn-square btn-ghost btn-sm text-primary hover:bg-primary/10 "><Trash2 className="size-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}




          <section className='font-kanit font-bold'>Product List </section>
        </div>
      </main >
    </>
  )
}

export default App
