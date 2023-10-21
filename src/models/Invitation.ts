import { Model, DataTypes, ForeignKey } from 'sequelize'
import sequelize from '../config/database.js'
import User from './User.js'

interface InvitationAttributes {
  id: string
  sender_id: string
  receiver_id: string
  status: number
  created_at: string
  updated_at: string
}

export class Invitation extends Model<InvitationAttributes> {
  declare id: string
  declare sender_id: ForeignKey<User['id']>
  declare receiver_id: ForeignKey<User['id']>
  declare status: number
  declare created_at: string
  declare updated_at: string
}

Invitation.init(
  {
    created_at: {
      allowNull: false,
      type: DataTypes.STRING
    },
    id: {
      primaryKey: true,
      type: DataTypes.UUID
    },
    receiver_id: {
      allowNull: false,
      type: DataTypes.UUID
    },
    sender_id: {
      allowNull: false,
      type: DataTypes.UUID
    },
    status: {
      allowNull: false,
      type: DataTypes.SMALLINT
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.STRING
    }
  },
  {
    modelName: 'Invitation',
    sequelize,
    tableName: 'invitations',
    timestamps: false
  }
)

export default Invitation
