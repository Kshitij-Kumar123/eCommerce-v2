const mongoose = require('mongoose'); 

const itemSchema = new mongoose.Schema({
    brand: { type: String, required: true }, 
    description: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now }
})

module.exports = Item = mongoose.model('itemSchema', itemSchema);