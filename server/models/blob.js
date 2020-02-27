export default (sequelize, DataTypes) => {
  const Blob = sequelize.define('Blob', {
    name: DataTypes.STRING,
    mass: DataTypes.INTEGER,
    radius: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {
    classMethods: {
      associate: (models) => {
        Blob.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Blob;
};
