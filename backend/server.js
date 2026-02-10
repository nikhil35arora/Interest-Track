const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- 1. MIDDLEWARE (Must be at the top) ---
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
require('dotenv').config(); 
// --- 2. DATABASE CONNECTION ---
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
    .then(() => console.log("✅ Success: Connected to MongoDB Cloud!"))
    .catch((err) => {
        console.log("❌ DB Connection Error. Check your password in .env");
        console.error(err);
    });

// --- 3. MODELS (Defined ONLY once) ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true } 
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    name: String,
    type: String, // 'Lent' or 'Taken'
    amount: Number,
    rate: Number,
    date: { type: Date, default: Date.now }
});
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

// --- 4. ROUTES ---

// Test Route
app.get('/', (req, res) => {
    res.send("Server is awake and waiting for data! 🚀");
});

// Signup/Register Route
app.post('/api/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(400).json({ error: "Username already exists or data is missing." });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.status(200).json({ userId: user._id, username: user.username });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

// Save Transaction
app.post('/api/transactions', async (req, res) => {
    try {
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();
        res.status(201).json({ message: "Transaction saved successfully!" });
    } catch (err) {
        console.error("Save Error:", err);
        res.status(400).json({ error: "Failed to save data. userId is required." });
    }
});

// Get user-specific transactions
app.get('/api/transactions/:userId', async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch data" });
    }
});

// Delete all transactions
app.delete('/api/transactions/:userId', async (req, res) => {
    try {
        await Transaction.deleteMany({ userId: req.params.userId }); 
        res.status(200).send({ message: "Your data has been cleared." });
    } catch (err) {
        res.status(500).send({ error: "Could not delete data" });
    }
});

// --- 5. START SERVER ---
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});