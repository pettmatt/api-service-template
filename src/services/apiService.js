import { uid } from "uid"
import * as databaseService from "./databaseService.js"

export const apiRequest = async (apikey = null) => {
    // Check if apikey is correctly offered.
    // If apikey is incorrect declane the request.
    if (apikey === null)
        return {
            message: "API key is needed to make API requests!",
            success: false
        }

    const result = await databaseService.get("apikey", { apikey })

    if (result === null)
        return {
            status: 401,
            message: "Incorrect API key."
        }

    const goodToContinue = checkRequestCount(result)
    if (!goodToContinue)
        return {
            status: 401,
            message: "You have made too many API requests."
        }

    incrementRequests(result.username)

    return {
        status: 200,
        message: "You made an API request successfully!"
    }
}

export const getApikey = async (username) => {
    const result = await databaseService.get("apikey", { username })
    return result
}

export const generateApikey = (username) => {
    return databaseService.post("apikey", {
        username,
        apikey: uid(),
        count: 0,
        limit: 10
    })
}

export const resetApikey = (username) => {
    return databaseService.update("apikey", { username }, {
        $set: {
            note: "API KEY HAS BEEN RESET",
            apikey: uid(),
            count: 0,
            limit: 10
        }
    })
}

const incrementRequests = (username) => {
    return databaseService.update("apikey", { username }, { 
        $inc: {
            count: 1
        }
    })
}

const checkRequestCount = (apikeyDetails) => {
    if (apikeyDetails.count >= apikeyDetails.limit)
        return false
    else 
        return true
}