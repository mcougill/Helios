'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rideInfos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      startPoint: {
        type: Sequelize.STRING
      },
      endPoint: {
        type: Sequelize.STRING
      },
      costEst: {
        type: Sequelize.INTEGER
      },
      costAct: {
        type: Sequelize.INTEGER
      },
      receipts: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rideInfos');
  }
};