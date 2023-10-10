import { Model, DataTypes, ForeignKey } from 'sequelize'
import sequelize from '../config/database.js'
import { User } from './User.js'

interface UserGameAttributes {
  id: string
  game_id: string
  user_id: string
  created_at: string
  updated_at: string
}

export class UserGame extends Model<UserGameAttributes> {
  declare id: string
  declare game_id: string
  declare user_id: ForeignKey<User['id']>
  declare created_at: string
  declare updated_at: string
}

UserGame.init(
  {
    created_at: {
      allowNull: false,
      type: DataTypes.STRING
    },
    game_id: {
      allowNull: false,
      type: DataTypes.STRING
    },
    id: {
      primaryKey: true,
      type: DataTypes.UUID
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.STRING
    },
    user_id: {
      allowNull: true,
      type: DataTypes.UUID
    }
  },
  {
    modelName: 'UserGame',
    sequelize,
    tableName: 'users_games',
    timestamps: false
  }
)

export default UserGame
