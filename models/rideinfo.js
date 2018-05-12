'use strict';
module.exports = (sequelize, DataTypes) => {
  var rideInfo = sequelize.define('rideInfo', {
    startPoint: DataTypes.STRING,
    endPoint: DataTypes.STRING,
    costEst: DataTypes.INTEGER,
    costAct: DataTypes.INTEGER,
    receipts: DataTypes.INTEGER
  }, {});
  rideInfo.associate = function(models) {
    // associations can be defined here
  };
  return rideInfo;
};