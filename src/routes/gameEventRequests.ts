import express from 'express'
import {
  createGameEventRequest,
  deleteGameEventRequest,
  getGameEventRequestByUserId,
  getGameEventRequests,
  updateGameEventRequest
} from '../controlers/gameEventRequest.js'

const router = express.Router()

router.get('/', getGameEventRequests)
router.get('/:userId', getGameEventRequestByUserId)
router.post('/', createGameEventRequest)
router.put('/:id', updateGameEventRequest)
router.delete('/:id', deleteGameEventRequest)

export default router
