import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import usersRouter from './routes/users.js'
import invitationsRouter from './routes/invitations.js'
import authRouter from './routes/auth.js'
import compression from 'compression'
import authenticateToken from './middlewares/auth.js'
import userGamesRouter from './routes/userGames.js'
import visitedGamesRouter from './routes/visitedGames.js'
import appInsights from 'applicationinsights'

const createServer = () => {
  appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
  appInsights.start()

  const app = express()
  app
    .use(cors())
    .use(morgan('dev'))
    .use(bodyParser.json())
    .use(compression())
    .use('/api/users', authenticateToken, usersRouter)
    .use('/api/invitations', authenticateToken, invitationsRouter)
    .use('/api/usergames', authenticateToken, userGamesRouter)
    .use('/api/visitedgames', authenticateToken, visitedGamesRouter)
    .use('/api/auth', authRouter)

  app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log('Running on port 3000')
  })

  return app
}

export default createServer
