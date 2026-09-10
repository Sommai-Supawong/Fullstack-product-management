import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home.jsx";
import ManageProduct from "./pages/ManageProduct.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/manage-products" element={<ManageProduct />} />
    </Routes>
  );
}

export default App;
