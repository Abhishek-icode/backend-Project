const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://kumars:ak.ilu@cluster0.xuzux.mongodb.net/mearndb?retryWrites=true&w=majority").then(()=>{
    console.log("connection successfully created");
}).catch((e)=>{
    console.log(e);
})