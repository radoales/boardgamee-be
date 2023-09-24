import express from 'express'
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  searchUsers,
  updateUser
} from '../controlers/users.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/search/', searchUsers)
router.get('/:id', getUserById)
router.post('', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
