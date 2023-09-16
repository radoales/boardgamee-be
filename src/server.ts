import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import router from './routes/users.js'
import compression from 'compression'

const createServer = () => {
  const app = express()

  app
    .use(cors())
    .use(morgan('dev'))
    .use(bodyParser.json())
    .use(compression())
    .use('/api', router)

  app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log('Server is running on port 3000')
  })

  return app
}

export default createServer
