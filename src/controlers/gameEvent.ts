import { Request, Response } from 'express'
import GameEvent from '../models/GameEvent.js'
import { getTimestampNow } from '../utils/constants.js'
import { v4 as uuidv4 } from 'uuid'
import sequelize from '../config/database.js'
import Location from '../models/Location.js'
import { getDistanceBetweenLocations } from '../utils/location.js'
import { Op } from 'sequelize'

export const createGameEvent = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction()
  try {
    const locationId = uuidv4()
    Location.create(
      {
        ...req.body.location,
        created_at: getTimestampNow(),
        id: locationId,
        updated_at: getTimestampNow()
      },
      {
        transaction
      }
    )

    const gameEvent = await GameEvent.create(
      {
        ...req.body.gameEvent,
        created_at: getTimestampNow(),
        id: uuidv4(),
        location_id: locationId,
        updated_at: getTimestampNow()
      },
      {
        transaction
      }
    )

    await transaction.commit()

    return res.json(gameEvent)
  } catch (error) {
    await transaction.rollback()

    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}

export const getGameEvents = async (req: Request, res: Response) => {
  try {
    const { lat, lon, search, radius, status, game_id } = req.query

    const gameEvents = await GameEvent.findAll({
      include: [
        {
          as: 'location',
          attributes: ['lat', 'lon'],
          model: Location
        }
      ],
      where: {
        [Op.and]: [
          search && {
            name: {
              [Op.iLike]: `%${search}%`
            }
          },
          status === 'past' && {
            end_at: {
              [Op.lt]: getTimestampNow()
            }
          },
          status === 'now' && {
            end_at: {
              [Op.gte]: getTimestampNow()
            },
            start_at: {
              [Op.lte]: getTimestampNow()
            }
          },
          status === 'soon' && {
            start_at: {
              [Op.gt]: getTimestampNow()
            }
          },
          game_id && {
            game_id: game_id as string
          }
        ]
      }
    })

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Invalid user location' })
    }

    gameEvents.forEach((gameEvent) => {
      const location = gameEvent.getDataValue('location')
      if (location) {
        const distance = getDistanceBetweenLocations(
          { lat: parseFloat(lat as string), lon: parseFloat(lon as string) },
          location
        )
        gameEvent.setDataValue('distance', distance)
      }
    })

    return res.json(
      gameEvents
        .filter(
          (gameEvent) =>
            gameEvent.dataValues.distance < parseInt((radius as string) ?? '10')
        )
        .sort((a, b) => a.dataValues.distance - b.dataValues.distance)
    )
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}

export const getGameEventById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const { lat, lon } = req.query
    const gameEvent = await GameEvent.findByPk(id, {
      include: [
        {
          as: 'location',
          attributes: ['lat', 'lon'],
          model: Location
        }
      ]
    })

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Invalid user location' })
    }

    const location = gameEvent.getDataValue('location')
    if (location) {
      const distance = getDistanceBetweenLocations(
        { lat: parseFloat(lat as string), lon: parseFloat(lon as string) },
        location
      )
      gameEvent.setDataValue('distance', distance)
    }

    if (!gameEvent) {
      return res.status(404).json({
        error: 'GameEvent not found',
        message: `GameEvent with ID ${id} not found`
      })
    }

    return res.json(gameEvent)
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}

export const updateGameEvent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const gameEvent = await GameEvent.findByPk(id)

    if (!gameEvent) {
      return res.status(404).json({
        error: 'GameEvent not found',
        message: `GameEvent with ID ${id} not found`
      })
    }

    await gameEvent.update({
      ...req.body,
      updated_at: getTimestampNow()
    })

    return res.json(gameEvent)
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}

export const deleteGameEvent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const gameEvent = await GameEvent.findByPk(id)

    if (!gameEvent) {
      return res.status(404).json({
        error: 'GameEvent not found',
        message: `GameEvent with ID ${id} not found`
      })
    }

    await gameEvent.destroy()

    return res.json({
      message: `GameEvent with ID ${id} has been deleted`
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}
