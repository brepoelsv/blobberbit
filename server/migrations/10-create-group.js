export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Groups', {
      groupId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      parentId: {
        type: Sequelize.INTEGER
      },
      json: {
        type: Sequelize.TEXT
      },
      has_groups: {
        type: Sequelize.BOOLEAN
      },
      has_virtual_items: {
        type: Sequelize.BOOLEAN
      },
      enabled: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('Groups');
  }
};
