'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    googleID: DataTypes.STRING,
    facebookID: DataTypes.STRING
  }, {});
  user.associate = function(models) {
      user.hasMany(models.rideInfo);
    // associations can be defined here
  };
  return user;
};