import express from 'express'
import { login, register } from '../controlers/auth.js'
import authenticateToken from '../middlewares/auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)

export default router
