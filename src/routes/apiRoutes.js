import express from "express"
import apiController from "../controllers/apiController.js"

const router = express.Router()

router.get("/api/request/:apikey", apiController.makeApiRequest)

export default router