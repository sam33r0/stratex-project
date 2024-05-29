import { Router } from "express";
import { findAllBooks } from "../controllers/book.controller.js";

const router= Router();

router.route('/').get(findAllBooks);
router.route('/:book_id')
export default router;