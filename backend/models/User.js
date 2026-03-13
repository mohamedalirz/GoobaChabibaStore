const mongoose = require('mongoose')
const Counter = require('./Counter')

const userSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'client'], default: 'client' },
    createdAt: { type: Date, default: Date.now }
})

userSchema.pre('save', async function() {
    try {
        if (this.isNew) {
            console.log('Generating ID for new user...')
            const counter = await Counter.findOneAndUpdate(
                { model: 'User' },
                { $inc: { seq: 1 } },
                { 
                    upsert: true, 
                    new: true,
                    setDefaultsOnInsert: true 
                }
            )
            this.id = counter.seq
            console.log(`User ID generated: ${this.id}`)
        }
    } catch (error) {
        console.error('Error in user pre-save hook:', error)
        throw error // Re-throw to prevent save
    }
})

module.exports = mongoose.model('User', userSchema)