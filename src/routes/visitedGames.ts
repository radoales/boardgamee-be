import express from 'express'
import {
  getVisitedGamesByUserId,
  getVisitedGames,
  upsertVisitedGame
} from '../controlers/visitedGames.js'

const router = express.Router()

router.get('/', getVisitedGames)
router.get('/:user_id', getVisitedGamesByUserId)
router.put('/', upsertVisitedGame)

export default router
