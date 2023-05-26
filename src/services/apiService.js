import { uid } from "uid"
import * as databaseService from "./databaseService.js"

export const apiRequest = () => {
    return {
        message: "You made an API request successfully!"
    }
}

export const getApikey = (username) => {
    return databaseService.get("apikey", username)
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
    return databaseService.update("apikey", username, { count: count++ })
}

export const resetRequests = (username) => {
    return databaseService.update("apikey", username, { count: 0 })
}