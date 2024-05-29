import { Router } from "express";
import { addBook, findAllBooks, findBook, updateBookDetails } from "../controllers/book.controller.js";
import { verifySellerJWT } from "../middlewares/seller.auth.middleware.js";

const router= Router();

router.route('/').get(findAllBooks);
router.route('/find').post(findBook);
router.route('/find/:book_id').post(findBook);
router.route('/update-book-details').post( verifySellerJWT, updateBookDetails);
router.route('/update-book-details:book_id').post( verifySellerJWT, updateBookDetails);
router.route('/').post(verifySellerJWT,addBook);

export default router;