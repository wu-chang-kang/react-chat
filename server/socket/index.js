module.exports = server => {
  const ChatModel = require('../db/models/Chat')
  const io = require('socket.io')(server)
  io.on('connection', socket => {
    console.log('一个客户端连接上服务器')
    /**
     *亲的发送消息
     * @param {object{form,to,content}} msg
     */
    socket.on('sendMsg', msg => {
      const chat_id = [msg.from, msg.to].sort().join('_') //将两个用户的聊天连接
      const create_time = Date.now()
      // read默认是false
      new ChatModel({ ...msg, chat_id, create_time }).save((err, chatMsg) => {
        if (!err) {
          io.emit('receiveMsg', chatMsg)
        }
      })
    })
  })
}
