import express from 'express'

import {
  createInvitation,
  deleteInvitation,
  getInvitationByUserId,
  getInvitations,
  updateInvitation
} from '../controlers/invitations.js'

const router = express.Router()

router.get('/', getInvitations)
router.get('/:id', getInvitationByUserId)
router.post('/', createInvitation)
router.put('/:id', updateInvitation)
router.delete('/:id', deleteInvitation)

export default router
