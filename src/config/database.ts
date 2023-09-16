import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
        require: true
      }
    },
    host: process.env.PGHOST
  }
)

export default sequelize
