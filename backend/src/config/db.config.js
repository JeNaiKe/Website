require("dotenv").config();

const config = {
  DB: "d4j7pe9jmbrl14",
  USER: "jtghqnkdrqmeuu",
  PASSWORD: "f51270bf8213acda05c776dbbc64e21bd0b0aa7e72f2a16e5959b5551f014a2e",
  HOST: "ec2-44-205-41-76.compute-1.amazonaws.com",
  PORT: "5432",
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 10, //maximum number of connections in pool
    min: 0, //minimum number of connections in pool
    acquire: 30000, //maximum time (ms), that pool will try to get connection before throwing error
    idle: 10000, //maximum time (ms) that a connection can be idle before being released
  },
};

module.exports = config;
