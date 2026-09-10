import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";

function Home() {
    return (
        <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <section className="hero min-h-[80vh]">
                    <div className="hero-content text-center">
                        <div className="max-w-2xl font-kanit">

                            <div className="mb-6 flex justify-center">
                                <div className="rounded-3xl bg-primary/10 p-5">
                                    <PackageSearch className="h-16 w-16 text-primary" />
                                </div>
                            </div>

                            <h1 className="text-4xl font-bold sm:text-5xl">
                                Product Management System
                            </h1>

                            <p className="mt-4 text-lg text-base-content/60">
                                ระบบสำหรับจัดการข้อมูลสินค้า เพิ่ม แก้ไข และลบสินค้า
                                ภายในระบบ
                            </p>

                            <div className="mt-8">
                                <Link
                                    to="/manage-products"
                                    className="btn btn-primary btn-lg"
                                >
                                    <PackageSearch className="h-5 w-5" />
                                    จัดการสินค้า
                                </Link>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Home;