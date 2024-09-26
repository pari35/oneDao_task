import Product from "../models/productModel.js"
import ErrorHandler from "../utils/errorHandler.js"
import catchAsyncError from "../middleware/catchAsycError.js"
import ApiFeatures from "../utils/apiFeature.js"


const createProduct = catchAsyncError(async (req, res, next) => {
    req.body.user = req.user.id
    const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        product
    })
})

// get all products
const getAllProducts = catchAsyncError(async (req, res) => {
    const resultPerPage = 5
    const productCount = await Product.countDocuments()

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)
    const products = await apiFeature.query

    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage
    })
})

//update product admin
const updateProduct = catchAsyncError(async (req, res) => {
    let product = await Product.findById(req.params.id)
    if (!product) {
        return res.status(500).json({
            success: "false",
            message: "Product not found"
        })
    }
    product = await Product.findByIdAndUpdate({_id:req.params.id}, req.body)
    res.status(200).json({
        success: "true",
        product
    })
})

// delete products
const deleteProducts = catchAsyncError(async (req, res, next) => {
    let product = Product.findById(req.params.id)
    if (!product) {
        return res.status(500).json({
            success: "false",
            message: "Product not found"
        })
    }
    await product.deleteOne()
    res.status(200).json({
        success: "true",
        message: "Product deleted succesfully"
    })
})

// get product details
const getProductDetails = catchAsyncError(
    async (req, res, next) => {
        let product = await Product.findById(req.params.id)
        if (!product) {
            return next(new ErrorHandler("Product not found", 404))
        }
        res.status(200).json({
            success: "true",
            product
        })
    }
)

export {
    getProductDetails,
    deleteProducts,
    updateProduct,
    getAllProducts,
    createProduct
}