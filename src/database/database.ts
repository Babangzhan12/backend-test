import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

dotenv.config();
const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: "postgres",
  logging: true,
  models: [],
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    }
  }
});

// sequelize.sync({ alter: true })
//   .then(() => console.log("Database synced automatically (alter mode)"))
//   .catch(err => console.error("DB sync error:", err));

// const sequelize = new Sequelize({
//   database: process.env.DB_NAME,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT), 
//   dialect: 'mysql',
//   models: [],
//   logging: console.log,
//   pool: {
//     max: 10,        
//     min: 0,        
//     acquire: 30000, 
//     idle: 10000    
//   },
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     }
//   }
// });

export default sequelize;
