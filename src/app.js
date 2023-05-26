import * as dotenv from "dotenv"
import * as userService from "./services/userService.js"
import * as apiService from "./services/apiService.js"
import express from "express"

dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()

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
    console.log(generatedUserDetails)
    if (!generatedUserDetails.response.acknowledged)
        return res.status(500).json({ message: generatedUserDetails })

    res.status(200).json({ message: "User registered", username: generatedUserDetails.insertObject.username })
})

app.get("/:username/apikey/:password", async (req, res) => {
    // Authenticate user
    const authentication = await userService.authenticate({
        username: req.params.username,
        password: req.params.password
    })

    if (authentication === null || !authentication.success)
        return res.status(401).json({ message: "Authentication failed. Check if your username and password were correct." })

    // Fetch API details
    const apikey = await apiService.getApikey({ username: authentication.user.username })

    if (apikey === null)
        return res.status(200).json({ message: "Please create API key and try again.", apikey })

    res.status(200).json({
        key: apikey.key,
        requests: apikey.requests.count,
        limit: apikey.requests.limit
    })
})

app.get("/apikey/generate/:username/:password", async (req, res) => {
    const authentication = await userService.authenticate({
        username: req.params.username,
        password: req.params.password
    })

    if (authentication === null || !authentication.success)
        return res.status(401).json({ message: "Authentication failed. Check if your username and password were correct." })

    // Generate API key
    const result = await apiService.generateApikey({ username: req.params.username })

    if (result.code === 11000)
        return res.status(401).json({ message: "Cannot create new keys. Please reset the existing one." })

    res.status(200).json({
        message: "API key generated.",
        apikey: result.insertObject.apikey,
        count: result.insertObject.count,
        limit: result.insertObject.limit
    })
})

app.get("/api/fetch/:apikey", (req, res) => {
    const user = req.params.apikey

    res.json({
    })
})

app.listen(PORT, () => {
    console.log(`Server is operating on port ${ PORT }`)
})