export default {
  development: {
    username: process.env.MYSQL_LOGIN,
    password: process.env.MYSQL_PASS,
    database: `${process.env.MYSQL_DBNAME}_development`,
    host: process.env.MYSQL,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  },
  test: {
    username: process.env.MYSQL_LOGIN,
    password: process.env.MYSQL_PASS,
    database: `${process.env.MYSQL_DBNAME}_test`,
    host: process.env.MYSQL,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  },
  production: {
    username: process.env.MYSQL_LOGIN,
    password: process.env.MYSQL_PASS,
    database: `${process.env.MYSQL_DBNAME}`,
    host: process.env.MYSQL,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  }
};

export const ENV = {
  env: process.env.NODE_ENV,
  domain: process.env.DOMAIN ? process.env.DOMAIN : 'localhost',
  ip: process.env.IP ? process.env.IP : 'localhost',
  port: process.env.PORT ? process.env.PORT : '3000'
};
