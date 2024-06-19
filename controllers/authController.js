const jwt = require('jsonwebtoken')
const GlobalError = require('../errors/GlobalError')
const User = require('../model/user')
const { asyncCatch } = require('../utils/asyncCatch')
const sendEmail = require('../utils/email')
const crypto = require('crypto')

const signToken = (id) => {
    const token = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "10d" })
    return token
}

exports.signup = asyncCatch(async (req, res, next) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) return next(new GlobalError("Enter all credentials", 404))
    const user = await User.create({ name, email, password })
    res.json({
        success: true,
        user
    })
    // sendEmail({ to: email, subject: "Welcome", name }, "welcome")
})


exports.login = asyncCatch(async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email: email }).select("-__v")
    if (!user) return next(new GlobalError("Not exist user", 404))
    const isValid = await user.checkPasswords(password)
    if (!isValid) return next(new GlobalError("Not exist password", 404))
    const token = signToken(user._id)
    res
        .cookie("token", token, { sameSite: 'none', httpOnly: true, secure: true })
        .json({
            success: true,
            token,
            user
        })
})

exports.resetPassword = asyncCatch(async (req, res, next) => {
    const { email } = req.body
    const user = await User.findOne({ email: email })
    if (!user) return next(new GlobalError("Not valid email", 404))
    const token = await user.resetTokenHandler()
    const url = `https://shipshops.vercel.app/change/${token}`
    sendEmail({ to: email, subject: "Reset Password", url }, "reset")
    res.json({
        success: true,
        message: "Email sent!",
        user,
        token
    })
})

exports.changePassword = asyncCatch(async (req, res, next) => {
    const { resetToken } = req.params
    const { password } = req.body
    if (!resetToken) return next(new GlobalError("Token is not valid", 401))
    if (!password) return next(new GlobalError("Enter all credentials", 401))
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const user = await User.findOne({ resetToken: hashedToken });
    if (!user) return next(new GlobalError("Token is not valid", 401))
    if (user.resetTime < Date.now()) return next(new GlobalError("Token was expired", 401))
    user.resetToken = undefined;
    user.password = password;
    await user.save()
    const token = signToken(user._id)
    res.json({
        success: true,
        message: "Password was changed",
        token
    })
})

exports.logout = async (req, res) => {
    const user = await User.findOne({ _id: req.body.id });
    if (!user) return next(new GlobalError("User not found", 401))
    await user.cartAndFavoriteHandler(req.body.cart, req.body.favorite)
    res.clearCookie('token', { sameSite: 'none', httpOnly: true, secure: true }).json({
        success: true,
        message: "Logouted successfully",
        user
    })
}

exports.verify = (req, res, next) => {
    const { token } = req.cookies
    if (!token) return next(new GlobalError("Access is denied", 401))
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        res.json({
            success: true,
            message: "Logged successfully",
            user: decoded
        })
    } catch (error) {
        res.status(401).clearCookie('token').json({ success: false })
    }
}


// update user information
exports.updatePassword = async (req, res, next) => {
    const { currentPass, newPass, confirmPass, id } = req.body
    if (!currentPass || !newPass || !confirmPass || !id) return next(new GlobalError("Enter all credentials", 404))
    const user = await User.findOne({ _id: id })
    if (!user) return next(new GlobalError("Credential problem", 404))
    const isSame = await user.checkPasswords(currentPass)
    if (!isSame) return next(new GlobalError("Not Same Password", 404))
    user.password = newPass;
    await user.save()
    res.json({
        success: true,
        user
    })
}

exports.updateInfo = async (req, res, next) => {
    const { name, email, birthday, id } = req.body
    if (!name || !email || !id) return next(new GlobalError("Enter all credentials", 404))
    const user = await User.findOne({ _id: id })
    if (!user) return next(new GlobalError("Credential problem", 404))
    await user.updateUser(birthday, email, name)
    res.json({
        success: true,
        user
    })
}