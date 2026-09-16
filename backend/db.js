import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

/*
|--------------------------------------------------------------------------
| Database Connection
|--------------------------------------------------------------------------
|
| Production (Render + Neon)
|   DATABASE_URL_UNPOOLED=postgresql://...
|
| Local PostgreSQL (optional)
|   PGDATABASE=product_db
|   PGUSER=dev_user
|   PGPASSWORD=dev_password
|   PGHOST=127.0.0.1
|   PGPORT=5432
|
*/

const databaseUrl =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL;

let sequelize;

if (databaseUrl) {
  // ==========================================
  // Production / Neon PostgreSQL
  // ==========================================
  sequelize = new Sequelize(databaseUrl, {
    dialect: "postgres",

    logging: false,

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },

    // Sequelize manages its own connection pool
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // ==========================================
  // Local PostgreSQL
  // ==========================================
  sequelize = new Sequelize(
    process.env.PGDATABASE || "product_db",
    process.env.PGUSER || "dev_user",
    process.env.PGPASSWORD || "dev_password",
    {
      host: process.env.PGHOST || "127.0.0.1",
      port: Number(process.env.PGPORT || 5432),

      dialect: "postgres",

      logging: false,
    }
  );
}

/*
|--------------------------------------------------------------------------
| Product Model
|--------------------------------------------------------------------------
*/

const Product = sequelize.define(
  "Product",
  {
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
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    tableName: "products",

    // Database จะมีแค่
    // id, name, price, quantity
    timestamps: false,
  }
);

/*
|--------------------------------------------------------------------------
| Database Connection
|--------------------------------------------------------------------------
*/

let connectionPromise = null;

const connectDB = async () => {
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      await sequelize.authenticate();

      console.log("✅ PostgreSQL connection successful");

      // สร้าง table ถ้ายังไม่มี
      await sequelize.sync();

      console.log("✅ Database schema initialized");

      return sequelize;
    } catch (error) {
      connectionPromise = null;

      console.error(
        "❌ PostgreSQL connection failed:",
        error.message
      );

      throw error;
    }
  })();

  return connectionPromise;
};

export {
  sequelize,
  Product,
  connectDB,
};