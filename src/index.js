import dotenv from "dotenv"
import connect from "./db/index.js";
dotenv.config({
    path: './.env'
})
connect().then(()=>{
    console.log(process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASSWORD);
})
