const mongoose = require('mongoose'); 
const { boolean, bool } = require('joi');
const User = mongoose.Schema({ 
    username: {
        type: String, 
        required: true
    }, 
    password: { 
        type: String,
        required: true  
    }, 
    itemList: {
        type: Array, 
        default: [1,2] 
    }, 
    isAuthenticated: { 
        default: false
    }
})

module.exports = mongoose.model('User', User);