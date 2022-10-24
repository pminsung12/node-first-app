const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "pms1227", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
