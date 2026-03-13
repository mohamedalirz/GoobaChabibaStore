const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword, 
            role: "client" 
        })
        await newUser.save()

        res.status(201).json({ message: "User registered successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        // Include role and id in the token
        const token = jwt.sign(
            { 
                email: user.email, 
                id: user.id,
                role: user.role  
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: "100h" }
        )
        
        // Return user info along with token
        res.json({ 
            token, 
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email, 
                role: user.role 
            } 
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { register, login }