import * as dotenv from "dotenv"
import express from "express"
import apiRoutes from "./routes/apiRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import apikeyRoutes from "./routes/apikeyRoutes.js"

dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())

app.use("/", [
    apiRoutes,
    userRoutes,
    apikeyRoutes
])

app.get("/", (req, res) => {
    res.send(`
        <h2>API is running</h2>
        <ul>
        Possible routes:
            <li>
            Register user: /user/register/{password}
                <ul>
                    <li>
                    On success; returns username
                    </li>
                </ul>
            </li>
            <li>
            Generate API key: /apikey/generate/{username}/{password}
                <ul>
                    <li>
                    On success; returns API key with request details
                    </li>
                </ul>
            </li>
            <li>
            Reset existing API key: /apikey/reset/{username}/{password}
                <ul>
                    <li>
                    On success; returns a message
                    </li>
                </ul>
            </li>
            <li>
            Get make an API request: /api/request/{apikey}
                <ul>
                    <li>
                    On success; returns a message and increments the request count
                    </li>
                </ul>
            </li>
            <li>
            Get user details: /user/{username}/{password}
                <ul>
                    <li>
                    On success; returns user details, username and API key details 
                    </li>
                </ul>
            </li>
            <li>
            Delete user: /user/{username}/delete/{password}
                <ul>
                    <li>
                    On success; returns a message
                    </li>
                </ul>
            </li>
        </ul>
    `)
})

app.listen(PORT, () => {
    console.log(`Server is operating on port ${ PORT }`)
})