const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", {//password required next to root
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
