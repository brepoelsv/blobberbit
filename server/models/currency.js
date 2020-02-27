export default (sequelize, DataTypes) => {
  const Currency = sequelize.define('Currency', {
    currencyId: DataTypes.INTEGER,
    json: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10, 2),
    enabled: DataTypes.BOOLEAN
  }, {
    indexes: [{
      unique: true,
      fields: ['currencyId']
    }]
  });
  return Currency;
};
