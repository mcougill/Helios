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
                type: Sequelize.FLOAT(2)
            },
            costAct: {
                type: Sequelize.FLOAT(2)
            },
            receipts: {
                type: Sequelize.STRING
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