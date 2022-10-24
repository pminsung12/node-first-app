/*
root file for Node.js application
*/
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express(); //app은 express함수가 반환한 객체를 담게 되는데 많은 내용을 담고 있다. 또한 유효한 요청 핸들러이기도 하다.

app.set("view engine", "ejs"); //express에 스스로를 자동으로 등록
app.set("views", "views"); //default긴하지만 그래도 적어줌

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// db.execute("SELECT * FROM products")
//   .then((result) => {
//     console.log(result[0], result[1]);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.use(bodyParser.urlencoded({ extended: false })); //extended false 비표준 대상의 분석이 가능한지를 나타낸다.
app.use(express.static(path.join(__dirname, "public"))); //읽기 액세스를 허용하고 하는 폴더 경로 넘기기

app.use((req, res, next) => {
  //app. use는 들어오는 요청에 대해 미들웨어로 등록
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes); //admin.js에서 내보낸 객체만 넣어주면 됨.
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" }); //사용자가 이 제품을 생성함.
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({ force: true }) //강제로 덮어쓰도록
  .sync()
  .then((result) => {
    return User.findByPk(1); //유저가 있다면
    //console.log(result);
    app.listen(3000);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Max", email: "test@test.com" });
    }
    return user; //즉시 사용자를 확인하는 promise
  })
  .then((user) => {
    // console.log(user);
    return user.createCart();
  })
  .then((cart) => {
    app.listen(3000); // 서버 수신
  })
  .catch((err) => {
    console.log(err);
  }); //

// const server = http.createServer(app);

// server.listen(3000); //포트번호(qhxhd 1000번대 다 괜찮음), 현재 사용하고 있는 가상머신(지금의 경우 localhost)
