import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import Seller from "../models/seller.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import csvHandler from "../utils/CsvJSON.js";
import Book from "../models/book.model.js";

const generateAccessAndRefreshToken = async (sellerId) => {
    try {
        const seller = await Seller.findById({ where: { id: sellerId } })
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
        new ApiResponse(201, seller, "User registered Successfully")
    )
});

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

const csvController = asyncHandler(async (req, res) => {
    const sampleLocalPath = req.file?.path;
    console.log(sampleLocalPath);
    const data = csvHandler(sampleLocalPath);
    console.log("data\t", data);
    const seller = req.seller;
    data.forEach(async (element) => {
        const existingBook = await Book.findOne({
            where: {
                title: element.title
            }
        })
        if (!existingBook) {
            throw new ApiError(401, `book with title name = ${element.title} already exists. Uploaded till this book`);
        }
        const book = await Book.create({
            title: element.title,
            author: element.author,
            publishDate: element.publishedDate,
            price: element.price,
            seller_id: seller.id,
        });
    });

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