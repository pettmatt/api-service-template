import * as userService from "../services/userService.js"
import * as apiService from "../services/apiService.js"

export const generateApikey = async (req, res) => {
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
}

export const resetApikey = async (req, res) => {
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
}