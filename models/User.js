const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('customer', 'admin'), defaultValue: 'customer' },
    phone: { type: DataTypes.STRING },
    street: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    zipCode: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    avatar: { type: DataTypes.TEXT }  // base64 image string
}, { tableName: 'users', timestamps: true });

User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});
User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

User.prototype.comparePassword = async function(candidate) {
    return bcrypt.compare(candidate, this.password);
};
User.prototype.toSafeJSON = function() {
    const v = this.toJSON();
    delete v.password;
    return v;
};

module.exports = User;
