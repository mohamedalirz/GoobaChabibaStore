const express = require('express')
const router = express.Router()
const {
    createCheckout,
    getUserCheckouts,
    deleteCheckout,
    createOrder,
    getOrders,
    updateOrder,
    getSales
} = require('../controllers/orderController')

router.post('/checkout', createCheckout)
router.get('/checkout/:userId', getUserCheckouts)
router.delete('/deleteCheckout/:id', deleteCheckout)
router.post('/orders/:userId', createOrder)
router.get('/orders', getOrders)
router.put('/updateOrder/:id', updateOrder)
router.get('/sales', getSales)

module.exports = router