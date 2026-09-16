import express from "express";
import { connectDB, Product } from "./db.js";
import cors from "cors";

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",").map((origin) => origin.trim()).filter(Boolean);
if (process.env.NODE_ENV !== "production") {
    allowedOrigins.push("http://localhost:5173", "http://127.0.0.1:5173");
}

const isAllowedOrigin = (origin) => {
    if (!origin) return true;

    return allowedOrigins.some((allowedOrigin) => {
        if (!allowedOrigin.includes("*")) return origin === allowedOrigin;

        const escaped = allowedOrigin
            .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
            .replaceAll("*", ".*");
        return new RegExp(`^${escaped}$`).test(origin);
    });
};

app.use(cors({
    origin(origin, callback) {
        callback(null, isAllowedOrigin(origin));
    },
}));

const PORT = Number(process.env.PORT || 5000);

// Middleware สำหรับอ่าน JSON จาก request body
app.use(express.json());

app.use((req, res, next) => {
    const startedAt = Date.now();
    res.on("finish", () => {
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - startedAt}ms`);
    });
    next();
});

// เชื่อมต่อฐานข้อมูล
if (process.env.VERCEL) {
    app.use(async (req, res, next) => {
        try {
            await connectDB();
            next();
        } catch {
            res.status(503).json({ message: "Database is unavailable" });
        }
    });
}

app.get("/", (req, res) => {
    return res.status(200).send({
        message: "Welcome to the Product API"
    });
});

app.get("/health", (req, res) => {
    return res.status(200).json({ status: "ok" });
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
// Render runs the HTTP server. Vercel can import the Express app as a handler.
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exitCode = 1;
    }
}

if (!process.env.VERCEL) {
    startServer();
}

export default app;
