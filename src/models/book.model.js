import { DataTypes } from 'sequelize';
import sequelize from './../db/dbConfig.js';
import Seller from './seller.model.js';

const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.TEXT,
    },
    author: {
        type: DataTypes.TEXT,
    },
    publishDate: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.TEXT
    },
    seller_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Seller,
            key: 'id',
        },
    },
});

Seller.hasMany(Book, { foreignKey: 'seller_id' });
Book.belongsTo(Seller, { foreignKey: 'seller_id' });


export default Book;