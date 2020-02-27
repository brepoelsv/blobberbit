export default (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    parentId: DataTypes.INTEGER,
    json: DataTypes.TEXT,
    has_groups: DataTypes.BOOLEAN,
    has_virtual_items: DataTypes.BOOLEAN,
    enabled: DataTypes.BOOLEAN
  }, {
    indexes: [{
      unique: true,
      fields: ['groupId']
    }],
    classMethods: {
      associate: (models) => {
        Group.belongsToMany(models.Item, {
          through: 'ItemsGroups',
          foreignKey: 'groupId',
          otherKey: 'itemId'
        });
      }
    }
  });
  return Group;
};
