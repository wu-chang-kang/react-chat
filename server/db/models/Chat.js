const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  from: { type: String, required: true }, //发送用户id
  to: { type: String, required: true }, //接受用户id
  chat_id: { type: String, required: true }, //from和to组成的字符串id
  content: { type: String, required: true }, //内容
  read: { type: Boolean, default: false }, //消息是否已读
  create_time: { type: Number, required: true } //创建时间
})

module.exports = mongoose.model('chat', schema)
