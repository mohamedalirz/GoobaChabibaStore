const Cart = require('../models/Cart')
const Product = require('../models/Product')

const addToCart = async (req, res) => {
    try {
        const { productId, userId, quantity, size, color } = req.body

        if (!productId || !userId || !quantity || !size || !color) {
            return res.status(400).json({ 
                message: "Missing required fields: productId, userId, quantity, size, color" 
            })
        }

        const product = await Product.findOne({ id: productId })
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        const variant = product.variants.find(v => v.size === size && v.color === color)
        if (!variant) {
            return res.status(400).json({ 
                message: "Variant not found",
                availableVariants: product.variants.map(v => ({ size: v.size, color: v.color, stock: v.stock }))
            })
        }

        if (variant.stock < quantity) {
            return res.status(400).json({ 
                message: "Not enough stock available",
                availableStock: variant.stock,
                requestedQuantity: quantity
            })
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId })
        if (!cart) {
            cart = new Cart({ userId, items: [] })
        }

        // Check if same variant already in cart
        const existingItemIndex = cart.items.findIndex(item => 
            item.productId === productId && 
            item.size === size && 
            item.color === color
        )

        if (existingItemIndex > -1) {
            // Check if new total quantity exceeds stock
            const newQuantity = cart.items[existingItemIndex].quantity + quantity
            if (variant.stock < newQuantity) {
                return res.status(400).json({ 
                    message: "Total quantity would exceed available stock",
                    availableStock: variant.stock,
                    currentInCart: cart.items[existingItemIndex].quantity,
                    requestedAdditional: quantity
                })
            }
            cart.items[existingItemIndex].quantity = newQuantity
        } else {
            // Add new item with product snapshot
            cart.items.push({
                productId,
                size,
                color,
                quantity,
                productSnapshot: {
                    name: product.name,
                    price: product.basePrice,
                    image: product.defaultImage || (product.images && product.images[0])
                }
            })
        }

        cart.updatedAt = Date.now()
        await cart.save()

        res.status(201).json({ 
            message: "Product added to cart successfully",
            cart: {
                userId: cart.userId,
                itemCount: cart.items.length,
                total: cart.calculateTotal()
            }
        })

    } catch (error) {
        console.error('Add to cart error:', error)
        res.status(500).json({ message: error.message })
    }
}

const getUserCart = async (req, res) => {
    try {
        const userId = Number(req.params.userId)
        
        const cart = await Cart.findOne({ userId })
        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ message: "Cart is empty or not found" })
        }

        // Get current product data to verify stock and prices
        const productIds = [...new Set(cart.items.map(item => item.productId))]
        const products = await Product.find({ id: { $in: productIds } })

        // Enrich cart items with current product data
        const enrichedItems = cart.items.map(item => {
            const product = products.find(p => p.id === item.productId)
            if (!product) return null

            const variant = product.variants.find(v => 
                v.size === item.size && v.color === item.color
            )

            return {
                cartItemId: item._id,
                product: {
                    id: product.id,
                    name: product.name,
                    price: product.basePrice,
                    image: product.defaultImage || (product.images && product.images[0]),
                    category: product.category
                },
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                stockAvailable: variant ? variant.stock : 0,
                subtotal: product.basePrice * item.quantity,
                addedAt: item.addedAt
            }
        }).filter(item => item !== null)

        res.json({
            userId: cart.userId,
            items: enrichedItems,
            totalItems: enrichedItems.reduce((sum, item) => sum + item.quantity, 0),
            totalAmount: enrichedItems.reduce((sum, item) => sum + item.subtotal, 0),
            lastUpdated: cart.updatedAt
        })

    } catch (error) {
        console.error('Get cart error:', error)
        res.status(500).json({ message: error.message })
    }
}

const updateCartItem = async (req, res) => {
    try {
        const { userId, productId, size, color, quantity } = req.body

        const cart = await Cart.findOne({ userId })
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" })
        }

        const itemIndex = cart.items.findIndex(item => 
            item.productId === productId && 
            item.size === size && 
            item.color === color
        )

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" })
        }

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1)
        } else {
            const product = await Product.findOne({ id: productId })
            if (product) {
                const variant = product.variants.find(v => 
                    v.size === size && v.color === color
                )
                if (variant && variant.stock < quantity) {
                    return res.status(400).json({ 
                        message: "Not enough stock available",
                        availableStock: variant.stock
                    })
                }
            }
            cart.items[itemIndex].quantity = quantity
        }

        cart.updatedAt = Date.now()
        await cart.save()

        res.json({ 
            message: "Cart updated successfully",
            cart: {
                userId: cart.userId,
                itemCount: cart.items.length,
                total: cart.calculateTotal()
            }
        })

    } catch (error) {
        console.error('Update cart error:', error)
        res.status(500).json({ message: error.message })
    }
}

const deleteCart = async (req, res) => {
    try {
        const userId = Number(req.params.id)
        const result = await Cart.findOneAndDelete({ userId })
        
        if (!result) {
            return res.status(404).json({ message: "Cart not found" })
        }
        
        res.json({ 
            message: "Cart deleted successfully",
            deletedCart: {
                userId: result.userId,
                itemCount: result.items.length
            }
        })

    } catch (error) {
        console.error('Delete cart error:', error)
        res.status(500).json({ message: error.message })
    }
}

const clearCart = async (req, res) => {
    try {
        const userId = Number(req.params.userId)
        const cart = await Cart.findOne({ userId })
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" })
        }

        cart.items = []
        cart.updatedAt = Date.now()
        await cart.save()

        res.json({ message: "Cart cleared successfully" })

    } catch (error) {
        console.error('Clear cart error:', error)
        res.status(500).json({ message: error.message })
    }
}

module.exports = { 
    addToCart, 
    getUserCart, 
    updateCartItem,
    deleteCart,
    clearCart 
}