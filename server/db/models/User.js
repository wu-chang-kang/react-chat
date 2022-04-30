const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  username: { type: String, required: true },
  password: {
    type: String,
    select: false, //默认是不能查出密码的
    set(val) {
      //密码的散列排布
      return require('bcrypt').hashSync(val, 10)
    }
  },
  type: { type: String, required: true }, //用户类型
  avatar: { type: String }, //头像
  post: { type: String },
  info: { type: String }, //个人简介
  company: { type: String }, //公司名称
  salary: { type: String } //薪资
})

module.exports = mongoose.model('User', schema)
