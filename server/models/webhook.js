export default (sequelize, DataTypes) => {
  const Webhook = sequelize.define('Webhook', {
    type: DataTypes.STRING,
    json: DataTypes.TEXT
  }, {
    classMethods: {
      associate: (models) => {
        Webhook.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Webhook;
};
