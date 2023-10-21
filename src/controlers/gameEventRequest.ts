import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import GameEventRequest from '../models/GameEventRequest.js'
import { getTimestampNow } from '../utils/constants.js'
import User from '../models/User.js'
import GameEvent from '../models/GameEvent.js'
import sendNotification from '../utils/notifications.js'

export const createGameEventRequest = async (req: Request, res: Response) => {
  try {
    const { game_event_id, message, request_user_id } = req.body

    const gameEventRequest = await GameEventRequest.create({
      created_at: getTimestampNow(),
      game_event_id: game_event_id,
      id: uuidv4(),
      message: message,
      request_user_id: request_user_id,
      status: 'pending',
      updated_at: getTimestampNow()
    })

    const gameEvent = await GameEvent.findByPk(game_event_id)

    const sender = await User.findByPk(request_user_id)
    const receiver = await User.findByPk(gameEvent.owner_user_id)

    if (receiver) {
      await sendNotification({
        body: `${
          sender?.name ?? sender.username ?? sender.email
        } wants to play ${gameEvent.name} with you!`,
        data: { url: 'EventsTabScreen' },
        pushTokens: [receiver.push_notification_token],
        title: 'Request to join the game event'
      })
    }

    return res.json(gameEventRequest)
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}

export const getGameEventRequests = async (req: Request, res: Response) => {
  try {
    const gameEventRequests = await GameEventRequest.findAll()

    return res.json(gameEventRequests)
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}

export const getGameEventRequestByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.userId
    const gameEventRequest = await GameEventRequest.findAll({
      where: {
        request_user_id: userId
      }
    })

    if (!gameEventRequest) {
      return res.status(404).json({
        error: 'GameEventRequest not found',
        message: `GameEventRequest with ID ${userId} not found`
      })
    }

    return res.json(gameEventRequest)
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}

export const updateGameEventRequest = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const gameEventRequest = await GameEventRequest.findByPk(id)

    if (!gameEventRequest) {
      return res.status(404).json({
        error: 'GameEventRequest not found',
        message: `GameEventRequest with ID ${id} not found`
      })
    }

    await gameEventRequest.update({
      ...req.body,
      updated_at: getTimestampNow()
    })

    return res.json(gameEventRequest)
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}

export const deleteGameEventRequest = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const gameEventRequest = await GameEventRequest.findByPk(id)

    if (!gameEventRequest) {
      return res.status(404).json({
        error: 'GameEventRequest not found',
        message: `GameEventRequest with ID ${id} not found`
      })
    }

    await gameEventRequest.destroy()

    return res.json({
      message: `GameEventRequest with ID ${id} has been deleted`
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}
