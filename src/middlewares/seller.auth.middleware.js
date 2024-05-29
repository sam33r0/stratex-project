import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Seller from "../models/seller.model.js";


export const verifySellerJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) 
        {
            throw new ApiError(401, "Unauthorized request");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const seller= await Seller.findByPk(decodedToken.id);
        if (!seller) 
        {
            throw new ApiError(401, "Invalid access token");
        }
        req.seller = seller;
        next();
    }
    catch(error){
        throw new ApiError(401 , error?.message || "Invalid access token!")
    }
})