module.exports = app => {
  const userRouter = require('../routes/users')
  const chatRouter = require('../routes/chat')
  //登录校验中间件,要进行请求头的验证
  const authMiddleware = require('../middleware/auth')
  app.use('/api/users', userRouter)
  app.use('/api/chat', authMiddleware(), chatRouter)
}
