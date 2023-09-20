import { Model, DataTypes, ForeignKey } from 'sequelize'
import sequelize from '../config/database'
import { User } from './User'

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
    id: {
      primaryKey: true,
      type: DataTypes.UUID
    },
    game_id: {
      allowNull: false,
      type: DataTypes.STRING
    },
    user_id: {
      allowNull: true,
      type: DataTypes.UUID
    },
    created_at: {
      allowNull: false,
      type: DataTypes.STRING
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.STRING
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
