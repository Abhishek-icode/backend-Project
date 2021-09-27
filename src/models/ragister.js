require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const employSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    number:{
        type:Number,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

// generating token
employSchema.methods.generatetoken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()}, "mynameisabhishekkumariamafullstackdeveloper")
        this.tokens = this.tokens.concat({token:token})
        await this.save()
        return token;
    } catch (error) {
        console.log(`the error is ${error}`);
    }
}

// hashing password
employSchema.pre("save", async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
        this.cpassword = await bcrypt.hash(this.cpassword, 10)
    }
    next()
})

const Ragister = new mongoose.model("employe", employSchema)

module.exports = Ragister;