const Order = require('../models/Orders')
const Checkout = require('../models/Checkout')
const Cart = require('../models/Cart')
const Product = require('../models/Product')

const createCheckout = async (req, res) => {
    try {
        const { cart, totalAmount, userId } = req.body // checkOutId ignored, auto-generated
        const checkout = new Checkout({ cart, totalAmount, userId })
        await checkout.save()
        res.status(201).json({ message: "Checkout placed successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getUserCheckouts = async (req, res) => {
    try {
        const userId = Number(req.params.userId)
        const userCheckouts = await Checkout.find({ userId }).sort({ createdAt: -1 })
        if (userCheckouts.length === 0) {
            return res.status(404).json({ message: "Orders not found" })
        }
        res.json(userCheckouts)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteCheckout = async (req, res) => {
    try {
        const userId = Number(req.params.id)
        const result = await Checkout.findOneAndDelete({ userId })
        if (!result) {
            return res.status(404).json({ message: "Cart not found" })
        }
        res.json({ message: "Checkout deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createOrder = async (req, res) => {
    try {
        const { userId, name, address, city, phone, items, totalAmount, status } = req.body
        const order = new Order({
            userId,
            name,
            address,
            city,
            phone,
            items,
            totalAmount,
            status: status || 'pending'
        })
        await order.save()
        res.status(201).json({ message: "Order placed successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 })
        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateOrder = async (req, res) => {
    try {
        const id = Number(req.params.id)
        const updated = req.body
        const order = await Order.findOneAndUpdate(
            { idOrder: id },
            { $set: updated },
            { new: true }
        )
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }
        res.json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin: update order status only (or full update, but we'll keep it as status update)
const updateOrderStatus = async (req, res) => {
    try {
        const id = Number(req.params.id)
        const { status } = req.body
        if (!['pending', 'sold', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' })
        }
        const order = await Order.findOneAndUpdate(
            { idOrder: id },
            { $set: { status } },
            { new: true }
        )
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        res.json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getSales = async (req, res) => {
    try {
        const soldOrders = await Order.find({ status: "sold" })
        res.json(soldOrders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    createCheckout,
    getUserCheckouts,
    deleteCheckout,
    createOrder,
    getOrders,
    updateOrder,        
    updateOrderStatus,  
    getSales
}