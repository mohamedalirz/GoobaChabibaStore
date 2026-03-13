const User = require('../models/User')

const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' })
        }

        // Check if user exists and has admin role
        const user = await User.findOne({ email: req.user.email })
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (user.role !== 'admin') {
            console.log(`Access denied for user ${user.email} with role ${user.role}`)
            return res.status(403).json({ message: 'Access denied. Admin only.' })
        }

        req.userData = user
        next()
    } catch (error) {
        console.error('Admin middleware error:', error)
        res.status(500).json({ message: error.message })
    }
}

const isClient = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' })
        }

        const user = await User.findOne({ email: req.user.email })
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (user.role !== 'client' && user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Client area.' })
        }

        req.userData = user
        next()
    } catch (error) {
        console.error('Client middleware error:', error)
        res.status(500).json({ message: error.message })
    }
}

module.exports = { isAdmin, isClient }