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
import categoiesRouter from './routes/categories.js'
import locationsRouter from './routes/locations.js'
import gameEventsRouter from './routes/gameEvents.js'
import gameEventRequestsRouter from './routes/gameEventRequests.js'

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
    .use('/api/visitedgames', authenticateToken, visitedGamesRouter)
    .use('/api/categories', authenticateToken, categoiesRouter)
    .use('/api/locations', authenticateToken, locationsRouter)
    .use('/api/gameevents', authenticateToken, gameEventsRouter)
    .use('/api/gameeventrequests', authenticateToken, gameEventRequestsRouter)
    .use('/api/auth', authRouter)

  app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log('Running on port 3000')
  })

  return app
}

export default createServer
