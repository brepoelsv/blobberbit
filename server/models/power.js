export default (sequelize, DataTypes) => {
  const Power = sequelize.define('Power', {
    type: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    classMethods: {
      associate: (models) => {
        Power.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Power;
};
