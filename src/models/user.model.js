import { DataTypes } from 'sequelize';
import sequelize from './../db/dbConfig.js';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
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

User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

User.prototype.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

User.prototype.generateAccessToken = function(){
    return jwt.sign(
        {
            id: this.id,
            email: this.email,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

User.prototype.generateRefreshToken = function(){
    return jwt.sign(
        {
            id: this.id,
            email: this.email,
            name: this.name
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export default User;