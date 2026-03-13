const User = require('../models/User')
const Product = require('../models/Product')
const Order = require('../models/Orders')

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments()
        const totalProducts = await Product.countDocuments()
        const totalOrders = await Order.countDocuments()
        const revenue = await Order.aggregate([
            { $match: { status: 'sold' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ])
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5)
        const lowStockProducts = await Product.find({ 'variants.stock': { $lt: 5 } }).limit(5)

        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            revenue: revenue[0]?.total || 0,
            recentOrders,
            lowStockProducts
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getDashboardStats }