import csvParser from "csv-parser"
import fs from "fs"
import { ApiError } from './ApiError.js';

const csvHandler = async (localFilePath) => {
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
        .on("data", async (data) => results.push(data))
        .on('end', async () => {
            res(results);
            fs.unlinkSync(localFilePath);
        })   
    return pro;

}

export default csvHandler;