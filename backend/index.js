import express from "express";
import { connectDB, Product } from "./db.js";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 5000;


// Middleware สำหรับอ่าน JSON จาก request body
app.use(express.json());

// เชื่อมต่อฐานข้อมูล
connectDB();

app.get("/", (req, res) => {
    return res.status(200).send({ message: "Welcome to the Product API" });
});

// Create a product
app.post("/products", async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!name || price === undefined || price === null) {
            return res.status(400).json({ message: "name and price are required" });
        }

        const product = await Product.create({ name, price });
        return res.status(201).json(product);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Get all products
app.get("/products", async (req, res) => {
    try {
        const products = await Product.findAll({ order: [["id", "ASC"]] });
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get a product by id
app.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Update a product
app.put("/products/:id", async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const { name, price } = req.body;

        if (name === undefined && price === undefined) {
            return res.status(400).json({ message: "name or price is required" });
        }

        await product.update({
            ...(name !== undefined && { name }),
            ...(price !== undefined && { price }),
        });

        return res.status(200).json(product);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Delete a product
app.delete("/products/:id", async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// ดักฟัง request
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
