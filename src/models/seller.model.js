import { DataTypes } from 'sequelize';
import sequelize from './../db/dbConfig.js';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
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

Seller.beforeCreate(async (seller) => {
    const salt = await bcrypt.genSalt(10);
    seller.password = await bcrypt.hash(seller.password, salt);
});

Seller.prototype.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

Seller.prototype.generateAccessToken = function(){
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

Seller.prototype.generateRefreshToken = function(){
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

export default Seller;