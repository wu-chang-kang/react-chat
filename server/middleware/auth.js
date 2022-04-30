//登录验证中间件
module.exports = options => {
  return async (req, res, next) => {
    const jwt = require('jsonwebtoken')
    const User = require('../db/models/User')
    //进行分割获取,因为之前前端有Bearer ,所以分割一下
    const token = String(req.headers.authorization || '')
      .split(' ')
      .pop()
    //token不能为空,否则jwt.verify无法进行
    if (!token) {
      return res.status(401).send({ code: 2, msg: '请先登录' })
    }
    try {
      //token解密出来获取到id,req.app与index.js中的app是等同的
      const { _id } = jwt.verify(token, req.app.get('secret'))
      req.user = await User.findById(_id)
      if (!req.user) {
        return res
          .status(401)
          .send({ code: 2, msg: '用户信息异常，请重新登录' })
      }
      await next()
    } catch (err) {
      return res.status(401).send({ code: 2, msg: '用户信息异常，请重新登录' })
    }
  }
}
