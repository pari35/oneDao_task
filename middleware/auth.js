import catchAsycError from "./catchAsycError.js"
import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
import ErrorHandler from "../utils/errorHandler.js"

const isAuthenticatedUser = catchAsycError(async (req, res, next) => {
    const { token } = req.cookies;
    console.log("req.cookies", req.cookies)
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, 'lksdjfyusbj');

    req.user = await User.findById(decodedData.id);

    next();
});

export {
    isAuthenticatedUser
}