import { Model, DataTypes, ForeignKey } from 'sequelize'
import sequelize from '../config/database.js'
import User from './User.js'
import Location from './Location.js'

interface GameEventAttributes {
  id: string
  name: string
  game_id: string
  owner_user_id: string
  created_at: string
  updated_at: string
  available_spots: number
  total_spots: number
  start_at: string
  end_at: string
  location_id: string
  location?: Location
  distance?: number
  image_url: string
  description?: string
}

export class GameEvent extends Model<GameEventAttributes> {
  declare id: string
  declare name: string
  declare game_id: string
  declare owner_user_id: ForeignKey<User['id']>
  declare created_at: string
  declare updated_at: string
  declare available_spots: number
  declare start_at: string
  declare end_at: string
  declare location_id: ForeignKey<Location['id']>
  declare image_url: string
  declare total_spots: number
  declare description?: string
}

GameEvent.init(
  {
    available_spots: {
      allowNull: false,
      type: DataTypes.NUMBER
    },
    created_at: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING
    },
    end_at: {
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
    image_url: {
      allowNull: true,
      type: DataTypes.STRING
    },
    location_id: {
      allowNull: false,
      type: DataTypes.STRING
    },
    name: {
      allowNull: true,
      type: DataTypes.STRING
    },
    owner_user_id: {
      allowNull: false,
      type: DataTypes.STRING
    },
    start_at: {
      allowNull: false,
      type: DataTypes.STRING
    },
    total_spots: {
      allowNull: false,
      type: DataTypes.NUMBER
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.STRING
    }
  },
  {
    modelName: 'GameEvent',
    sequelize,
    tableName: 'game_events',
    timestamps: false
  }
)

GameEvent.belongsTo(Location, { as: 'location', foreignKey: 'location_id' })

export default GameEvent
