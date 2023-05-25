import * as dotenv from "dotenv"
import { MongoClient, ServerApiVersion } from "mongodb"

dotenv.config()
const uri = `mongodb+srv://admin:${ process.env.DATABASE_PASS }@${ process.env.DATABASE_CLUSTER_URL }/?retryWrites=true&w=majority`

const connect = async (collectionName) => {
    const client = new MongoClient(uri)
    await client.connect()
    const collection = client.db().collection(collectionName)
    return collection
}

export const getApikey = async (collectionName, value) => {
    const collection = await connect(collectionName)

    try {
        const response = await collection.findOne({ apikey: value })
        return response
    } catch (err) {
        return err
    }
}

export const post = async (user) => {
    const collection = await connect("apikeys")

    try {
        const response = await collection.insertOne(user)
        return { response, user }
    } catch (err) {
        return err
    }
}