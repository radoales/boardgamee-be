import { Request, Response } from 'express'
import Location from '../models/Location.js'
import { v4 as uuidv4 } from 'uuid'
import { getTimestampNow } from '../utils/constants.js'

export const createLocation = async (req: Request, res: Response) => {
  try {
    const location = await Location.create({
      ...req.body,
      created_at: getTimestampNow(),
      id: uuidv4(),
      updated_at: getTimestampNow()
    })

    return res.json(location)
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}

export const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await Location.findAll()
    return res.json(locations)
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}

export const getLocationById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const location = await Location.findByPk(id)

    if (!location) {
      return res.status(404).json({
        error: 'Location not found',
        message: `Location with ID ${id} not found`
      })
    }

    return res.json(location)
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const location = await Location.findByPk(id)

    if (!location) {
      return res.status(404).json({
        error: 'Location not found',
        message: `Location with ID ${id} not found`
      })
    }

    await location.update({
      ...req.body,
      updated_at: new Date().toISOString()
    })

    return res.json(location)
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}

export const deleteLocation = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const location = await Location.findByPk(id)

    if (!location) {
      return res.status(404).json({
        error: 'Location not found',
        message: `Location with ID ${id} not found`
      })
    }

    await location.destroy()

    return res.json({
      message: `Location with ID ${id} has been deleted`
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}
