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

app.get("/api/request/:apikey", async (req, res) => {
    const result = await apiService.apiRequest(req.params.apikey)

    // Setting status code dynamically could make the code DRYer
    res.status(result.status).json({ message: result.message })
})

app.get("/register/:password", async (req, res) => {
    const password = req.params.password
    const generatedUserDetails = await userService.register(password)

    if (!generatedUserDetails.response.acknowledged)
        return res.status(500).json({ message: generatedUserDetails })

    res.status(200).json({ message: "User registered", username: generatedUserDetails.insertObject.username })
})

app.get("/user/:username/apikey/:password", async (req, res) => {
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

app.get("/user/:username/:password", async (req, res) => {
    const authentication = await userService.authenticate({
        username: req.params.username,
        password: req.params.password
    })

    if (authentication === null || !authentication.success)
        return res.status(401).json({ message: "Authentication failed. Check if your username and password were correct." })

    // Because there is so little info about the user in users, the request is send to "apikey" collection
    const result = await apiService.getApikey(authentication.user.username)

    if (result === null)
        return res.status(404).json({ message: "User not found." })

    res.status(200).json(result)
})

app.get("/apikey/generate/:username/:password", async (req, res) => {
    const authentication = await userService.authenticate({
        username: req.params.username,
        password: req.params.password
    })

    if (!authentication || authentication === null)
        return res.status(401).json(
            { message: "Authentication failed. Check if your username and password were correct." }
        )

    // Generate API key
    const result = await apiService.generateApikey(req.params.username)

    if (result.code === 11000)
        return res.status(401).json(
            { message: "Cannot create new keys. Please reset the existing one." }
        )

    res.status(200).json({
        message: "API key generated.",
        apikey: result.insertObject.apikey,
        count: result.insertObject.count,
        limit: result.insertObject.limit
    })
})

app.get("/apikey/reset/:username/:password", async (req, res) => {
    const authentication = await userService.authenticate({
        username: req.params.username,
        password: req.params.password
    })

    if (!authentication || authentication === null)
        return res.status(401).json(
            { message: "Authentication failed. Check if your username and password were correct." }
        )

    // Generate API key
    const result = await apiService.resetApikey(req.params.username)

    res.status(200).json({
        message: "API key has been reset.",
        apikey: result.updateObject.apikey,
        count: result.updateObject.count,
        limit: result.updateObject.limit
    })
})

app.get("/user/:username/delete/:password", async (req, res) => {
    const authentication = await userService.authenticate({
        username: req.params.username,
        password: req.params.password
    })

    if (!authentication || authentication === null)
        return res.status(401).json(
            { message: "Authentication failed. Check if your username and password were correct." }
        )

    const result = await userService.deleteUser(req.params.username)

    if (!result.user) 
        res.status(401).json({
            message: "Couldn't delete user",
            response: result
        })

    res.status(200).json({
        message: `User "${ req.params.username }" has been deleted.`
    })
})

app.listen(PORT, () => {
    console.log(`Server is operating on port ${ PORT }`)
})