import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import User from './models/User.js'

const createServer = () => {
  const app = express()
  app.use(cors()).use(morgan('dev')).use(bodyParser.json())

  app.get('/', (req, res) => {
    res.send('Hello World')
  })

  app.listen(3000, () => {
    console.log('Server is running on port 3000')
  })

  app.get('/users', async (req, res) => {
    const users = await User.findAll()
    return res.status(200).json(users)
  })
}

export default createServer
