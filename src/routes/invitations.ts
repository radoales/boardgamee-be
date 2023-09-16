import express from 'express'

import {
  createInvitation,
  deleteInvitation,
  getInvitationById,
  getInvitations,
  updateInvitation
} from '../controlers/invitations.js'

const router = express.Router()

router.get('/', getInvitations)
router.get('/:id', getInvitationById)
router.post('/', createInvitation)
router.put('/:id', updateInvitation)
router.delete('/:id', deleteInvitation)

export default router
