import { Router } from "express";
import { addBook, deleteBook, findAllBooks, findBook, updateBookDetails } from "../controllers/book.controller.js";
import { verifyUserJWT } from "../middlewares/user.auth.middleware.js";

const router= Router();

router.use(verifyUserJWT);

router.route('/').get(findAllBooks);
router.route('/find').post(findBook);
router.route('/find/:book_id').post(findBook);

export default router;