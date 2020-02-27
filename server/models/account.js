export default (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    key: DataTypes.STRING(100),
    value: DataTypes.STRING(100)
  }, {
    indexes: [{
      unique: true,
      fields: ['key', 'UserId']
    }],
    classMethods: {
      associate: (models) => {
        Account.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Account;
};
