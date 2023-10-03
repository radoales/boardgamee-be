import { Router } from 'express'
import { getCategories } from '../controlers/categories.js'

const router = Router()

router.get('/', getCategories)

export default router
