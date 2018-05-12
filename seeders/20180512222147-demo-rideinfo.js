'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('rideinfos', [{
        startPoint: 'Houston',
        endPoint: 'Austin',
        costEst: 250.53,
        costAct: 275.69,
        receipts: '255.69 3859',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('rideinfos', null, {});
  }
};
