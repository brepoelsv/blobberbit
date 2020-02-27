export default (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    json: DataTypes.TEXT,
    enabled: DataTypes.BOOLEAN
  }, {
    indexes: [{
      unique: true,
      fields: ['itemId']
    }],
    classMethods: {
      associate: (models) => {
        Item.belongsToMany(models.Group, {
          through: 'ItemsGroups',
          foreignKey: 'itemId',
          otherKey: 'groupId'
        });
        Item.belongsToMany(models.User, {
          through: 'ItemsPurchases',
          foreignKey: 'itemId',
          otherKey: 'userId'
        });
      }
    }
  });
  return Item;
};
