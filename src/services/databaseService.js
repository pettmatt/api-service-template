import * as mongoDB from "./mongoDBService.js"

export const get = async (collectionName, findObject) => {
    const collection = await mongoDB.connect(collectionName)

    try {
        // Find object can be as simple as "{ username: value }"
        const response = await collection.findOne(findObject)
        return response
    } catch (err) {
        return err
    }
}

export const post = async (collectionName, insertObject) => {
    const collection = await mongoDB.connect(collectionName)

    try {
        // Specify which field contains an unique value
        await collection.createIndex(
            { username: 1 },
            { unique: true, name: "unique_username_index" }
        )
        const response = await collection.insertOne(insertObject)
        return { response, insertObject }
    } catch (err) {
        return err
    }
}

export const update = async (collectionName, updateObject) => {
    const collection = await mongoDB.connect(collectionName)

    try {
        const response = await collection.updateOne(updateObject)
        return { response, updateObject }
    } catch (err) {
        return err
    }
}

export const deleteRequest = async (collectionName, deleteObject) => {
    const collection = await mongoDB.connect(collectionName)

    try {
        const response = await collection.deleteOne(deleteObject)
        return { response, deleteObject }
    } catch (err) {
        return err
    }
}