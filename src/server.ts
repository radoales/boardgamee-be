import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import usersRouter from './routes/users.js'
import invitationsRouter from './routes/invitations.js'
import authRouter from './routes/auth.js'
import compression from 'compression'
import authenticateToken from './middlewares/auth.js'

const createServer = () => {
  const app = express()

  app
    .use(cors())
    .use(morgan('dev'))
    .use(bodyParser.json())
    .use(compression())
    .use('/api/users', authenticateToken, usersRouter)
    .use('/api/invitations', invitationsRouter)
    .use('/api/auth', authRouter)

  app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log('Running on port 3000')
  })

  return app
}

export default createServer
