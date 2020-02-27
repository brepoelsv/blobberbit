export default (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    transactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    orderId: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    indexes: [{
      unique: true,
      fields: ['transactionId']
    }],
    classMethods: {
      associate: (models) => {
        Transaction.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Transaction;
};
