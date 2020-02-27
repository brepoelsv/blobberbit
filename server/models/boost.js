export default (sequelize, DataTypes) => {
  const Boost = sequelize.define('Boost', {
    boostId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: DataTypes.STRING,
    rate: DataTypes.INTEGER,
    time: DataTypes.INTEGER,
    end: DataTypes.DATE
  }, {
    indexes: [{
      fields: ['boostId']
    }],
    classMethods: {
      associate: (models) => {
        Boost.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Boost;
};
