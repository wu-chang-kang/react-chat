module.exports = (app) => {
  const mongoose = require('mongoose')
  mongoose.connect(
    'mongodb://127.0.0.1:27017/recruitment-demo',
    {
      useNewUrlParser: true
    },
    (err) => {
      if (!err) {
        console.log('数据库链接成功')
      } else {
        console.log(err)
      }
    }
  )
}
