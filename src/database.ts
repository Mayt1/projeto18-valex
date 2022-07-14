import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const { Pool } = pg;
const config = {
    connectionString: process.env.DATABASE_URL,
    ssl:null
}

if(process.env.MODE === "PROD"){
    config.ssl = {
        rejectUnauthorized: false
    }
}

const db = new Pool(config);
export default db;


