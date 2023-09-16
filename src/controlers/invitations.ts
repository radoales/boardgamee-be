import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import Invitation from '../models/Invitation.js'

export const getInvitations = async (req: Request, res: Response) => {
  try {
    const invitations = await Invitation.findAll()
    return res.json(invitations)
  } catch (error) {
    console.error('Error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.original.message })
  }
}

export const getInvitationById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const invitation = await Invitation.findByPk(id)

    if (!invitation) {
      return res.status(404).json({
        error: 'Invitation not found',
        message: `Invitation with ID ${id} not found`
      })
    }

    return res.json(invitation)
  } catch (error) {
    console.error('Error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.original.message })
  }
}

export const createInvitation = async (req: Request, res: Response) => {
  try {
    const now = new Date().toISOString()
    const { sender_id, receiver_id, status } = req.body
    const invitation = await Invitation.create({
      id: uuidv4(),
      sender_id,
      receiver_id,
      status,
      created_at: now,
      updated_at: now
    })

    return res.json(invitation)
  } catch (error) {
    console.error('Error:', error)
    return res
      .status(409)
      .json({ error: 'Conflict', message: error.original.message })
  }
}

export const updateInvitation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { sender_id, receiver_id, status } = req.body

    const invitation = await Invitation.findOne({ where: { id } })

    if (!invitation) {
      return res.status(404).json({
        error: 'Invitation not found',
        message: `Invitation with ID ${id} not found`
      })
    }

    invitation.sender_id = sender_id ?? invitation.sender_id
    invitation.receiver_id = receiver_id ?? invitation.receiver_id
    invitation.status = status ?? invitation.status

    const now = new Date().toISOString()
    invitation.updated_at = now

    await invitation.save()

    return res.json({ message: 'Invitation updated successfully', invitation })
  } catch (error) {
    console.error('Error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.original.message })
  }
}

export const deleteInvitation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const invitation = await Invitation.findOne({ where: { id } })

    if (!invitation) {
      return res.status(404).json({
        error: 'Invitation not found',
        message: `Invitation with ID ${id} not found`
      })
    }

    await invitation.destroy()

    return res.json({ message: 'Invitation deleted successfully' })
  } catch (error) {
    console.error('Error:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.original.message })
  }
}
