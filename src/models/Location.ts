import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

interface UserAttributes {
  id: string
  name: string
  address: string
  city: string
  country: string
  zip: string
  created_at: string
  updated_at: string
}

export class Location extends Model<UserAttributes> {
  declare id: string
  declare name: string
  declare address: string
  declare city: string
  declare created_at: string
  declare updated_at: string
  declare country: string
  declare zip: string
}

Location.init(
  {
    address: {
      allowNull: false,
      type: DataTypes.STRING
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING
    },
    country: {
      allowNull: false,
      type: DataTypes.STRING
    },
    created_at: {
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
    updated_at: {
      allowNull: false,
      type: DataTypes.STRING
    },
    zip: {
      allowNull: false,
      type: DataTypes.STRING
    }
  },
  {
    modelName: 'Location',
    sequelize,
    tableName: 'locations',
    timestamps: false
  }
)

export default Location
