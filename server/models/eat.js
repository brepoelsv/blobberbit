export default (sequelize, DataTypes) => {
  const Eat = sequelize.define('Eat', {
    type: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    classMethods: {
      associate: (models) => {
        Eat.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Eat;
};
