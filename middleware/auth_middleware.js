const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();
const cookieParser = require('cookie-parser')
const {Users} = require("../models");
router.use(cookieParser());
require("dotenv").config();

module.exports = router.use (async(req, res, next) => {
    const {Authorization} = req.cookies;

    const [authType, authToken] = (Authorization || "").split(" ")

    console.log(authToken)

  
    if ( authType !== "Bearer") {
      res.status(401).send({
        errorMessage: "로그인 후 이용 가능한 기능입니다..",
      });
      return;
    }
  
    try {
      const {userId} = jwt.verify(authToken, process.env.JWT_KEY );
      await Users.findOne({where : {userId}}).then((user) => {
        res.locals.user = user;
       next();
      });
    } catch (err) {
      console.log(err)
      res.status(401).send({
        errorMessage: "로그인 후 이용 가능한 기능입니다.",
      });
      return;
    }

  });