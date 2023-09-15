import { type Request, type Response } from 'express'
import User from '../models/User.js'

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll()
    return res.json(users)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json(user)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}
