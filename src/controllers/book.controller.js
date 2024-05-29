import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import Book from "../models/book.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import Seller from "../models/seller.model.js";

const findAllBooks = asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    if (!books) {
        throw new ApiError(401, "No books found");
    }
    return res.status(201).json(new ApiResponse(201, books, "books found"));
})

const findBook = asyncHandler(async (req, res) => {
    const book_id = req.params;
    const { id } = req.body;
    if (!id && !book_id) {
        throw new ApiError(401, "id not found");
    }
    const ids= book_id || id;
    const book = await Book.findByPk(ids, {
        include: Seller
    })
    if (!book) {
        throw new ApiError(401, "Book not found");
    }
    return res.status(201).json(new ApiResponse(201, book, "books found"));
})

export { findAllBooks }