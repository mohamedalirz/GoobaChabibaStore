const Product = require('../models/Product')

// Client : get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ id: 1 })
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Client : get categories
const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category')
        res.json(['All', ...categories])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin: create product
const createProduct = async (req, res) => {
    try {
        const { name, description, basePrice, category, isLimited, images, defaultImage, variants } = req.body
        const product = new Product({
            name,
            description,
            basePrice,
            category,
            isLimited: isLimited || false,
            images: images || [],
            defaultImage: defaultImage || (images && images[0]),
            variants: variants || []
        })
        await product.save()
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin: update product
const updateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id)
        const updates = req.body
        const product = await Product.findOneAndUpdate(
            { id },
            { $set: updates },
            { new: true, runValidators: true }
        )
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin: delete product
const deleteProduct = async (req, res) => {
    try {
        const id = Number(req.params.id)
        const product = await Product.findOneAndDelete({ id })
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.json({ message: 'Product deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getProducts,
    getCategories,
    createProduct,
    updateProduct,
    deleteProduct
}