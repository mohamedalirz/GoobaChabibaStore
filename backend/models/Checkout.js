const mongoose = require('mongoose')
const Counter = require('./Counter')

const checkoutSchema = new mongoose.Schema({
    checkOutId: { type: Number, unique: true },
    cart: Array,
    totalAmount: Number,
    userId: { type: Number, required: true }
}, { timestamps: true })

checkoutSchema.pre('save', async function() {
    try {
        if (this.isNew) {
            console.log('Generating ID for new checkout...')
            const counter = await Counter.findOneAndUpdate(
                { model: 'Checkout' },
                { $inc: { seq: 1 } },
                { 
                    upsert: true, 
                    new: true,
                    setDefaultsOnInsert: true 
                }
            )
            this.checkOutId = counter.seq
            console.log(`Checkout ID generated: ${this.checkOutId}`)
        }
    } catch (error) {
        console.error('Error in checkout pre-save hook:', error)
        throw error
    }
})

module.exports = mongoose.model('Checkout', checkoutSchema)