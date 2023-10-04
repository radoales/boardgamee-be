import express from 'express'
import {
  generateResetToken,
  login,
  logout,
  refreshAccessToken,
  register,
  resetPassword
} from '../controlers/auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/refresh', refreshAccessToken)
router.post('/logout', logout)
router.post('/reset-password-request', generateResetToken)
router.post('/reset-password:resetToken,', resetPassword)

export default router
