const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    rate: { type: Number, required: true },
    type: { type: String, enum: ['Lent', 'Taken'], required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Transaction', TransactionSchema);