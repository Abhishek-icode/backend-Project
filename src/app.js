require('dotenv').config()
const express = require("express")
require("./db/conn")
const app = express()
const path = require('path')
const hbs = require('hbs')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const coockieparser = require('cookie-parser')
const Ragister = require('./models/ragister')
const auth = require('./middleware/auth')
const { read } = require('fs')
const port = process.env.PORT || 5000;

const spath = path.join(__dirname, '../public')
const tpath = path.join(__dirname, '../templates/contents')
const ppath = path.join(__dirname, '../templates/partials')

app.use(express.urlencoded({ extended: false }))
app.use(coockieparser())
app.use(express.static(spath))
app.set('view engine', 'hbs')
app.set('views', tpath)
hbs.registerPartials(ppath)

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/ragister", (req, res) => {
    res.render("ragister")
})

app.post("/ragister", async (req, res) => {
    try {
        const password = req.body.password
        const cpassword = req.body.cpassword

        if (password === cpassword) {
            const ragemploy = new Ragister({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                number: req.body.number,
                age: req.body.age,
                gender: req.body.gender,
                password: password,
                cpassword: cpassword
            })

            const token = await ragemploy.generatetoken()
            console.log(token);

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 90000),
                httpOnly: true
            })

            const ragistered = await ragemploy.save()
            res.status(201).render('index')
        } else {
            res.send("password is not matching")
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/login', (req, res) => {
    res.render("login")
})
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await Ragister.findOne({ email: email })

        const ismatch = await bcrypt.compare(password, useremail.password)
        // console.log(ismatch);

        if (ismatch) {
            const token = await useremail.generatetoken()
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 90000)
            })
            res.status(201).render("index")
        } else {
            res.send("Incorrect login details")
        }

    } catch (error) {
        console.log(error);
    }
})

app.get("/about", auth, (req, res) => {
    // console.log(`this is our coockies ${req.cookies.jwt}`)
    res.render("about")
})

app.get("/logout", auth, async (req, res) => {
    try {
        // console.log(req.user);
        req.user.tokens = req.user.tokens.filter((curtokn)=>{
            return curtokn.token != req.token
        })
        res.clearCookie("jwt")
        await req.user.save()
        console.log('loguot successfully');
        res.render("login")
    } catch (error) {
        res.status(500).send(error) 
    }
})

app.get("/logoutall", auth, async (req, res)=>{
    req.user.tokens = []
    res.clearCookie("jwt")
    console.log("Logout successfully done");
})
app.listen(port, () => {
    console.log(`listening the server at port ${port}`);
})