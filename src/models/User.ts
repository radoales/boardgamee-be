import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

interface UserAttributes {
  id: string
  name: string
  email: string
  username: string
  created_at: string
  updated_at: string
  push_notification_token: string
}

export class User extends Model<UserAttributes> {
  declare id: string
  declare name: string
  declare email: string
  declare username: string
  declare created_at: string
  declare updated_at: string
  declare push_notification_token: string
}

User.init(
  {
    created_at: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    id: {
      primaryKey: true,
      type: DataTypes.UUID
    },
    name: {
      allowNull: true,
      type: DataTypes.STRING
    },
    push_notification_token: {
      allowNull: true,
      type: DataTypes.STRING
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.STRING
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING
    }
  },
  { modelName: 'User', sequelize, tableName: 'users', timestamps: false }
)

export default User
