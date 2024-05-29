import { Router } from "express";
import { csvController, loginSeller, logoutSeller, registerSeller } from "../controllers/seller.controller.js";
import { verifySellerJWT } from "../middlewares/seller.auth.middleware.js";
const router = Router();
router.route('/register').post(registerSeller);
router.route('/login').post(loginSeller);
router.route('/logout').post(
    verifySellerJWT, logoutSeller);

router.route('/uploadCSV')
.post(
    verifySellerJWT,
    upload.single("bookcsv")
    ,csvController)
    
export default router;