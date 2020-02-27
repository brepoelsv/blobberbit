export default (sequelize, DataTypes) => {
  const Score = sequelize.define('Score', {
    type: DataTypes.STRING,
    value: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {
    classMethods: {
      associate: (models) => {
        Score.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Score;
};
