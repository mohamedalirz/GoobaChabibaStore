const mongoose = require('mongoose')
const Counter = require('./Counter')

const variantSchema = new mongoose.Schema({
    size: { type: String, required: true },
    color: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    sku: { type: String }
})

const productSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    category: { type: String, required: true },
    isLimited: { type: Boolean, default: false },
    images: [{ type: String }],
    defaultImage: { type: String },
    variants: [variantSchema]
}, { timestamps: true })

productSchema.pre('save', async function() {
    try {
        if (this.isNew) {
            console.log('Generating ID for new product...')
            const counter = await Counter.findOneAndUpdate(
                { model: 'Product' },
                { $inc: { seq: 1 } },
                { 
                    upsert: true, 
                    new: true,
                    setDefaultsOnInsert: true 
                }
            )
            this.id = counter.seq
            console.log(`Product ID generated: ${this.id}`)
        }
    } catch (error) {
        console.error('Error in product pre-save hook:', error)
        throw error
    }
})

module.exports = mongoose.model('Product', productSchema)