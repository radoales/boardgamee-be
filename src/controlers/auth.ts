import { Request, Response } from 'express'
import User from '../models/User.js'
import bycript from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await User.findOne({ where: { email } })
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: `User with email ${email} not found`
    })
  }
  try {
    // if (await bycript.compare(password, user.password)) {
    const accessToken = jwt.sign({ name: user.email }, process.env.SECRET_KEY, {
      expiresIn: '1h'
    })
    return res.status(200).json({ accessToken })
    // } else {
    //   return res.status(401).json({
    //     error: 'Unauthorized',
    //     message: 'Invalid password'
    //   })
    // }
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid password'
    })
  }
}
