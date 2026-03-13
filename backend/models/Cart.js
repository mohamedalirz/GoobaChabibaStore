const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
    productId: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    // Store snapshot of product details at time of adding
    productSnapshot: {
        name: String,
        price: Number,
        image: String
    },
    addedAt: { type: Date, default: Date.now }
})

const cartSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true },
    items: [cartItemSchema],
    updatedAt: { type: Date, default: Date.now }
})

// Method to calculate cart total
cartSchema.methods.calculateTotal = function() {
    return this.items.reduce((total, item) => {
        return total + (item.productSnapshot.price * item.quantity)
    }, 0)
}

// Method to check if item exists in cart
cartSchema.methods.findItem = function(productId, size, color) {
    return this.items.find(item => 
        item.productId === productId && 
        item.size === size && 
        item.color === color
    )
}

module.exports = mongoose.model('Cart', cartSchema)