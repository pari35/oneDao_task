import ErrorHandler from "../utils/errorHandler.js"
import catchAsyncError from "../middleware/catchAsycError.js"
import User from "../models/userModel.js"
import sendToken from "../utils/jwttoken.js"
import sendEmail from "../utils/sendEmail.js"
import crypto from "crypto"
import joi from "joi"
import generateSixDigitOTP from "../utils/otp.js"

//register a user
const registerUser = catchAsyncError(async (req, res, next) => {
    const { email, password, confirmPassword } = req.body

    // check password and confirm password is same
    if (!(password == confirmPassword)) {
        return next(new ErrorHandler("password and confirm Password do not match", 400))
    }

    // check user entered all mandatory fields
    if (!email || !password || !confirmPassword) {
        return next(new ErrorHandler("please enter email and password and confirmPassword", 400))
    }

    // validate user input
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).alphanum().required(),
        confirmPassword: joi.string().min(4).alphanum().required(),
        Userotp: joi.string()
    })
    const { error, value } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: "Bad request", error })
    }

    // code to create OTP
    const otp = generateSixDigitOTP();
    console.log(otp);

    const message = `Thank you for registering with us Your OTP  :- ${otp} please enter to complete registration.`;
    try {
        await sendEmail({
            email: email,
            Subject: "OTP for registration",
            message
        })

        res.status(200).json({
            success: true,
            message: `OTP sent to ${email} successfully`
        })
    } catch (error) {
        return next(new ErrorHandler(error))

    }

    //and register user in DB
        const user = await User.create({
            email, password,otp ,isVerified : 0
        })
       
})

const loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body
    // checking if user has given password and email both 
    if (!email || !password) {
        return next(new ErrorHandler("please enter email and password", 400))
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("invalid email or password"), 401)
    }
    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password"), 401)
    }
    const token = user.getJWTToken();

    sendToken(user, 200, res)

})

//logout user
const verifyOtp = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email
    },{ otp: 1 })

    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }

    if(user.otp == req.body.otp){
        const updateUser =   await User.findByIdAndUpdate({_id:user.id}, {isVeified:1})
        res.status(200).json({
            success: true,
            message: "Registration is successfull"
        })
    }else{
        res.status(200).json({
            success: false,
            message: "Please enter correct OTP"
        })
    }
    
})

export {
    verifyOtp,
    loginUser,
    registerUser
}