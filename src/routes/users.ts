import express from 'express'
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser
} from '../controlers/users.js'
import {
  createInvitation,
  deleteInvitation,
  getInvitationById,
  getInvitations,
  updateInvitation
} from '../controlers/invitations.js'

const router = express.Router()

router.get('/users', getUsers)
router.get('/users/:id', getUserById)
router.post('/users', createUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

router.get('/invitations', getInvitations)
router.get('/invitations/:id', getInvitationById)
router.post('/invitations', createInvitation)
router.put('/invitations/:id', updateInvitation)
router.delete('/invitations/:id', deleteInvitation)

export default router
