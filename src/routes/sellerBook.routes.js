import { Router } from "express";
import { addBook, deleteBook, findAllBooks, findBook, updateBookDetails } from "../controllers/book.controller.js";
import { verifySellerJWT } from "../middlewares/seller.auth.middleware.js";

const router= Router();
router.use(verifySellerJWT);
router.route('/').get(findAllBooks);
router.route('/find').post(findBook);
router.route('/find/:book_id').post(findBook);
router.route('/update-book-details').post(updateBookDetails);
router.route('/update-book-details:book_id').post(updateBookDetails);
router.route('/').post(addBook);
router.route('/delete/:book_id').post(deleteBook);
router.route('/delete').post(deleteBook);

export default router;