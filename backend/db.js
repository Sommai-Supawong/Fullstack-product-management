import "dotenv/config";
import { Sequelize, DataTypes } from "sequelize";

const dbName = process.env.PGDATABASE;
const dbUsername = process.env.PGUSER;
const dbPassword = process.env.PGPASSWORD;

// Vercel / Neon: ใช้ pooled connection ก่อน
const dbHost =
    process.env.PGHOST ||
    process.env.PGHOST_UNPOOLED;

const dbPort = Number(process.env.PGPORT || 5432);

const sequelize = new Sequelize(
    dbName,
    dbUsername,
    dbPassword,
    {
        host: dbHost,
        port: dbPort,
        dialect: "postgres",
        logging: false,

        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);


// ==============================
// Product Model
// ==============================

const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
});


// ==============================
// Database Connection
// ==============================

let connectionPromise = null;

const connectDB = async () => {
    if (!connectionPromise) {
        connectionPromise = sequelize
            .authenticate()
            .then(() => {
                console.log("✅ PostgreSQL connected successfully");
            })
            .catch((error) => {
                connectionPromise = null;
                console.error("❌ PostgreSQL connection failed:", error);
                throw error;
            });
    }

    return connectionPromise;
};

export {
    sequelize,
    Product,
    connectDB,
};