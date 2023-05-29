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
    console.log("FINAL CHECK POINT", result)

    return {
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

export const incrementRequests = (username, count) => {
    // const apikey = await databaseService.get("apikey", username)
    return databaseService.update("apikey", { username }, { count: count++ })
}

export const resetApikey = (username) => {
    return databaseService.update("apikey", { username }, {
        note: "API KEY HAS BEEN RESET",
        apikey: uid(),
        count: 0,
        limit: 10
    })
}