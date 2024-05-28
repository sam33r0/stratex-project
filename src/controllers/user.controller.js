import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { where } from "sequelize";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById({ where: { id: userId } })
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken()

        user.ref_token = refreshToken

        await user.save();

        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (
        [name, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "incomplete data");
    }
    const existedUser = await User.findOne({ where: { email: email } });
    if (existedUser) {
        throw new ApiError(400, "email already registered");
    }
    const user = await User.create({
        name: name,
        email: email,
        password: password,
        ref_token: ''
    });

    return res.status(201).json(
        new ApiResponse(201, user, "User registered Successfully")
    )
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        throw new ApiError(400, "username or email is required");
    }
    
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        throw new ApiError(404, "user does not exist please register");
    }
    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.id);
    const options = {
        httpOnly: true,
        secure: true,

    }
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200,
            {
                user, accessToken, refreshToken,
            },
            "User logged In Successfully"
        )
    )
});

export {registerUser,loginUser}