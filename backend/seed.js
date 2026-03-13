const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Counter = require('./models/Counter');
const bcrypt = require('bcrypt');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Counter.deleteMany({});

        console.log('Old data cleared');

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new User({
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });
        await admin.save();
        console.log('✅ Admin created with ID:', admin.id);

        // Create client user
        const clientPassword = await bcrypt.hash('client123', 10);
        const client = new User({
            username: 'client',
            email: 'client@example.com',
            password: clientPassword,
            role: 'client'
        });
        await client.save();
        console.log('✅ Client created with ID:', client.id);

        // Create products with variants
        const products = [
            {
                name: "Classic Hoodie",
                description: "Comfortable cotton hoodie",
                basePrice: 39.99,
                category: "Hoodies",
                isLimited: false,
                images: ["https://example.com/hoodie.jpg"],
                defaultImage: "https://example.com/hoodie.jpg",
                variants: [
                    { size: "S", color: "Black", stock: 10 },
                    { size: "S", color: "Gray", stock: 8 },
                    { size: "M", color: "Black", stock: 15 },
                    { size: "M", color: "Gray", stock: 12 },
                    { size: "L", color: "Black", stock: 5 },
                    { size: "L", color: "Gray", stock: 7 }
                ]
            },
            {
                name: "Graphic T-Shirt",
                description: "Printed cotton t-shirt",
                basePrice: 19.99,
                category: "T-Shirts",
                isLimited: false,
                images: ["https://example.com/tshirt.jpg"],
                defaultImage: "https://example.com/tshirt.jpg",
                variants: [
                    { size: "S", color: "White", stock: 20 },
                    { size: "S", color: "Blue", stock: 15 },
                    { size: "M", color: "White", stock: 25 },
                    { size: "M", color: "Blue", stock: 18 },
                    { size: "L", color: "White", stock: 10 },
                    { size: "L", color: "Blue", stock: 12 }
                ]
            },
            {
                name: "Snapback Cap",
                description: "Adjustable baseball cap",
                basePrice: 24.99,
                category: "Caps",
                isLimited: false,
                images: ["https://example.com/cap.jpg"],
                defaultImage: "https://example.com/cap.jpg",
                variants: [
                    { size: "Adjustable", color: "Black", stock: 30 },
                    { size: "Adjustable", color: "Red", stock: 22 },
                    { size: "Adjustable", color: "Navy", stock: 18 }
                ]
            }
        ];

        for (let prod of products) {
            const product = new Product(prod);
            await product.save();
            console.log(`✅ Product created: ${product.name} (ID: ${product.id})`);
        }

        console.log('\n🎉 Data seeded successfully!');
        console.log(`📊 Statistics:`);
        console.log(`- Users: ${await User.countDocuments()}`);
        console.log(`- Products: ${await Product.countDocuments()}`);
        console.log(`- Counters: ${await Counter.countDocuments()}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedData();