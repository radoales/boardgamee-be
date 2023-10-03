import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

interface CategoryAttributes {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export class Category extends Model<CategoryAttributes> {
  declare id: string
  declare name: string
  declare created_at: string
  declare updated_at: string
}

Category.init(
  {
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
    }
  },
  {
    modelName: 'Category',
    sequelize,
    tableName: 'categories',
    timestamps: false
  }
)

export default Category
