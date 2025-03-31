// models/userModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.UUID, // Use UUID for userId
    defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  emailId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  preferences: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
  accountStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['username']
    }
  ],
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
