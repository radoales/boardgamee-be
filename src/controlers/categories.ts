import { Request, Response } from 'express'
import Category from '../models/Category.js'

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll()

    return res.json(categories)
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}
