import express from 'express'
import {
  login,
  logout,
  refreshAccessToken,
  register
} from '../controlers/auth.js'
import authenticateToken from '../middlewares/auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/refresh', refreshAccessToken)
router.post('/logout', logout)

export default router
