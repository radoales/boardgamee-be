import { Model, DataTypes, ForeignKey } from 'sequelize'
import sequelize from '../config/database.js'
import { User } from './User.js'

interface VisitedGameAttributes {
  id: string
  game_id: string
  user_id: string
  created_at: string
  updated_at: string
}

export class VisitedGame extends Model<VisitedGameAttributes> {
  declare id: string
  declare game_id: string
  declare user_id: ForeignKey<User['id']>
  declare created_at: string
  declare updated_at: string
}

VisitedGame.init(
  {
    created_at: {
      allowNull: false,
      type: DataTypes.STRING
    },
    game_id: {
      primaryKey: true,
      type: DataTypes.STRING
    },
    id: {
      type: DataTypes.UUID
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.STRING
    },
    user_id: {
      primaryKey: true,
      type: DataTypes.UUID
    }
  },
  {
    modelName: 'VisitedGame',
    sequelize,
    tableName: 'visited_games',
    timestamps: false
  }
)

export default VisitedGame
