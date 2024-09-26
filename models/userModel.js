import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    otp: {
        type: Number,
        select: false,
    },
    isVerified: {
        type: String,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

// jwt token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, 'lksdjfyusbj', {
        expiresIn: '100000000'
    })
}

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}

// generating password reset token
userSchema.methods.getResetPasswordToken = function () {
    // generating token 
    const resetToken = crypto.randomBytes(20).toString("hex")
    // hashing and adding reset token to user schema
    this.resetPasswordToken = crypto.createHash("sha256")
        .update(resetToken).digest("hex")

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000
    return resetToken
}

export default mongoose.model("UserDao", userSchema);