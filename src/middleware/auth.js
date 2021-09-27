const jwt = require('jsonwebtoken')
const Register = require('../models/ragister')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        const verifyuser = jwt.verify(token, "mynameisabhishekkumariamafullstackdeveloper")
        // console.log(verifyuser);

        // to get the database
        const user = await Register.findOne({_id:verifyuser._id})
        // console.log(user);
        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).send(error)
    }
}

module.exports = auth;