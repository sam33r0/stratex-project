import csvParser from "csv-parser"
import fs from "fs"
import { ApiError } from './ApiError.js';
import { log } from "console";
import { resolve } from "path";
import { rejects } from "assert";

const csvHandler = async (localFilePath) => {
    console.log(localFilePath);
    let flag = false;
    const results = [];
    if (!localFilePath) {
        throw new ApiError(401, "no file found");
    }
    let res;
    const pro=new Promise((resolve,reject)=>{
        res=resolve;
    })    
    const dat = fs
        .createReadStream(localFilePath)
        .pipe(csvParser())
        .on("data", async (data) => await results.push(data))
        .on('end', async () => {
            res(results);
            await fs.unlinkSync(localFilePath);
        })
    // if(dat)
    //     {
    //         throw new ApiError(401,"error in parsing csv");
    //     }
   
    return pro;

}

export default csvHandler;