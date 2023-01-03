//router 생성
const express = require('express');
const router = express.Router();
const { Users } = require('../models/index.js')
const { Op } = require("sequelize");
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken");

router.use(cookieParser());

//회원가입
router.post("/signup", async (req, res) => {
  const { nickname, password, confirm } = req.body;
  console.log(nickname, password, confirm)

  const createdAt = new Date();
  createdAt.setHours(createdAt.getHours() + 9);

  const updatedAt = new Date();
  updatedAt.setHours(updatedAt.getHours() + 9);
  const checkNickname = /^[A-z0-9]+$/
  const exitstNickname = await Users.findAll({attributes: ['nickname'], 
    where : {nickname:nickname}
  })

  try {
    if (checkNickname.test(nickname) && nickname.length < 3) {
      return res.status(412).json({
        success: false,
        errorMessage: "닉네임의 형식이 일치하지 않습니다.",
      })
    }

    if (password !== confirm) {
      return res.status(412).json({
        success: false,
        errorMessage: "패스워드가 일치하지 않습니다.",
      })
    }

    if (password.length < 4) {
      return res.status(412).json({
        success: false,
        errorMessage: "패스워드 형식이 일치하지 않습니다",
      })
    }
    if (password.search(nickname) !== -1) {
      return res.status(412).json({
        success: false,
        errorMessage: "패스워드에 닉네임이 포함되어 있습니다.",
      })
    }
    if (exitstNickname.length) {
      return res.status(412).json({
        success: false,
        errorMessage: "중복된 닉네임입니다.",
      })
    }

    await Users.create({ nickname, password });
    return res.status(201).json({
      success : true,
      Message : "회원 가입에 성공하였습니다.",
    });

  } catch (err) {
    console.log(err)
    return res.status(400).json({
      success: false,
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    })

  }

})


//로그인
router.post('/login',async(req,res)=> {
  const {nickname, password} = req.body;
  const user = await Users.findOne({ 
    where : {nickname:nickname, password:password}
  })
  
  try {
  if(!user) {
    return res.status(400).json({
      success: false,
      errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
    })
  }
  if(password !== user.password) {
    return res.status(400).json({
      success: false,
      errorMessage: "닉네임 또는 패스워드를 확인해주세요..",
    })
  }
  
  const token = jwt.sign({ userId: user.userId }, "sparta-secret-key")
  res.cookie('Authorization', `Bearer ${token}`);
  return res.send({
    token: token,
  });
  }  catch (err) {
      console.log(err)
      return res.status(400).json({
        success: false,
        errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
      })
  }


})

module.exports = router;