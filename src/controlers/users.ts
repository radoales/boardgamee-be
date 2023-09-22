import { Request, Response } from 'express'
import User from '../models/User.js'
import { v4 as uuidv4 } from 'uuid'
import { NOW } from '../utils/constants.js'

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll()
    return res.json(users)
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.original.message })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const user = await User.findOne({ where: { external_id: id } }) //TODO: change to findByPk(id) when firebase is gone

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${id} not found`
      })
    }

    return res.json(user)
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.original.message })
  }
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create({
      ...req.body,
      created_at: NOW,
      id: uuidv4(),
      updated_at: NOW
    })

    return res.json(user)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error', error)
    return res
      .status(409)
      .json({ error: 'Conflict', message: error.original.message })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, email, username, external_id, push_notification_token } =
      req.body

    const user = await User.findOne({ where: { id } })

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${id} not found`
      })
    }

    user.name = name ?? user.name
    user.email = email ?? user.email
    user.username = username ?? user.username
    user.external_id = external_id ?? user.external_id
    user.push_notification_token =
      push_notification_token ?? user.push_notification_token

    await user.save()

    return res.json({ message: 'User updated successfully', user })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error', error)
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.original.message })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await User.findOne({ where: { id } })

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${id} not found`
      })
    }

    await user.destroy()

    return res.json({ message: 'User deleted successfully' })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error', error)
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.original.message })
  }
}
