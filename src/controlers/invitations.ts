/* eslint-disable no-console */
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import Invitation from '../models/Invitation.js'
import { getTimestampNow } from '../utils/constants.js'
import { Op } from 'sequelize'
import sendNotification from '../utils/notifications.js'
import User from '../models/User.js'

export const getInvitations = async (req: Request, res: Response) => {
  try {
    const invitations = await Invitation.findAll()
    return res.json(invitations)
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}

export const getInvitationByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId
    const invitations = await Invitation.findAll({
      where: {
        [Op.or]: [{ sender_id: userId }, { receiver_id: userId }]
      }
    })

    if (!invitations) {
      return res.status(404).json({
        error: 'Invitations not found',
        message: `No invitations found`
      })
    }

    return res.json(invitations)
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}

export const createInvitation = async (req: Request, res: Response) => {
  try {
    const { sender_id, receiver_id, status } = req.body
    const invitation = await Invitation.create({
      created_at: getTimestampNow(),
      id: uuidv4(),
      receiver_id,
      sender_id,
      status,
      updated_at: getTimestampNow()
    })

    const sender = await User.findByPk(sender_id)
    const receiver = await User.findByPk(receiver_id)

    if (receiver) {
      await sendNotification({
        body: `${
          sender?.name ?? sender.username ?? sender.email
        } wants to connect with you!`,
        data: { url: 'FriendsTabScreen' },
        pushTokens: [receiver.push_notification_token],
        title: 'New Friend Request'
      })
    }

    return res.json(invitation)
  } catch (error) {
    console.error('Error:', error)
    return res.status(409).json({
      error: 'Conflict',
      message: error.original?.message ?? error.message
    })
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

    invitation.updated_at = getTimestampNow()

    if (invitation.status === 1) {
      const sender = await User.findByPk(sender_id)
      const receiver = await User.findByPk(receiver_id)

      if (sender && receiver) {
        await sendNotification({
          body: `${
            receiver?.name ?? receiver.username ?? receiver.email
          } accepted your friend request!`,
          data: { url: 'FriendsTabScreen' },
          pushTokens: [sender.push_notification_token],
          title: 'Friend Request Accepted'
        })
      }
    }

    await invitation.save()

    return res.json({ invitation, message: 'Invitation updated successfully' })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
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
    return res.status(500).json({
      error: 'Internal server error',
      message: error.original?.message ?? error.message
    })
  }
}
