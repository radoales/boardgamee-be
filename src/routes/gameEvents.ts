import express from 'express'

import {
  createGameEvent,
  getGameEvents,
  getGameEventById,
  updateGameEvent,
  deleteGameEvent
} from '../controlers/gameEvent.js'

const router = express.Router()

router.post('/', createGameEvent)
router.get('/', getGameEvents)
router.get('/:id', getGameEventById)
router.put('/:id', updateGameEvent)
router.delete('/:id', deleteGameEvent)

export default router
