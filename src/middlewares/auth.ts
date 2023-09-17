import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Middleware to protect routes
function authenticateToken(
  req: Request<User>,
  res: Response,
  next: NextFunction
) {
  const token = req.header('Authorization')
  if (!token) return res.status(401).send('Access denied.')

  jwt.verify(token, process.env.SECRET_KEY, (err, user: User) => {
    if (err) return res.status(403).send('Invalid token.')
    next()
  })
}

export default authenticateToken
