import { DataTypes } from 'sequelize';
import sequelize from './../db/dbConfig.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const User = sequelize.define('User', {
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

User.beforeCreate(asyncHandler(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
}));

User.prototype.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
export default User;