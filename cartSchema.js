const mongoose = require('mongoose'); 

const cartSchema = new mongoose.Schema({
    itemId: {
        type: String
    }, 
    quantity: {
        type: Number
    }
})

module.exports = mongoose.model('cartSchema', cartSchema);