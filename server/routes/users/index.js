const express = require('express')
const User = require('../../db/models/User')
const jwt = require('jsonwebtoken')
const router = express.Router()
const authMiddleware = require('../../middleware/auth')

router.post('/register', async (req, res) => {
  // 有三个，只用哪一个出来验证
  const { username } = req.body
  if (!username) {
    return res.status(400).send({ code: 2, msg: '请求参数有误' })
  }
  //查找数据库
  const user = await User.findOne({ username })
  if (user) {
    res.status(422).send({ code: 1, msg: '此用户已存在' })
  } else {
    const newUser = await User.create(req.body)
    const token = jwt.sign({ _id: newUser._id }, req.app.get('secret'), {
      expiresIn: 60 // 1分钟过期
    })
    res.send({ code: 0, token, msg: '创建成功' })
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  //1.根据用户名找用户
  //因为前面默认是不取出password,这里在校验面的时候必须要取出,使用select("+passwrod")
  const user = await User.findOne({ username }).select('+password')

  if (!user) {
    return res.status(422).send({ code: 1, msg: '用户名或密码错误' })
  }
  //2.校验密码
  const isValid = require('bcrypt').compareSync(password, user.password)

  if (!isValid) {
    return res.status(422).send({ code: 1, msg: '用户名或密码错误' })
  }
  //3.返回token
  //这个可以放多个数据
  // jwt.sign({ _id: user.id, id: user.id, username: user.username });
  //因为是根据id进行查找,所以这里只放用户的id
  //app.get得到之前在index.js里面设置的密钥

  const token = jwt.sign({ _id: user._id }, req.app.get('secret'), {
    expiresIn: 60 // 1分钟
  })
  res.send({ token, msg: '登录成功' })
})

router.post('/update', authMiddleware(), async (req, res) => {
  const user = req.body
  // req.user是中间件发送过来的用户请求体
  User.updateOne(req.user, user, (err) => {
    if (err) {
      res.status(401).send({ code: 2, msg: '用户信息异常，请重新登录' })
    } else {
      const { _id, username, type } = req.user
      const data = Object.assign(user, { _id, username, type })
      res.send({ code: 0, msg: '信息更新成功', data })
    }
  })
})
//获取用户信息
router.get('/userInfo', authMiddleware(), async (req, res) => {
  // req.user是中间件发送过来的用户请求体
  const data = { ...req.user._doc }
  const token = jwt.sign(data, req.app.get('secret'), {
    expiresIn: 60 * 60 * 1 // 1小时过期
  })
  res.send({ code: 0, token, data: req.user })
})
module.exports = router
