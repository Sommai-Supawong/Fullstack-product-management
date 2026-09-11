import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/Home.jsx";
import ManageProduct from "./pages/ManageProduct.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import "./App.css";

function App() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return (
    <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/manage-products" element={<ManageProduct />} />
    </Routes>
    <footer className="site-footer container"><span className="brand">PRODUCT OS</span><span>A little clarity. A lot of possibility.</span><span>PRODUCT MANAGEMENT</span></footer>
    </>
  );
}

export default App;
