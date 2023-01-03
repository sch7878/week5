const express = require('express');
const app = express();
const port = 3000;
const { sequelize } = require('./models/index.js');
const indexCall = require("./routes/index")


sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });


app.use(express.json());
app.use("/", indexCall)

app.listen(port, ()=> {

});
