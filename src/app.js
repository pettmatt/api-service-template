import * as dotenv from "dotenv"
import * as userService from "./services/userService.js"
import * as apiService from "./services/apiService.js"
import express from "express"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
    res.send(`
        <h2>API is running</h2>
        <ul>
        Possible routes:
            <li>
            Register user: /register/{password}
                <ul>
                    <li>
                    On success; returns username
                    </li>
                </ul>
            </li>
        <li>
        Get API key: /{username}/apikey/{password}
            <ul>
                <li>
                On success; returns api key with request details
                </li>
            </ul>
        </li>
        </ul>
    `)
})

app.get("/register/:password", async (req, res) => {
    const password = req.params.password
    const generatedUserDetails = await userService.register(password)

    if (generatedUserDetails.response.acknowledged)
        res.status(200).json({ message: "User registered", username: generatedUserDetails.user.username })
    else 
        res.status(403).json({ message: generatedUserDetails })
})

app.get("/:username/apikey/:password", async (req, res) => {
    // Authenticate user
    const authentication = await userService.authenticate({ 
        username: req.params.username,
        password: req.params.password
    })

    if (!authentication.success)
        res.status(403).json({ message: "Authentication failed" })

    // Fetch API details
    const apikey = await apiService.getApikey("apikeys", authentication.user.username)

    if (apikey === null) {
        res.status(200).json({ message: "Please create API key and try again.", success: true })
    }

    res.status(200).json({
        // key: apikey.key,
        // requests: apikey.requests.count,
        // limit: apikey.requests.limit
    })
})

app.get("/api/fetch/:apikey", (req, res) => {
    const user = req.user
    // const apikey = 

    res.json({
        key: apikey.key,
        requests: apikey.requests.count,
        limit: apikey.requests.limit
    })
})

app.listen(PORT, () => {
    console.log(`Server is operating on port ${ PORT }`)
})