const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true,
    },
    slug: {
        type: String,
        index: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);