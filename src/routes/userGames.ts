import express from 'express'
import {
  createUserGame,
  deleteUserGame,
  getUserGameById,
  getUserGames,
  updateUserGame
} from '../controlers/userGames.js'

const router = express.Router()

router.get('/', getUserGames)
router.get('/:id', getUserGameById)
router.post('/', createUserGame)
router.put('/:id', updateUserGame)
router.delete('/:id', deleteUserGame)

export default router
