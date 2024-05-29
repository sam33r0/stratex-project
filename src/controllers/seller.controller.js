import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import Seller from "../models/seller.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import csvHandler from "../utils/CsvJSON.js";
import Book from "../models/book.model.js";
//tested
const generateAccessAndRefreshToken = async (sellerId) => {
    try {
        const seller = await Seller.findOne({ where: { id: sellerId } })
        const accessToken = seller.generateAccessToken();
        const refreshToken = seller.generateRefreshToken()

        seller.ref_token = refreshToken

        await seller.save();

        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token");
    }
}
//tested
const registerSeller = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (
        [name, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "incomplete data");
    }
    const existedSeller = await Seller.findOne({ where: { email: email } });
    if (existedSeller) {
        throw new ApiError(400, "email already registered");
    }
    const seller = await Seller.create({
        name: name,
        email: email,
        password: password,
        ref_token: ''
    });

    return res.status(201).json(
        new ApiResponse(201, seller, "Seller registered Successfully")
    )
});
//tested
const logoutSeller = asyncHandler(async (req, res) => {
    const seller = req.seller;
    // const seller = await Seller.findOne({ where: { email: sel.email } });
    seller.ref_token = '';
    await seller.save();
    const options = {
        httpOnly: true,
        secure: true,
    }
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "Seller logged out successfully"));
});
//tested
const loginSeller = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        throw new ApiError(400, "username or email is required");
    }

    const seller = await Seller.findOne({ where: { email: email } });
    if (!seller) {
        throw new ApiError(404, "user does not exist please register");
    }
    const isPasswordValid = await seller.isValidPassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(seller.id);
    const options = {
        httpOnly: true,
        secure: true,

    }
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200,
            {
                seller, accessToken, refreshToken,
            },
            "Seller logged In Successfully"
        )
    )
});
//tested
const csvController = asyncHandler(async (req, res) => {
    const sampleLocalPath = req.file?.path;
    const data =await csvHandler(sampleLocalPath);
    // console.log("data\t", data);
    const seller = req.seller;
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const existingBook = await Book.findOne({
            where: {
                title: element.title
            }
        })
        if (existingBook) {
            throw new ApiError(401, `book with title ${element.title} already exists. Uploaded till index ${index}`);
        }
        const book = await Book.create({
            title: element.title,
            author: element.author,
            publishDate: element.publishedDate,
            price: element.price,
            seller_id: seller.id,
        });
    }

    return res.status(200).json(
        new ApiResponse(200,
            { data },
            "Books uploaded Successfully"
        )
    )

})

export {
    registerSeller,
    loginSeller,
    logoutSeller,
    csvController
}