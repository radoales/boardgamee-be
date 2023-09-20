import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import usersRouter from './routes/users'
import invitationsRouter from './routes/invitations'
import authRouter from './routes/auth'
import compression from 'compression'
import authenticateToken from './middlewares/auth'
import userGamesRouter from './routes/userGames'

const createServer = () => {
  const app = express()

  app
    .use(cors())
    .use(morgan('dev'))
    .use(bodyParser.json())
    .use(compression())
    .use('/api/users', authenticateToken, usersRouter)
    .use('/api/invitations', authenticateToken, invitationsRouter)
    .use('/api/usergames', authenticateToken, userGamesRouter)
    .use('/api/auth', authRouter)

  app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log('Running on port 3000')
  })

  return app
}

export default createServer
