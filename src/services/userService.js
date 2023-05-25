import bcrypt from "bcrypt"
import { uid } from "uid"
import * as databaseService from "./databaseService.js"

export const register = (password) => {
    const saltRounds = 10

    const result = bcrypt.hash(password, saltRounds)
        .then((hash) => {
            const randomUsername = uid()

            // Store hash in DB
            const response = databaseService.post("users", {
                username: randomUsername,
                hash
            })

            return response
        })

    return result
}

export const authenticate = async (user) => {
    const username = user.username
    const password = user.password

    // Fetch the hash from DB
    const dbUser = await databaseService.get("users", username)

    const result = bcrypt.compare(password, dbUser.hash)
        .then((result) => result)
        .catch((err) => err)

    return { success: result, user: { username: dbUser } }
}