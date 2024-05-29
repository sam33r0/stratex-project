import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import Book from "../models/book.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import Seller from "../models/seller.model.js";
//tested
const findAllBooks = asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    if (!books) {
        throw new ApiError(401, "No books found");
    }
    return res.status(201).json(new ApiResponse(201, books, "books found"));
})
//tested
const findBook = asyncHandler(async (req, res) => {
    const { book_id } = req.params;
    const { id, title } = req.body;
    if (!id && !book_id && !title) {
        throw new ApiError(401, "id not found");
    }
    const ids = book_id || id;
    if (ids) {
        const book = await Book.findByPk(ids, {
            include: Seller
        })
        if (!book) {
            throw new ApiError(401, "Book not found");
        }
        return res.status(201).json(new ApiResponse(201, book, "book found"));
    }
    if (title) {
        const book = await Book.findOne({
            where: {
                title: title
            }
            ,
            include: Seller
        })
        if (!book) {
            throw new ApiError(401, "Book not found");
        }
        return res.status(201).json(new ApiResponse(201, book, "book found"));
    }
})
//tested
const updateBookDetails = asyncHandler(async (req, res) => {
    const { book_id } = req.params;
    const { id, title, newTitle, newPrice, newPublishedDate, newAuthor } = req.body;
    if (!id && !book_id && !title) {
        throw new ApiError(401, "id not found");
    }
    const seller = req.seller;
    let book;
    const ids = id || book_id;
    if (ids) {
        book = await Book.findByPk(ids, {
            include: Seller
        })
    }
    if (!book && title) {
        book = await Book.findOne({
            where: {
                title: title
            },
            include: Seller
        })
    }
    // check seller id and update the book
    if (book.seller_id != seller.id) {
        throw new ApiError(401, "unauthorized request");
    }
    if (newTitle)
        book.title = newTitle;
    if (newAuthor)
        book.author = newAuthor;
    if (newPublishedDate)
        book.publishDate = newPublishedDate;
    if (newPrice)
        book.price = newPrice;
    await book.save();
    return res.status(201).json(new ApiResponse(201, book, "books found"));
})
//tested
const addBook = asyncHandler(async (req, res) => {
    const seller = req.seller;
    const { title, author, publishedDate, price } = req.body;
    const existingBook = await Book.findOne({ where: { title: title } });
    if (existingBook)
        throw new ApiError(401, "Book already listed");

    const book = await Book.create({
        title: title,
        author: author,
        publishDate: publishedDate,
        price: price,
        seller_id: seller.id,
    });
    if (!book)
        throw new ApiError(401, "Unable to create entry ");
    return res.status(201).json(new ApiResponse(201, book, "book added"));
})

const deleteBook = asyncHandler(async (req, res) => {
    const { book_id } = req.params;
    const { id, title } = req.body;
    if (!id && !book_id && !title) {
        throw new ApiError(401, "id not found");
    }
    const seller = req.seller;
    let book;
    const ids = id || book_id;
    if (ids) {
        book = await Book.findByPk(ids, {
            include: Seller
        })
    }
    if (!book && title) {
        book = await Book.findOne({
            where: {
                title: title
            },
            include: Seller
        })
    }
    if (!book) {
        throw new ApiError(401, "Book not found");
    }
    if (book.seller_id != seller.id) {
        throw new ApiError(401, "cannot delete because of unauthorized request");
    }
    await book.destroy();
    return res.status(201).json(new ApiResponse(201, {}, "book deleted"));
})

export {
    findAllBooks,
    findBook,
    updateBookDetails,
    addBook,
    deleteBook
}