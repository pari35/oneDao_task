import express from "express"
import {registerUser, loginUser, verifyOtp} from "../controllers/userController.js"

const router = express.Router()
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verifyOtp").post(verifyOtp);

export default router
