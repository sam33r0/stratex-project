import sequelize from './dbConfig.js';
async function connect() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Sync all models
    await sequelize.sync();
    console.log('All models were synchronized successfully.');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export default connect;