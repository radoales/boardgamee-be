import request from 'supertest'
import User from '../../models/User'
import UserGame from '../../models/UserGame'
import createServer from '../../server'
import { NOW } from '../../utils/constants'

describe('UserGame controller', () => {
  let userGame: UserGame
  let user: User

  beforeAll(async () => {
    // Create a new user
    user = await User.create({
      id: 'd4c924c5-6f6c-4c3e-8d2d-4d7d4d7d4d7d',
      name: 'John Doe',
      email: 'john.doe@example.com',
      created_at: NOW,
      updated_at: NOW,
      external_id: '',
      push_notification_token: '',
      username: ''
    })
  })

  afterAll(async () => {
    // Delete the user and userGame records
    await user.destroy()
    await userGame.destroy()
  })

  describe('GET /usergames', () => {
    it('should return an empty array', async () => {
      const response = await request(createServer).get('/usergames')
      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })
  })

  // describe('POST /usergames', () => {
  //   it('should create a new userGame record', async () => {
  //     const payload = {
  //       game_id: '1',
  //       user_id: user.id,
  //       created_at: NOW,
  //       updated_at: NOW
  //     }

  //     const response = await request(createServer)
  //       .post('/usergames')
  //       .send(payload)

  //     expect(response.status).toBe(200)
  //     expect(response.body).toMatchObject(payload)

  //     userGame = await UserGame.findByPk(response.body.id)
  //     expect(userGame).toMatchObject(payload)
  //   })

  //   it('should return a 404 error if user does not exist', async () => {
  //     const payload = {
  //       game_id: '1',
  //       user_id: 'd4c924c5-6f6c-4c3e-8d2d-4d7d4d7d4d7d'
  //     }

  //     const response = await request(createServer)
  //       .post('/usergames')
  //       .send(payload)

  //     expect(response.status).toBe(404)
  //     expect(response.body).toMatchObject({
  //       error: 'User not found',
  //       message: `User with ID ${payload.user_id} not found`
  //     })
  //   })

  //   it('should return a 409 error if userGame already exists', async () => {
  //     const payload = {
  //       game_id: '1',
  //       user_id: user.id,
  //       created_at: NOW,
  //       updated_at: NOW
  //     }

  //     const response = await request(createServer)
  //       .post('/usergames')
  //       .send(payload)

  //     expect(response.status).toBe(409)
  //     expect(response.body).toMatchObject({
  //       error: 'Conflict',
  //       message: 'Validation error'
  //     })
  //   })
  // })

  // describe('GET /usergames/:id', () => {
  //   it('should return a userGame record by ID', async () => {
  //     const response = await request(createServer).get(
  //       `/usergames/${userGame.id}`
  //     )

  //     expect(response.status).toBe(200)
  //     expect(response.body).toMatchObject({
  //       id: userGame.id,
  //       game_id: userGame.game_id,
  //       user_id: userGame.user_id
  //     })
  //   })

  //   it('should return a 404 error if userGame does not exist', async () => {
  //     const response = await request(createServer).get('/usergames/123')

  //     expect(response.status).toBe(404)
  //     expect(response.body).toMatchObject({
  //       error: 'UserGame not found',
  //       message: 'UserGame with ID 123 not found'
  //     })
  //   })
  // })

  // describe('PUT /usergames/:id', () => {
  //   it('should update a userGame record by ID', async () => {
  //     const payload = {
  //       game_id: '2',
  //       user_id: user.id
  //     }

  //     const response = await request(createServer)
  //       .put(`/usergames/${userGame.id}`)
  //       .send(payload)

  //     expect(response.status).toBe(200)
  //     expect(response.body).toMatchObject({
  //       message: 'UserGame updated successfully',
  //       userGame: {
  //         id: userGame.id,
  //         game_id: payload.game_id,
  //         user_id: payload.user_id
  //       }
  //     })

  //     userGame = await UserGame.findByPk(userGame.id)
  //     expect(userGame).toMatchObject(payload)
  //   })

  //   it('should return a 404 error if userGame does not exist', async () => {
  //     const payload = {
  //       game_id: '2',
  //       user_id: user.id
  //     }

  //     const response = await request(createServer)
  //       .put('/usergames/123')
  //       .send(payload)

  //     expect(response.status).toBe(404)
  //     expect(response.body).toMatchObject({
  //       error: 'UserGame not found',
  //       message: 'UserGame with ID 123 not found'
  //     })
  //   })

  //   it('should return a 404 error if user does not exist', async () => {
  //     const payload = {
  //       game_id: '2',
  //       user_id: 'd4c924c5-6f6c-4c3e-8d2d-4d7d4d7d4d7d'
  //     }

  //     const response = await request(createServer)
  //       .put(`/usergames/${userGame.id}`)
  //       .send(payload)

  //     expect(response.status).toBe(404)
  //     expect(response.body).toMatchObject({
  //       error: 'User not found',
  //       message: `User with ID ${payload.user_id} not found`
  //     })
  //   })
  // })

  // describe('DELETE /usergames/:id', () => {
  //   it('should delete a userGame record by ID', async () => {
  //     const response = await request(createServer).delete(
  //       `/usergames/${userGame.id}`
  //     )

  //     expect(response.status).toBe(200)
  //     expect(response.body).toMatchObject({
  //       message: 'UserGame deleted successfully'
  //     })

  //     userGame = await UserGame.findByPk(userGame.id)
  //     expect(userGame).toBeNull()
  //   })

  //   it('should return a 404 error if userGame does not exist', async () => {
  //     const response = await request(createServer).delete('/usergames/123')

  //     expect(response.status).toBe(404)
  //     expect(response.body).toMatchObject({
  //       error: 'UserGame not found',
  //       message: 'UserGame with ID 123 not found'
  //     })
  //   })
  // })
})
