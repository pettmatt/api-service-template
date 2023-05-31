import express from "express"
import * as userController from "../controllers/userController.js"

const router = express.Router()

router.get("/user/register/:password", userController.registerUser)
router.get("/user/:username/apikey/:password", userController.getUserApikey)
router.get("/user/:username/:password", userController.getUserDetails)
router.get("/user/:username/delete/:password", userController.deleteUser)

export default router