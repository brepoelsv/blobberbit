export default (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    key: DataTypes.STRING(100),
    value: DataTypes.STRING(100)
  }, {
    indexes: [{
      unique: true,
      fields: ['key', 'UserId']
    }],
    classMethods: {
      associate: (models) => {
        Setting.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Setting;
};
