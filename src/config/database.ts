import { Sequelize } from 'sequelize-typescript'

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
        require: true
      }
    },
    host: process.env.PGHOST
  }
)

export default sequelize
