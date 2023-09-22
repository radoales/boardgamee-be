import express from 'express'
import {
  createUserGame,
  deleteUserGame,
  getUserGameByUserId,
  getUserGames,
  updateUserGame
} from '../controlers/userGames.js'

const router = express.Router()

router.get('/', getUserGames)
router.get('/:userId', getUserGameByUserId) //TODO: change to getUserGamesByUserId
router.post('/', createUserGame)
router.put('/:id', updateUserGame)
router.delete('/:id', deleteUserGame)

export default router
