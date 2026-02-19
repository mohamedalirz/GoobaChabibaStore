const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors({
    origin:"*"
}));

app.use(express.json());

const jwtSecret = "your_jwt_secret_key"; // In production, use an environment variable

const users = [
    { id:1, username: "admin", email: "", password: "$2b$10$7sH8Zt1n5mXo9u3zj6l7u5v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2", role: "admin" },
    { id:2, username: "client", email: "", password: "$2b$10$7sH8Zt1n5mXo9u3zj6l7u5v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2", role: "client"}
];
const products = [
    { id: 1, name: "Product 1", description: "Description of Product 1", price: 10.99 , stock: 100, category: "Hoodies", isLimited: false , image:"https://scontent.ftun16-1.fna.fbcdn.net/v/t39.30808-6/476208595_1237554571071325_2014838953714155293_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=FSd8tmbS8XgQ7kNvwHFgKUN&_nc_oc=Adk1Ga-MUmHMPJuotYSQKEvZHnRcoTUWQ2c1gHM_mp-MMfMpKEp-SnpWSuOyxsdmFyc&_nc_zt=23&_nc_ht=scontent.ftun16-1.fna&_nc_gid=Ntg_IBQPBzFdSVUwx71nog&oh=00_AfvStACB2j_kyuGpNGYtiO-X9D8-AzbiItpFKKpblz6tHQ&oe=69982E49"},
    { id: 2, name: "Product 2", description: "Description of Product 2", price: 19.99 , stock: 100, category: "T-Shirts", isLimited: false, image:"https://scontent.ftun16-1.fna.fbcdn.net/v/t39.30808-6/476208595_1237554571071325_2014838953714155293_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=FSd8tmbS8XgQ7kNvwHFgKUN&_nc_oc=Adk1Ga-MUmHMPJuotYSQKEvZHnRcoTUWQ2c1gHM_mp-MMfMpKEp-SnpWSuOyxsdmFyc&_nc_zt=23&_nc_ht=scontent.ftun16-1.fna&_nc_gid=Ntg_IBQPBzFdSVUwx71nog&oh=00_AfvStACB2j_kyuGpNGYtiO-X9D8-AzbiItpFKKpblz6tHQ&oe=69982E49"},
    { id: 3, name: "Product 3", description: "Description of Product 3", price: 5.99 , stock: 100, category: "Caps", isLimited: false, image:"https://scontent.ftun16-1.fna.fbcdn.net/v/t39.30808-6/476208595_1237554571071325_2014838953714155293_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=FSd8tmbS8XgQ7kNvwHFgKUN&_nc_oc=Adk1Ga-MUmHMPJuotYSQKEvZHnRcoTUWQ2c1gHM_mp-MMfMpKEp-SnpWSuOyxsdmFyc&_nc_zt=23&_nc_ht=scontent.ftun16-1.fna&_nc_gid=Ntg_IBQPBzFdSVUwx71nog&oh=00_AfvStACB2j_kyuGpNGYtiO-X9D8-AzbiItpFKKpblz6tHQ&oe=69982E49"},
];
const category = ["All","Hoodies", "T-Shirts", "Caps"];
const cart = [];
const checkOuts = [];
const orders = [];

/**************************** Authentification ****************************************/
/// Register endpoint
app.post("/register", async (req, res) => {
    const { username, email, password} = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const userExist = users.find(user => user.email === email);
    if(userExist){
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, email, password: hashedPassword , role: "client"};
    users.push(newUser);
    res.status(201).json({ message: "User registered successfully" });
})

/// Login endpoint

app.post("/login", async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = users.find(user => user.email === email);
    if(!user){
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ email: user.email }, jwtSecret, { expiresIn: "100h" });

    res.json({ token });

})


/**************************** Authentification ****************************************/

//// Middleware to verify JWT token
function authenticateToken(req,res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({ message: "Access token is missing" });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if(err){
            return res.status(403).json({ message: "Invalid access token" });
        }
        req.user = user;
        next();
    });
}


//// Products endpoints
app.get("/products", (req, res) => {
    res.json(products);
    
})

/// Categories endpoint
app.get("/category",(req, res) => {
    res.json(category);
})

//// add to cart endpoint
app.post("/cart", (req, res) => {
    const {cartId, product, userId ,quantity, size} = req.body;
    const p = products.find(p => p.id === product.id);
    if(!p){
        return res.status(404).json({ message: "Product not found" });
    }
    if(p.stock < quantity){
        return res.status(400).json({ message: "Not enough stock available" });
    }
    cart.push({ cartId, product, userId, quantity, size});
    res.status(201).json({ message: "Product added to cart successfully" });
})

//// fetch cart 
app.get("/cart/:userId", (req, res) => {
  const userId = Number(req.params.userId);

  const userCart = cart.filter(c => c.userId === userId);

  if (!userCart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  res.json(userCart);
});

//// delete cart
app.delete("/deleteCart/:id", (req,res) => {
    const id = Number(req.params.id);
    const index = cart.findIndex(c => c.userId === id);
    if (index === -1) {
        return res.status(404).json({ message: "Cart not found" });
    }
    cart.splice(index, 1);

    res.json({ message: "Cart deleted successfully", cart });
})

//// add checkout endpoint
app.post("/checkout", (req, res) => {
    const { checkOutId, cart, totalAmount, userId} = req.body;
    checkOuts.push({ checkOutId, cart, totalAmount, userId});
    res.status(201).json({ message: "Checkout placed successfully" });
    
})

//// fetch checkouts
app.get("/checkout/:userId", (req, res) => {
    const userId = Number(req.params.userId);
    const userCheckouts = checkOuts.filter(
        c => c.userId === userId
    );
    if(!userCheckouts.length === 0){
        return res.status(404).json({ message: "Orders not found" });
    }
   
    res.json(userCheckouts);
})

///// delete checkout
app.delete("/deleteCheckout/:id", (req,res) => {
    const id = Number(req.params.id);
    const index = checkOuts.findIndex(c => c.userId === id);

    if (index === -1) {
        return res.status(404).json({ message: "Cart not found" });
    }

    checkOuts.splice(index, 1);
    res.json({ message: "Checkout deleted successfully", checkOuts });

})

///// add orders enpoint
app.post("/orders/:userId", (req, res) => {
    const {idOrder, userId, name, address, city, phone, products, totalAmount, status} = req.body;
    orders.push({idOrder, userId, name, address, city, phone, products, totalAmount, status});
    res.status(201).json({ message: "Order placed successfully" });
    //console.log("new order:", orders)
})

//// fetch users
app.get("/users", (req, res) => {
    res.json(users)
})

//// fetch orders 
app.get("/orders", (req, res) => {
    res.json(orders)
})

/// update order
app.put("/updateOrder/:id", (req, res) => {
    const id = Number(req.params.id);
    const updated = req.body;

    const index = orders.findIndex(o => Number(o.idOrder) === id);

    if (index === -1) {
        return res.status(404).json({ message: "Order not found" });
    }
    orders[index] = { ...orders[index], ...updated };

    res.json(orders[index]);

})

//// fetch sales 
app.get("/sales", (req, res) => {
    const soldOrders = orders.filter((order) => order.status === "sold")
    res.json(soldOrders);
    //console.log("sold : ", soldOrders)
})



app.listen(3636, () => {
    console.log("Server is running on port 3636");
});