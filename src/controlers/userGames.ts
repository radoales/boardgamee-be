import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import UserGame from '../models/UserGame.js'
import { User } from '../models/User.js'

export const getUserGames = async (req: Request, res: Response) => {
  try {
    const userGames = await UserGame.findAll()
    return res.json(userGames)
  } catch (error) {
    console.error('Error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.original.message })
  }
}

export const getUserGameById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const userGame = await UserGame.findByPk(id)

    if (!userGame) {
      return res.status(404).json({
        error: 'UserGame not found',
        message: `UserGame with ID ${id} not found`
      })
    }

    return res.json(userGame)
  } catch (error) {
    console.error('Error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.original.message })
  }
}

export const createUserGame = async (req: Request, res: Response) => {
  try {
    const now = new Date().toISOString()
    const { game_id, user_id } = req.body

    const user = await User.findByPk(user_id)
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${user_id} not found`
      })
    }

    const userGame = await UserGame.create({
      id: uuidv4(),
      game_id,
      user_id,
      created_at: now,
      updated_at: now
    })

    return res.json(userGame)
  } catch (error) {
    console.error('Error:', error)
    return res
      .status(409)
      .json({ error: 'Conflict', message: error.original.message })
  }
}

export const updateUserGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { game_id, user_id } = req.body

    const userGame = await UserGame.findOne({ where: { id } })

    if (!userGame) {
      return res.status(404).json({
        error: 'UserGame not found',
        message: `UserGame with ID ${id} not found`
      })
    }

    if (user_id) {
      const user = await User.findByPk(user_id)
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: `User with ID ${user_id} not found`
        })
      }
    }

    userGame.game_id = game_id ?? userGame.game_id
    userGame.user_id = user_id ?? userGame.user_id

    const now = new Date().toISOString()
    userGame.updated_at = now

    await userGame.save()

    return res.json({ message: 'UserGame updated successfully', userGame })
  } catch (error) {
    console.error('Error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.original.message })
  }
}

export const deleteUserGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userGame = await UserGame.findOne({ where: { id } })

    if (!userGame) {
      return res.status(404).json({
        error: 'UserGame not found',
        message: `UserGame with ID ${id} not found`
      })
    }

    await userGame.destroy()

    return res.json({ message: 'UserGame deleted successfully' })
  } catch (error) {
    console.error('Error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.original.message })
  }
}
