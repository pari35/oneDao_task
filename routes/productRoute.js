import {getAllProducts, createProduct, updateProduct, deleteProducts, getProductDetails } from "../controllers/productController.js"
import express from "express"
import {isAuthenticatedUser} from "../middleware/auth.js"

const router = express.Router()
router.route("/products").get(getAllProducts);
router.route("/products/new").post(isAuthenticatedUser, createProduct);
router.route("/products/:id").put(isAuthenticatedUser, updateProduct).delete(isAuthenticatedUser, deleteProducts);
router.route("/product/:id").get(getProductDetails);
export  default  router
