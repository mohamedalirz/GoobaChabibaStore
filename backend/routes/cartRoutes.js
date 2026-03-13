const express = require('express')
const router = express.Router()
const { 
    addToCart, 
    getUserCart, 
    updateCartItem,
    deleteCart,
    clearCart 
} = require('../controllers/cartController')

// Cart routes
router.post('/cart', addToCart)
router.get('/cart/:userId', getUserCart)
router.put('/cart', updateCartItem) 
router.delete('/deleteCart/:id', deleteCart)
router.delete('/cart/:userId/clear', clearCart) 

module.exports = router