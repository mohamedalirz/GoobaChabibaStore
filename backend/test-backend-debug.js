const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const API_URL = 'http://localhost:3636';
let adminToken = '';
let clientTokens = [];
let testProducts = [];
let testCarts = [];
let testOrdersList = []; // Renamed from testOrders to avoid conflict

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

const log = {
    info: (msg) => console.log(`${colors.cyan}[INFO]${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}[✓]${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}[⚠]${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}[✗]${colors.reset} ${msg}`),
    test: (msg) => console.log(`\n${colors.magenta}${msg}${colors.reset}`),
    result: (msg) => console.log(`${colors.bright}${msg}${colors.reset}`)
};

// Test configuration
const CONFIG = {
    NUM_CLIENTS: 3,
    NUM_PRODUCTS_PER_CATEGORY: 2,
    MAX_QUANTITY_PER_ITEM: 3,
    CONCURRENT_REQUESTS: 5
};

// Product categories
const PRODUCT_TEMPLATES = [
    {
        category: "Hoodies",
        baseNames: ["Classic", "Zip-Up"],
        sizes: ["S", "M", "L"],
        colors: ["Black", "Gray"],
        basePrice: { min: 39.99, max: 59.99 }
    },
    {
        category: "T-Shirts",
        baseNames: ["Crew Neck", "V-Neck"],
        sizes: ["S", "M", "L"],
        colors: ["White", "Black"],
        basePrice: { min: 19.99, max: 29.99 }
    },
    {
        category: "Caps",
        baseNames: ["Snapback", "Dad Hat"],
        sizes: ["Adjustable"],
        colors: ["Black", "Red"],
        basePrice: { min: 24.99, max: 34.99 }
    }
];

// Helper function to generate random products
const generateProducts = () => {
    const products = [];
    PRODUCT_TEMPLATES.forEach(template => {
        for (let i = 0; i < CONFIG.NUM_PRODUCTS_PER_CATEGORY; i++) {
            const name = `${template.baseNames[i % template.baseNames.length]} ${template.category}`;
            const variants = [];
            
            template.sizes.forEach(size => {
                template.colors.forEach(color => {
                    variants.push({
                        size,
                        color,
                        stock: Math.floor(Math.random() * 20) + 5,
                        sku: `${template.category.substring(0,3)}-${size}-${color}-${Date.now()}`
                    });
                });
            });
            
            products.push({
                name,
                description: `High-quality ${template.category.toLowerCase()}`,
                basePrice: Number((Math.random() * (template.basePrice.max - template.basePrice.min) + template.basePrice.min).toFixed(2)),
                category: template.category,
                isLimited: Math.random() > 0.7,
                images: [`https://example.com/${template.category.toLowerCase()}.jpg`],
                defaultImage: `https://example.com/${template.category.toLowerCase()}.jpg`,
                variants
            });
        }
    });
    return products;
};

// Initialize admin
const initializeAdmin = async () => {
    log.test('🔐 INITIALIZING ADMIN');
    
    try {
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: 'admin@example.com',
            password: 'admin123'
        });
        
        adminToken = loginRes.data.token;
        log.success('Admin login successful');
        log.info(`Admin role: ${loginRes.data.user.role}`);
        return true;
        
    } catch (error) {
        log.error(`Admin login failed: ${error.response?.data?.message || error.message}`);
        
        try {
            log.info('Attempting to register admin...');
            await axios.post(`${API_URL}/register`, {
                username: 'admin',
                email: 'admin@example.com',
                password: 'admin123'
            });
            log.success('Admin registered successfully');
            
            const loginRes = await axios.post(`${API_URL}/login`, {
                email: 'admin@example.com',
                password: 'admin123'
            });
            adminToken = loginRes.data.token;
            log.success('Admin login successful after registration');
            return true;
            
        } catch (regError) {
            log.error(`Admin registration failed: ${regError.response?.data?.message || regError.message}`);
            return false;
        }
    }
};

// Test 1: Authentication Test
const testAuthentication = async () => {
    log.test('📝 TEST 1: AUTHENTICATION TEST');
    
    const results = {
        registrations: 0,
        logins: 0,
        failures: 0
    };
    
    for (let i = 0; i < CONFIG.NUM_CLIENTS; i++) {
        try {
            const client = {
                username: `client_${i}`,
                email: `client${i}@test.com`,
                password: 'password123'
            };
            
            await axios.post(`${API_URL}/register`, client);
            results.registrations++;
            clientTokens.push({ ...client, token: null });
            log.success(`Registered client ${i}`);
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.message === "User already exists") {
                log.warn(`Client ${i} already exists`);
                clientTokens.push({
                    username: `client_${i}`,
                    email: `client${i}@test.com`,
                    password: 'password123',
                    token: null
                });
            } else {
                results.failures++;
                log.error(`Client ${i} registration failed: ${error.response?.data?.message || error.message}`);
            }
        }
    }
    
    for (let i = 0; i < clientTokens.length; i++) {
        try {
            const loginRes = await axios.post(`${API_URL}/login`, {
                email: clientTokens[i].email,
                password: clientTokens[i].password
            });
            clientTokens[i].token = loginRes.data.token;
            results.logins++;
            log.success(`Client ${i} logged in`);
        } catch (error) {
            results.failures++;
            log.error(`Client ${i} login failed: ${error.response?.data?.message || error.message}`);
        }
    }
    
    log.result(`\n📊 Auth Results:
    - Registrations: ${results.registrations}
    - Logins: ${results.logins}
    - Failures: ${results.failures}`);
    
    return results;
};

// Test 2: Product Management Test
const testProductManagement = async () => {
    log.test('\n📦 TEST 2: PRODUCT MANAGEMENT');
    
    const results = {
        created: 0,
        read: 0,
        failures: 0
    };
    
    const productsToCreate = generateProducts();
    log.info(`Creating ${productsToCreate.length} products...`);
    
    for (const product of productsToCreate) {
        try {
            const res = await axios.post(
                `${API_URL}/admin/products`,
                product,
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            
            testProducts.push(res.data);
            results.created++;
            log.success(`Created: ${res.data.name} (ID: ${res.data.id})`);
        } catch (error) {
            results.failures++;
            log.error(`Failed to create product: ${error.response?.data?.message || error.message}`);
        }
    }
    
    try {
        const products = await axios.get(`${API_URL}/products`);
        results.read = products.data.length;
        log.success(`Retrieved ${products.data.length} products`);
    } catch (error) {
        results.failures++;
        log.error(`Failed to read products: ${error.message}`);
    }
    
    log.result(`\n📊 Product Results:
    - Created: ${results.created}
    - Total in DB: ${results.read}
    - Failures: ${results.failures}`);
    
    return results;
};

// Test 3: Shopping Cart Test
const testShoppingCart = async () => {
    log.test('\n🛒 TEST 3: SHOPPING CART');
    
    const results = {
        itemsAdded: 0,
        cartsRetrieved: 0,
        failures: 0
    };
    
    if (testProducts.length === 0) {
        log.warn('No products available for cart testing');
        return results;
    }
    
    for (let i = 0; i < clientTokens.length; i++) {
        const userId = 1000 + i;
        
        for (let j = 0; j < 2; j++) {
            const product = testProducts[j % testProducts.length];
            if (product.variants.length > 0) {
                const variant = product.variants[0];
                
                try {
                    await axios.post(`${API_URL}/cart`, {
                        productId: product.id,
                        userId,
                        quantity: 1,
                        size: variant.size,
                        color: variant.color
                    });
                    results.itemsAdded++;
                    log.success(`User ${i} added item to cart`);
                } catch (error) {
                    results.failures++;
                    log.error(`Cart add failed: ${error.response?.data?.message || error.message}`);
                }
            }
        }
        
        try {
            const cartRes = await axios.get(`${API_URL}/cart/${userId}`);
            results.cartsRetrieved++;
            testCarts.push({ userId, cart: cartRes.data });
            log.success(`Retrieved cart for user ${i}`);
        } catch (error) {
            if (error.response?.status !== 404) {
                results.failures++;
                log.error(`Cart retrieval failed: ${error.message}`);
            }
        }
    }
    
    log.result(`\n📊 Cart Results:
    - Items added: ${results.itemsAdded}
    - Carts retrieved: ${results.cartsRetrieved}
    - Failures: ${results.failures}`);
    
    return results;
};

// Test 4: Orders Test
const testOrders = async () => {
    log.test('\n💰 TEST 4: ORDERS');
    
    const results = {
        ordersPlaced: 0,
        ordersRetrieved: 0,
        failures: 0,
        totalRevenue: 0
    };
    
    for (const cart of testCarts) {
        const cartData = cart.cart.items || cart.cart;
        if (cartData && cartData.length > 0) {
            const items = cartData.map(item => ({
                productId: item.product.id,
                name: item.product.name,
                price: item.product.price,
                size: item.size,
                color: item.color,
                quantity: item.quantity
            }));
            
            const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            try {
                const orderRes = await axios.post(`${API_URL}/orders/${cart.userId}`, {
                    userId: cart.userId,
                    name: `User ${cart.userId}`,
                    address: "123 Test St",
                    city: "Test City",
                    phone: "555-1234",
                    items,
                    totalAmount,
                    status: "pending"
                });
                
                results.ordersPlaced++;
                results.totalRevenue += totalAmount;
                testOrdersList.push(orderRes.data); // Using renamed variable
                log.success(`Order placed: $${totalAmount.toFixed(2)}`);
            } catch (error) {
                results.failures++;
                log.error(`Order failed: ${error.response?.data?.message || error.message}`);
            }
        }
    }
    
    try {
        const orders = await axios.get(`${API_URL}/orders`);
        results.ordersRetrieved = orders.data.length;
        log.success(`Retrieved ${orders.data.length} orders`);
    } catch (error) {
        results.failures++;
        log.error(`Failed to get orders: ${error.message}`);
    }
    
    log.result(`\n📊 Order Results:
    - Orders placed: ${results.ordersPlaced}
    - Total revenue: $${results.totalRevenue.toFixed(2)}
    - Failures: ${results.failures}`);
    
    return results;
};

// Test 5: Admin Features Test
const testAdminFeatures = async () => {
    log.test('\n👑 TEST 5: ADMIN FEATURES');
    
    const results = {
        statsRetrieved: 0,
        usersRetrieved: 0,
        failures: 0
    };
    
    try {
        const stats = await axios.get(
            `${API_URL}/admin/stats`,
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        results.statsRetrieved = 1;
        log.success('Admin stats retrieved');
        log.info(`Stats: ${JSON.stringify(stats.data)}`);
    } catch (error) {
        results.failures++;
        log.error(`Failed to get admin stats: ${error.response?.data?.message || error.message}`);
    }
    
    try {
        const users = await axios.get(`${API_URL}/users`);
        results.usersRetrieved = users.data.length;
        log.success(`Retrieved ${users.data.length} users`);
    } catch (error) {
        results.failures++;
        log.error(`Failed to get users: ${error.message}`);
    }
    
    log.result(`\n📊 Admin Results:
    - Stats retrieved: ${results.statsRetrieved}
    - Users retrieved: ${results.usersRetrieved}
    - Failures: ${results.failures}`);
    
    return results;
};

// Test 6: Cleanup
const testCleanup = async () => {
    log.test('\n🧹 TEST 6: CLEANUP');
    
    const results = {
        cartsDeleted: 0,
        productsDeleted: 0,
        failures: 0
    };
    
    for (const cart of testCarts) {
        try {
            await axios.delete(`${API_URL}/deleteCart/${cart.userId}`);
            results.cartsDeleted++;
            log.success(`Deleted cart for user ${cart.userId}`);
        } catch (error) {
            if (error.response?.status !== 404) {
                results.failures++;
                log.error(`Cart deletion failed: ${error.message}`);
            }
        }
    }
    
    for (const product of testProducts) {
        try {
            await axios.delete(
                `${API_URL}/admin/products/${product.id}`,
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            results.productsDeleted++;
            log.success(`Deleted product ${product.id}`);
        } catch (error) {
            results.failures++;
            log.error(`Product deletion failed: ${error.message}`);
        }
    }
    
    log.result(`\n📊 Cleanup Results:
    - Carts deleted: ${results.cartsDeleted}
    - Products deleted: ${results.productsDeleted}
    - Failures: ${results.failures}`);
    
    return results;
};

// Main test runner
const runTests = async () => {
    console.log('\n' + '='.repeat(70));
    console.log(`${colors.bright}🚀 E-COMMERCE BACKEND TEST SUITE${colors.reset}`);
    console.log('='.repeat(70));
    
    console.log(`\n${colors.cyan}Test Configuration:${colors.reset}`);
    console.log(`- Concurrent clients: ${CONFIG.NUM_CLIENTS}`);
    console.log(`- Products per category: ${CONFIG.NUM_PRODUCTS_PER_CATEGORY}`);
    console.log(`- Concurrent requests: ${CONFIG.CONCURRENT_REQUESTS}`);
    
    const adminInitialized = await initializeAdmin();
    if (!adminInitialized) {
        log.error('Cannot proceed without admin authentication!');
        process.exit(1);
    }
    
    const startTime = Date.now();
    
    const results = {
        auth: await testAuthentication(),
        products: await testProductManagement(),
        cart: await testShoppingCart(),
        orders: await testOrders(),
        admin: await testAdminFeatures(),
        cleanup: await testCleanup()
    };
    
    const totalTime = (Date.now() - startTime) / 1000;
    
    console.log('\n' + '='.repeat(70));
    console.log(`${colors.bright}📊 FINAL TEST SUMMARY${colors.reset}`);
    console.log('='.repeat(70));
    
    const totalSuccess = 
        results.auth.logins +
        results.products.created +
        results.cart.itemsAdded +
        results.orders.ordersPlaced +
        results.admin.statsRetrieved +
        results.cleanup.productsDeleted;
    
    const totalFailures = 
        results.auth.failures +
        results.products.failures +
        results.cart.failures +
        results.orders.failures +
        results.admin.failures +
        results.cleanup.failures;
    
    console.log(`\n${colors.green}✅ Total successful operations: ${totalSuccess}${colors.reset}`);
    console.log(`${colors.red}❌ Total failures: ${totalFailures}${colors.reset}`);
    console.log(`${colors.yellow}⏱️  Total test duration: ${totalTime.toFixed(2)} seconds${colors.reset}`);
    
    if (totalFailures === 0) {
        console.log(`\n${colors.green}${colors.bright}🎉 ALL TESTS PASSED! BACKEND IS READY FOR PRODUCTION!${colors.reset}`);
    } else {
        console.log(`\n${colors.yellow}⚠️  Some tests failed. Check the logs above for details.${colors.reset}`);
    }
    
    console.log('\n' + '='.repeat(70));
};

runTests().catch(console.error);