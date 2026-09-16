import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
const sequelize = databaseUrl
    ? new Sequelize(databaseUrl, {
        dialect: "postgres", logging: false,
        dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
        pool: { max: 5, min: 0, idle: 10000 },
    })
    : new Sequelize(process.env.PGDATABASE || "product_db", process.env.PGUSER || "dev_user", process.env.PGPASSWORD || "dev_password", {
        host: process.env.PGHOST || "127.0.0.1",
        port: Number(process.env.DB_PORT || 5433), dialect: "postgres", logging: false,
    });

const Product = sequelize.define("Product", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});

let connectionPromise = null;
const connectDB = async () => {
    if (!connectionPromise) {
        connectionPromise = sequelize.authenticate()
            .then(() => console.log("PostgreSQL connected successfully"))
            .catch((error) => {
                connectionPromise = null;
                console.error("PostgreSQL connection failed:", error.message);
                throw error;
            });
    }
    return connectionPromise;
};

export { sequelize, Product, connectDB };
