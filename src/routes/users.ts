import express from "express"
import { getUsers } from "../controlers/users.js"

const router = express.Router()

router.get("/users", getUsers)

export default router
