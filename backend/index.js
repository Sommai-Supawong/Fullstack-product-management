import express from "express";
import { connectDB, Product } from "./db.js";
import cors from "cors";

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));

const PORT = Number(process.env.PORT || 5000);

// Middleware สำหรับอ่าน JSON จาก request body
app.use(express.json());

// เชื่อมต่อฐานข้อมูล
connectDB();

app.get("/", (req, res) => {
    return res.status(200).send({
        message: "Welcome to the Product API"
    });
});


// ========================
// CREATE PRODUCT
// ========================
app.post("/products", async (req, res) => {
    try {
        const { name, price, quantity } = req.body;

        const normalizedName = typeof name === "string" ? name.trim() : "";
        const numericPrice = Number(price);
        const numericQuantity = Number(quantity);

        // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
        if (
            !normalizedName ||
            price === undefined ||
            price === null ||
            quantity === undefined ||
            quantity === null
        ) {
            return res.status(400).json({
                message: "name, price and quantity are required"
            });
        }

        // ตรวจสอบราคา
        if (!Number.isFinite(numericPrice) || numericPrice < 0) {
            return res.status(400).json({
                message: "price must be greater than or equal to 0"
            });
        }

        // ตรวจสอบจำนวนสินค้า
        if (!Number.isFinite(numericQuantity) || numericQuantity < 0) {
            return res.status(400).json({
                message: "quantity must be greater than or equal to 0"
            });
        }

        // quantity ควรเป็นจำนวนเต็ม
        if (!Number.isInteger(numericQuantity)) {
            return res.status(400).json({
                message: "quantity must be an integer"
            });
        }

        const product = await Product.create({
            name: normalizedName,
            price: numericPrice,
            quantity: numericQuantity
        });

        return res.status(201).json(product);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});


// ========================
// GET ALL PRODUCTS
// ========================
app.get("/products", async (req, res) => {
    try {
        const products = await Product.findAll({
            order: [["id", "ASC"]]
        });

        return res.status(200).json(products);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});


// ========================
// GET PRODUCT BY ID
// ========================
app.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json(product);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});


// ========================
// UPDATE PRODUCT
// ========================
app.put("/products/:id", async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const { name, price, quantity } = req.body;

        const normalizedName = typeof name === "string" ? name.trim() : "";
        const numericPrice = Number(price);
        const numericQuantity = Number(quantity);

        // ต้องมีอย่างน้อย 1 field ที่ต้องการแก้
        if (
            name === undefined &&
            price === undefined &&
            quantity === undefined
        ) {
            return res.status(400).json({
                message: "name, price or quantity is required"
            });
        }

        if (name !== undefined && !normalizedName) {
            return res.status(400).json({
                message: "name must not be empty"
            });
        }

        // ตรวจสอบราคา
        if (
            price !== undefined &&
            (price === null || !Number.isFinite(numericPrice) || numericPrice < 0)
        ) {
            return res.status(400).json({
                message: "price must be greater than or equal to 0"
            });
        }

        // ตรวจสอบ quantity
        if (
            quantity !== undefined &&
            (quantity === null || !Number.isFinite(numericQuantity) || numericQuantity < 0)
        ) {
            return res.status(400).json({
                message: "quantity must be greater than or equal to 0"
            });
        }

        if (
            quantity !== undefined &&
            !Number.isInteger(numericQuantity)
        ) {
            return res.status(400).json({
                message: "quantity must be an integer"
            });
        }

        await product.update({
            ...(name !== undefined && {
                name: normalizedName
            }),

            ...(price !== undefined && {
                price: numericPrice
            }),

            ...(quantity !== undefined && {
                quantity: numericQuantity
            })
        });

        return res.status(200).json(product);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});


// ========================
// DELETE PRODUCT
// ========================
app.delete("/products/:id", async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await product.destroy();

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});


// ดักฟัง request
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
