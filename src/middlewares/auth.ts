import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token)
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing token'
    })

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err)
      return res.status(403).json({
        error: 'Forbidden',
        message: err.message
      })
    req.user = user as User
    next()
  })
}

export default authenticateToken
