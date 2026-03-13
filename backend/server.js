const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")

dotenv.config()
connectDB()

const app = express()

app.use(cors({ origin: "*" }))
app.use(express.json())

// Public routes
app.use('/', require('./routes/authRoutes'))
app.use('/', require('./routes/productRoutes'))
app.use('/', require('./routes/cartRoutes'))
app.use('/', require('./routes/orderRoutes'))
app.use('/', require('./routes/userRoutes'))

// Admin routes 
app.use('/', require('./routes/adminRoutes'))

const PORT = process.env.PORT || 3636
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))