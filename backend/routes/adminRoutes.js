const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/authMiddleware')
const { isAdmin } = require('../middleware/roleMiddleware')
const {
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController')
const {
    updateOrderStatus
} = require('../controllers/orderController')
const {
    deleteUser,
    updateUserRole
} = require('../controllers/userController')
const {
    getDashboardStats
} = require('../controllers/adminController')

router.use(authenticateToken, isAdmin)

// Product management
router.post('/admin/products', createProduct)
router.put('/admin/products/:id', updateProduct)
router.delete('/admin/products/:id', deleteProduct)

// Order management
router.put('/admin/orders/:id/status', updateOrderStatus)

// User management
router.delete('/admin/users/:id', deleteUser)
router.put('/admin/users/:id/role', updateUserRole)

// Dashboard
router.get('/admin/stats', getDashboardStats)

module.exports = router