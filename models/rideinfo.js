'use strict';
module.exports = (sequelize, DataTypes) => {
  var rideInfo = sequelize.define('rideInfo', {
    startPoint: DataTypes.STRING,
    endPoint: DataTypes.STRING,
    costEst: DataTypes.FLOAT(2),
    costAct: DataTypes.FLOAT(2),
    receipts: DataTypes.STRING
  }, {});
  rideInfo.associate = function(models) {
      rideInfo.belongsTo(models.user);
    // associations can be defined here
  };
  return rideInfo;
};