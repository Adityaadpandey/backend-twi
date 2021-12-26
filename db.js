const mongoose = require('mongoose')

const url = `mongodb+srv://Aditya:adpandey@cluster0.h40tx.mongodb.net/Twi?retryWrites=true&w=majority`;

const connectToMongo =()=>{
    mongoose.connect(url, ()=>{
        console.log("Connected to MongoDB");
    });
}

module.exports = connectToMongo;

