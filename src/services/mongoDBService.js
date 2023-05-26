import * as dotenv from "dotenv"
import { MongoClient, ServerApiVersion } from "mongodb"
dotenv.config()

const uri = `mongodb+srv://admin:${ process.env.DATABASE_PASS }@${ process.env.DATABASE_CLUSTER_URL }/?retryWrites=true&w=majority`

export const connect = async (collectionName) => {
    const client = new MongoClient(uri)
    await client.connect()
    const collection = client.db().collection(collectionName)
    return collection
}