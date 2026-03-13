const mongoose = require('mongoose')
const Counter = require('./Counter')

const orderItemSchema = new mongoose.Schema({
    productId: Number,
    name: String,
    price: Number,
    size: String,
    color: String,
    quantity: Number
})

const orderSchema = new mongoose.Schema({
    idOrder: { type: Number, unique: true },
    userId: { type: Number, required: true },
    name: String,
    address: String,
    city: String,
    phone: String,
    items: [orderItemSchema],
    totalAmount: Number,
    status: { type: String, enum: ['pending', 'sold', 'cancelled'], default: 'pending' }
}, { timestamps: true })

orderSchema.pre('save', async function() {
    try {
        if (this.isNew) {
            console.log('Generating ID for new order...')
            const counter = await Counter.findOneAndUpdate(
                { model: 'Order' },
                { $inc: { seq: 1 } },
                { 
                    upsert: true, 
                    new: true,
                    setDefaultsOnInsert: true 
                }
            )
            this.idOrder = counter.seq
            console.log(`Order ID generated: ${this.idOrder}`)
        }
    } catch (error) {
        console.error('Error in order pre-save hook:', error)
        throw error
    }
})

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema)