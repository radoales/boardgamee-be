import { Model, DataTypes, ForeignKey } from 'sequelize'
import sequelize from '../config/database.js'
import { User } from './User.js'

interface AuthAttributes {
  id: string
  user_id: string
  password: string
  created_at: string
  updated_at: string
  refresh_token?: string
}

export class Auth extends Model<AuthAttributes> {
  declare id: string
  declare user_id: ForeignKey<User['id']>
  declare password: string
  declare created_at: string
  declare updated_at: string
  declare refresh_token?: string
}

Auth.init(
  {
    created_at: {
      allowNull: false,
      type: DataTypes.STRING
    },
    id: {
      primaryKey: true,
      type: DataTypes.UUID
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    refresh_token: {
      type: DataTypes.STRING
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.STRING
    },
    user_id: {
      allowNull: false,
      type: DataTypes.UUID
    }
  },
  {
    modelName: 'Auth',
    sequelize,
    tableName: 'auth',
    timestamps: false
  }
)

export default Auth
