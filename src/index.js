import dotenv from "dotenv"
import connect from "./db/index.js";
import { app } from "./app.js";
import { ApiResponse } from "./utils/ApiResponse.js";
dotenv.config({
    path: './.env'
})
connect()
    .then(() => {
        console.log(process.env.POSTGRES_USERNAME,process.env.POSTGRES_PASSWORD);
        app.on("error",
            (error) => {
                console.log("error", error);
                throw error;
            }
        )
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running at ${process.env.PORT}`)
        })
        app.get("/",(req,res)=>{
            res.json(new ApiResponse(200,{data:"I am live"}));
        })
    })
    .catch((error) => {
        console.log("PostGres SQL connection fail!!! ", error);
    });


