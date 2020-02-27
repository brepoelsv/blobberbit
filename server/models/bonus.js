export default (sequelize, DataTypes) => {
  const Bonus = sequelize.define('Bonus', {
    type: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    classMethods: {
      associate: (models) => {
        Bonus.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Bonus;
};
