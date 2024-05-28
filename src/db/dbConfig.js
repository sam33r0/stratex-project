import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgres', process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASSWORD, {
  host: `localhost`,
  dialect: 'postgres',
});

export default sequelize;