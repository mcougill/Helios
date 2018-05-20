'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    googleID: DataTypes.STRING,
    currentpickLat: DataTypes.DECIMAL(11, 8),
    currentpickLng: DataTypes.DECIMAL(11, 8),
    currentdestLat: DataTypes.DECIMAL(11, 8),
    currentdestLng: DataTypes.DECIMAL(11, 8),
    currentType: DataTypes.STRING,
    currentRide: DataTypes.STRING,
    facebookID: DataTypes.STRING
  }, {});
  user.associate = function(models) {
      user.hasMany(models.rideInfo);
    // associations can be defined here
  };
  return user;
};