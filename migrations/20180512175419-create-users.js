'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            firstName: {
                type: Sequelize.STRING
            },
            lastName: {
                type: Sequelize.STRING
            },
            username: {
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING
            },
            googleID: {
                type: Sequelize.STRING
            },
            currentpickLat: {
                type: Sequelize.DECIMAL(11, 8)
            },
            currentpickLng: {
                type: Sequelize.DECIMAL(11, 8)
            },
            currentdestLat: {
                type: Sequelize.DECIMAL(11, 8)
            },
            currentdestLng: {
                type: Sequelize.DECIMAL(11, 8)
            },
            currentRide: {
                type: Sequelize.STRING
            },
            currentToken: {
                type: Sequelize.STRING
            },
            facebookID: {
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
        return queryInterface.dropTable('users');
    }
};