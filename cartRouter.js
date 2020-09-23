const express = require('express'); 
const router = express.Router();
const mongoose = require('mongoose'); 
const Cart = require('../models/cartSchema');

router.post('/', async (req, res) => {
    const newItem = new Cart ({
        itemId: req.body.id, 
        quantity: req.body.quantity
    })

    try {
        const savedItem = await newItem.save();
        res.json("Saved to cart");
    } catch(err) {
        res.status(err).send("Error. Unable to add to cart");
    }
})

router.get('/', async (req, res) => {
    try {
        const showItems = await Cart.find();   
        res.send(showItems);
    } catch(err) {
        res.status(err).json(err); 
    }
})

router.delete('/:id', async (req, res) => {
    Cart.findByIdAndDelete(req.params.id)
        .then(() => res.send('Exercise deleted.'))
        .catch(err => res.status(400).json(err));
})

module.exports = router;