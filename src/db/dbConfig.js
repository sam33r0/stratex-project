import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('stratex', process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASSWORD, {
  host: `localhost`,
  dialect: 'postgres',
  logging: false
});

export default sequelize;