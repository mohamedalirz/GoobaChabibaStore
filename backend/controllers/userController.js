const User = require('../models/User')

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin: delete user
const deleteUser = async (req, res) => {
    try {
        const id = Number(req.params.id)
        const user = await User.findOneAndDelete({ id })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json({ message: 'User deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin: update user role
const updateUserRole = async (req, res) => {
    try {
        const id = Number(req.params.id)
        const { role } = req.body
        if (!['admin', 'client'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' })
        }
        const user = await User.findOneAndUpdate(
            { id },
            { $set: { role } },
            { new: true }
        ).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getUsers, deleteUser, updateUserRole }
