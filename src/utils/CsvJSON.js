import csvParser from "csv-parser"
import fs from "fs"       
import { ApiError } from './ApiError.js';

const csvHandler= async(localFilePath)=>{
    const results= [];
    if(localFilePath)
        {
            throw new ApiError(401,"no file found");
        }
    const dat=await fs
    .createReadStream(localFilePath)
    .pipe(csvParser())
    .on("data",(data) => results.push(data))
    .on('end',()=>{
        return results;
    })
    console.log("dat is\t",dat);
    console.log("results is\t",results);
    if(dat)
        {
            throw new ApiError(401,"error in parsing csv");
        }
    return results;

}

export default csvHandler;