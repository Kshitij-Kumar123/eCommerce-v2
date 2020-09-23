const express = require('express');
const mongoose = require('mongoose'); 
// const Joi = require('joi');
const app = express(); 
const cors = require('cors');
// const User = require('./userSchema');
const bcrypt = require('bcrypt');  
const passport = require("passport"); 
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passportLocal = require("passport-local").Strategy; 
const bodyParser = require('body-parser');
const stripe = require("stripe")("sk_test_51HLdeQKaKQE6u3gh4kcnu3MyJXlytR7h0RaT23GgAFNbTxZlSIyviQSXcxK4hdJotpHY6BGEoezhwMR2Q9WBpUfI003xE1NXsC");


require('dotenv/config'); 

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(session({
    secret: "secret", 
    headers: {
        'Content-Type': 'application/json'
    },
    resave: false,
    saveUninitialized: false,  
}));  

// app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());



mongoose.connect(process.env.MODULE, 
    { useNewUrlParser: true, useUnifiedTopology: true },  () => {
        console.log("Connected to MongoDB successfully");
    }
)

const itemRouter = require("./routes/itemRouter");
const userRouter = require('./routes/userRouter');
const cartRouter = require('./routes/cartRouter');

app.use('/items', itemRouter);  
app.use('/users', userRouter);  
app.use('/cart', cartRouter);

app.post("/create-payment-intent", async (req, res) => {
    // const { items } = req.body;
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.price*100, // completely arbituary
      currency: "cad"
    });
    res.send({
      clientSecret: paymentIntent.client_secret
    });
  });
  
const port = process.env.PORT || 4000; 

app.listen(port, () => {
    console.log("Server running successfully on port:", port);
})