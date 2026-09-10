import { Sequelize, DataTypes } from "sequelize";

// สร้างการเชื่อมต่อ PostgreSQL
const sequelize = new Sequelize(
    "product_db",
    "dev_user",
    "dev_password",
    {
        host: "localhost",
        port: 5433,
        dialect: "postgres",
        logging: false,
    }
);

// สร้าง Model Product
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
});

// เชื่อมต่อและสร้างตาราง
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL connected successfully");

        await sequelize.sync({ alter: true });
        console.log("Tables synchronized successfully");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
};

export { sequelize, Product, connectDB };