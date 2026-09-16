import { Sequelize, DataTypes } from "sequelize";
const dbName = process.env.PGDATABASE;
const dbUsername = process.env.PGUSER;
const dbPassword = process.env.PGPASSWORD;
const dbURL = process.env.PGHOST_UNPOOLED;
const PORT = process.env.PGPORT;


// const databaseUrl = process.env.DATABASE_URL_UNPOOLED;
// สร้างการเชื่อมต่อ PostgreSQL
const sequelize = new Sequelize(
    dbName,
    dbUsername,
    dbPassword,
    {
        host: dbURL,
        port: PORT,
        dialect: "postgres",
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false, // ปิดการตรวจสอบใบรับรอง SSL
            }
        }
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

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
});

// เชื่อมต่อและสร้างตารางตรับ
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