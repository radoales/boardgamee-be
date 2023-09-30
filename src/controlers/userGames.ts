/* eslint-disable no-console */
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import UserGame from '../models/UserGame.js'
import { User } from '../models/User.js'
import { getTimestampNow } from '../utils/constants.js'

export const getUserGames = async (req: Request, res: Response) => {
  try {
    const userGames = await UserGame.findAll()
    return res.json(userGames)
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}

export const getUserGameByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId

    const user = await User.findByPk(userId)

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${userId} not found`
      })
    }

    const userGames = await UserGame.findAll({ where: { user_id: userId } })

    if (!userGames) {
      return res.status(404).json({
        error: 'UserGames not found',
        message: `UserGames not found`
      })
    }

    return res.json(userGames)
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}

export const createUserGame = async (req: Request, res: Response) => {
  try {
    const { game_id, user_id } = req.body

    const user = await User.findByPk(user_id)
    console.log('user', user)
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${user_id} not found`
      })
    }

    const userGame = await UserGame.create({
      created_at: getTimestampNow(),
      game_id,
      id: uuidv4(),
      updated_at: getTimestampNow(),
      user_id
    })

    return res.json(userGame)
  } catch (error) {
    console.error('Error:', error)
    return res.status(409).json({
      error: 'Conflict',
      message: error.original?.message ?? error.message
    })
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

    userGame.updated_at = getTimestampNow()

    await userGame.save()

    return res.json({ message: 'UserGame updated successfully', userGame })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
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
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}
