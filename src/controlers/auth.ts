import { Request, Response } from 'express'
import User from '../models/User.js'
import bycript from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import { hashPassword } from '../utils/auth.js'
import Auth from '../models/Auth.js'
import { NOW } from '../utils/constants.js'

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
      id: userId,
      email,
      created_at: NOW,
      updated_at: NOW,
      external_id: '',
      name: '',
      push_notification_token: '',
      username: ''
    })

    const accessToken = jwt.sign(
      { email: user.email },
      process.env.SECRET_KEY_ACCESS_TOKEN,
      {
        expiresIn: '1h'
      }
    )

    const refreshToken = jwt.sign(
      { email: user.email },
      process.env.SECRET_KEY_REFRESH_TOKEN
    )

    await Auth.create({
      id: uuidv4(),
      password: hashedPassword,
      user_id: userId,
      created_at: NOW,
      updated_at: NOW,
      refresh_token: refreshToken
    })

    return res.status(201).json({ accessToken, refreshToken })
  } catch (error) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await User.findOne({ where: { email } })
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

      return res.status(200).json({ accessToken })
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
  console.log('refreshToken', refreshToken)

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
      (err: any, decoded: { email: string }) => {
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
