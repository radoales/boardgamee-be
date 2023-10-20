import { Model, DataTypes, ForeignKey } from 'sequelize'
import sequelize from '../config/database.js'
import GameEvent from './GameEvent.js'
import User from './User.js'

interface GameEventRequestAttributes {
  id: string
  game_event_id: string
  request_user_id: string
  status: 'pending' | 'accepted' | 'rejected'
  message?: string
  created_at: string
  updated_at: string
}

export class GameEventRequest extends Model<GameEventRequestAttributes> {
  declare id: string
  declare game_event_id: ForeignKey<GameEvent['id']>
  declare request_user_id: ForeignKey<User['id']>
  declare status: 'pending' | 'accepted' | 'rejected'
  declare message?: string
  declare created_at: string
  declare updated_at: string
}

GameEventRequest.init(
  {
    created_at: {
      allowNull: false,
      type: DataTypes.STRING
    },
    game_event_id: {
      allowNull: false,
      references: {
        key: 'id',
        model: 'GameEvent'
      },
      type: DataTypes.UUID
    },
    id: {
      primaryKey: true,
      type: DataTypes.UUID
    },
    message: {
      allowNull: true,
      type: DataTypes.STRING
    },
    request_user_id: {
      allowNull: false,
      references: {
        key: 'id',
        model: 'User'
      },
      type: DataTypes.UUID
    },
    status: {
      allowNull: false,
      defaultValue: 'pending',
      type: DataTypes.ENUM('pending', 'accepted', 'rejected')
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.STRING
    }
  },
  {
    modelName: 'GameEventRequest',
    sequelize,
    tableName: 'game_event_requests',
    timestamps: false
  }
)

GameEventRequest.belongsTo(GameEvent, { foreignKey: 'game_event_id' })
GameEventRequest.belongsTo(User, { foreignKey: 'request_user_id' })

export default GameEventRequest
