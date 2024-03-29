import { Request, Response } from 'express'
import User from '../models/User.js'
import bycript from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import { hashPassword } from '../utils/auth.js'
import Auth from '../models/Auth.js'
import { getTimestampNow } from '../utils/constants.js'
import { Op } from 'sequelize'
import { sendMail } from '../utils/email.js'

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: `User with email ${email} already exists`
      })
    }

    const hashedPassword = await hashPassword(password)

    const userId = uuidv4()

    const user = await User.create({
      ...req.body,
      created_at: getTimestampNow(),
      id: userId,
      updated_at: getTimestampNow(),
      username: email.split('@')[0]
    })

    const accessToken = jwt.sign(
      { email: user.email },
      process.env.SECRET_KEY_ACCESS_TOKEN,
      {
        expiresIn: '1h'
      }
    )

    const refreshToken = jwt.sign(
      { email: user.email, id: userId },
      process.env.SECRET_KEY_REFRESH_TOKEN
    )

    await Auth.create({
      created_at: getTimestampNow(),
      id: uuidv4(),
      password: hashedPassword,
      refresh_token: refreshToken,
      updated_at: getTimestampNow(),
      user_id: userId
    })

    return res.status(201).json({ accessToken, refreshToken })
  } catch (error) {
    return res.status(500).json({
      error: error.name,
      message: error.parent?.detail ?? error.message
    })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body

  const user = await User.findOne({
    where: {
      email: {
        [Op.iLike]: email
      }
    }
  })
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: `User with email ${email} not found`
    })
  }
  const auth = await Auth.findOne({ where: { user_id: user.id } })
  if (!auth) {
    return res.status(404).json({
      error: 'User not found',
      message: `User with email ${email} not found`
    })
  }
  try {
    if (await bycript.compare(password, auth.password)) {
      const accessToken = jwt.sign(
        { email: user.email },
        process.env.SECRET_KEY_ACCESS_TOKEN,
        {
          expiresIn: '1h'
        }
      )

      if (!auth.refresh_token) {
        const refreshToken = jwt.sign(
          { email: user.email, id: user.id },
          process.env.SECRET_KEY_REFRESH_TOKEN
        )

        await Auth.update(
          { refresh_token: refreshToken },
          { where: { user_id: user.id } }
        )

        return res.status(200).json({ accessToken, refreshToken })
      }

      return res
        .status(200)
        .json({ accessToken, refreshToken: auth.refresh_token })
    } else {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid password'
      })
    }
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid password'
    })
  }
}

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  try {
    const auth = await Auth.findOne({ where: { refresh_token: refreshToken } })
    if (!auth) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid refresh token'
      })
    }

    jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN,
      (err: { message: string }, decoded: { email: string }) => {
        if (err) {
          return res.status(401).json({
            error: 'Unauthorized',
            message: ` not valid ${err.message}`
          })
        }

        const accessToken = jwt.sign(
          { email: decoded.email },
          process.env.SECRET_KEY_ACCESS_TOKEN,
          {
            expiresIn: '1h'
          }
        )

        return res.status(200).json({ accessToken })
      }
    )
  } catch (error) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

export const generateResetToken = async (req: Request, res: Response) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with email ${email} not found`
      })
    }

    const resetToken = jwt.sign(
      { email: user.email },
      process.env.SECRET_KEY_RESET_TOKEN,
      {
        expiresIn: '10min'
      }
    )

    await Auth.update(
      { reset_token: resetToken },
      { where: { user_id: user.id } }
    )

    sendMail({
      html: ` 
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset for Boardgamee</title>
      </head>
      <body>
          <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                  <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                          <!-- Logo Section -->
                          <tr>
                              <td align="center" style="padding: 2rem;">
                                  <img src="https://firebasestorage.googleapis.com/v0/b/boardgamee-1fb35.appspot.com/o/main_logo_orange.png?alt=media&token=caced9ef-23ea-4db2-9de7-a8c931cfc97e&_gl=1*s8jnu5*_ga*MTAxNTg1OTYyMC4xNjkwODA5MDM3*_ga_CW55HF8NVT*MTY5NjY2NTMwNC4yNy4xLjE2OTY2NjUzMDQuMC4w" alt="Boardgamee Logo" style="max-width: 150px;">
                              </td>
                          </tr>
                          <!-- Email Content Section -->
                          <tr>
                              <td style="padding: 20px;">
                                  <p>Hello,</p>
                                  <p>We received a request to reset your password for Boardgamee. To reset your password, please copy the following key and paste it into the app:</p>
                                 <span style="font-size: 24px; font-weight: bold; color: #E3735E;">Reset Key:</span>
      <span style="font-size: 28px; color: #333333; background-color: #F5F5F5; padding: 10px; border-radius: 5px; display: inline-block;">
          ${resetToken}
      </span>
                                  <p>If you didn't request a password reset, you can ignore this email, and your password will remain unchanged.</p>
                                  <p>Thank you for using Boardgamee!</p>
                              </td>
                          </tr>
                          <!-- Footer Section -->
                          <tr>
                              <td style="background-color: #f8f8f8; padding: 2rem; text-align: center;">
                                  <p>&copy; 2023 Boardgamee. All rights reserved.</p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>      
      `,
      subject: 'Reset password',
      to: user.email
    })

    return res.status(200).json({
      message: 'Reset token generated successfully'
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  const { password } = req.body
  const { resetToken } = req.params

  try {
    const auth = await Auth.findOne({ where: { reset_token: resetToken } })
    if (!auth) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid reset token'
      })
    }

    jwt.verify(
      resetToken,
      process.env.SECRET_KEY_RESET_TOKEN,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (err: { message: string }, decoded: { email: string }) => {
        if (err) {
          return res.status(401).json({
            error: 'Unauthorized',
            message: ` not valid ${err.message}`
          })
        }

        const hashedPassword = await hashPassword(password)

        await Auth.update(
          { password: hashedPassword, reset_token: null },
          { where: { reset_token: resetToken } }
        )

        return res.status(200).json({
          message: 'Reset password successfully'
        })
      }
    )
  } catch (error) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  try {
    await Auth.update(
      { refresh_token: null },
      { where: { refresh_token: refreshToken } }
    )

    return res.status(200).json({
      message: 'Logout successful'
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}
