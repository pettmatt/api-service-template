import * as userService from "../services/userService.js"
import * as apiService from "../services/apiService.js"

export const registerUser = async (req, res) => {
    const password = req.params.password
    const generatedUserDetails = await userService.register(password)

    if (!generatedUserDetails.response.acknowledged)
        return res.status(500).json({ message: generatedUserDetails })

    res.status(200).json({ message: "User registered", username: generatedUserDetails.insertObject.username })
}

export const getUserApikey = async (req, res) => {
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
}

export const getUserDetails = async (req, res) => {
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
}

export const deleteUser = async (req, res) => {
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
}