import express from "express"
import apikeyController from "../controllers/apikeyController.js"

const router = express.Router()

router.get("/apikey/generate/:username/:password", apikeyController.generateApikey)
router.get("/apikey/reset/:username/:password", apikeyController.resetApikey)

export default router