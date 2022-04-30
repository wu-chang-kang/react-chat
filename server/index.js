const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// 密钥
app.set('secret', 'asdasdasdasdasfvdsgdfghgfhjghj15rt6y15t541561')
// 跨域
app.use(require('cors')())
// post请求
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

require('./db/db')(app)
require('./routes/index')(app)

let httpServer = require('http').Server(app)
require('./socket/index')(httpServer)

httpServer.listen(4000, () => {
  console.log('running http://localhost:4000')
})
