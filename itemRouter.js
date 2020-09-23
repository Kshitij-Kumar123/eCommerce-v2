const express = require('express'); 
const router = express.Router();
const mongoose = require('mongoose'); 
const Item = require('../models/itemSchema');

router.get('/', async (req, res) => {
    // res.send("checking if")
    try {
        const showItems = await Item.find();   
        res.send(showItems);
    } catch(err) {
        res.status(err).send(err); 
    }
})

router.get('/find/:id', async (req, res) => {
    // res.send("checking if")
    try {
        const findItem = await Item.findById(req.params.id);   
        res.send(findItem);
    } catch(err) { 
        res.status(err).send(err); 
    }
})

router.post('/', async (req, res) => {
    const item = new Item ({ 
        brand: req.body.brand, 
        description: req.body.description, 
        price: req.body.price,
        date: req.body.date
    })

    try {
        const addingItem = await item.save(); 
        res.json("Item saved");
    } catch(err) {
        res.status(err).send(err); 
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const itemDelete = await Item.findByIdAndDelete(req.params.id); 
        res.json("Item Deleted: ", itemDelete);
    } catch(err) {
        res.status(err).json(err); 
    }
})

router.post('/update/:id', async (req, res) => {

    const itemSelected = new Item ({
        brand: req.body.brand, 
        description: req.body.description, 
        price: req.body.price,
        date: req.body.date
    })

    try {
        const itemUpdated = await Item.findByIdAndUpdate({_id: req.params.id}, {
            brand: req.body.brand, 
            description: req.body.description
        }); 
        res.json("Item updated");
    } catch(err) {
        res.status(400).send("Error: 400"); 
    }
})

module.exports = router; 