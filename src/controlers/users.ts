import { type Request, type Response } from 'express'
import User from '../models/User.js'
import { log } from 'console'

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll()
    log(users)
  } catch (error) {}
}
