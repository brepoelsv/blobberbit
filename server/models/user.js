export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: DataTypes.STRING,
    username: DataTypes.STRING,
    displayName: DataTypes.STRING,
    provider: DataTypes.STRING
  }, {
    indexes: [{
      fields: ['id', 'userId']
    }],
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Setting);
        User.hasMany(models.Bonus);
        User.hasMany(models.Blob);
        User.hasMany(models.Eat);
        User.hasMany(models.Power);
        User.hasMany(models.Score);
        User.hasMany(models.Account);
        User.hasMany(models.Webhook);
        User.hasMany(models.Transaction);
        User.belongsToMany(models.Item, {
          through: 'ItemsPurchases',
          foreignKey: 'userId',
          otherKey: 'itemId'
        });
        User.hasMany(models.Boost);
      }
    }
  });
  return User;
};
