'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  
   return queryInterface.addConstraint('Todos', 
   { 
    fields:['UserId'], 
    type: 'foreign key',
    name : 'custom_key_UserId',
    references: {
      table: 'Users',
      field:'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
    
    });

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.dropTable('Todos', 'custom_key_UserId', {});

  }
};
