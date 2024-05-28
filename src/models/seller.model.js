import { DataTypes } from 'sequelize';
import sequelize from './../db/dbConfig.js';

const Seller = sequelize.define('Seller', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.TEXT,
    },
    email: {
        type: DataTypes.TEXT,
    },
    password: {
        type: DataTypes.TEXT,
    },
    ref_token: {
        type: DataTypes.TEXT
    }
});

export default Seller;