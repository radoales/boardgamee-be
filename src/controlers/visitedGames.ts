/* eslint-disable no-console */
import { Request, Response } from 'express'
import VisitedGame from '../models/VisitedGame.js'
import { User } from '../models/User.js'
import { NOW } from '../utils/constants.js'

export const getVisitedGames = async (req: Request, res: Response) => {
  try {
    const visitedGames = await VisitedGame.findAll()
    return res.json(visitedGames)
  } catch (error) {
    console.error('Error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.original.message })
  }
}

export const getVisitedGamesByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.user_id
    const user = await User.findByPk(userId)

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${userId} not found`
      })
    }

    const visitedGames = await VisitedGame.findAll({
      limit: 10,
      order: [['updated_at', 'ASC']],
      where: { user_id: userId }
    })

    if (!visitedGames) {
      return res.status(404).json({
        error: 'VisitedGame not found',
        message: `VisitedGame with ID ${userId} not found`
      })
    }

    return res.json(visitedGames)
  } catch (error) {
    console.error('Error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.original.message })
  }
}

export const upsertVisitedGame = async (req: Request, res: Response) => {
  try {
    const { game_id, user_id } = req.body

    if (user_id) {
      const user = await User.findByPk(user_id)
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: `User with ID ${user_id} not found`
        })
      }
    }

    const [visitedGame] = await VisitedGame.upsert(
      {
        game_id,
        updated_at: NOW,
        user_id
      },
      { returning: true }
    )

    return res.json({
      message: 'Success',
      visitedGame
    })
  } catch (error) {
    console.error('Error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.original.message })
  }
}

export const deleteVisitedGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const visitedGame = await VisitedGame.findOne({ where: { id } })

    if (!visitedGame) {
      return res.status(404).json({
        error: 'VisitedGame not found',
        message: `VisitedGame with ID ${id} not found`
      })
    }

    await visitedGame.destroy()

    return res.json({ message: 'VisitedGame deleted successfully' })
  } catch (error) {
    console.error('Error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.original.message })
  }
}
