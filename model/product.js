const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    review: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const productScheme = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    images: {
        type: [String],
        required: [true, "Images is required"]
    },
    colors: {
        type: [String],
    },
    rating: {
        type: Number,
    }, 
    reviews: {
        type: [reviewSchema]
    }
}, {timestamps: true})


const Product = mongoose.model('product', productScheme)
module.exports = Product  