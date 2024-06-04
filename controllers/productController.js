const Product = require('../model/product')
const { asyncCatch } = require('../utils/asyncCatch')


exports.allProducts = asyncCatch(async (req, res) => {
    let products;
    if (Object.keys(req.query) !== 0) {
        products = await Product.find().limit(req.query.limit).sort(req.query.sort)
    } else {
        products = await Product.find()
    }
    res.json({
        success: true,
        products
    })
})

exports.categories = asyncCatch(async (req, res) => {
    const categories = await Product.aggregate([
        { $group: { _id: '$category' } }
    ])
    let cateroryArr = []
    categories.forEach((c) => {
        cateroryArr.push(c._id)
    })
    res.json({
        success: true,
        categories: cateroryArr
    })
})

exports.oneProduct = asyncCatch(async (req, res) => {
    const id = req.params.id
    const product = await Product.find({ _id: id })
    if (!product) {
        res.json({
            success: false,
            message: "This product doesn't exist"
        })
    }
    res.json({
        success: true,
        product: product[0]
    })
})

exports.addReview = asyncCatch(async (req, res) => {
    const { productId, userId, review } = req.body
    const product = await Product.findById(productId);
    product.reviews.push({ user_id: userId, review });
    await product.save();
    res.json({
        success: true,
        message: "Review added"
    })
})

