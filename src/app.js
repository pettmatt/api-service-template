// require("dotenv").config
const bcrypt = require("bcrypt")
const app = require("express")

const PORT = process.env.PORT || 3000

app.get("/", (res, req) => {
    res.send("API is running")
})

app.get("/register", (res, req) => {
    res.send("You're registered")
})

app.listen(PORT)