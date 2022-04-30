const express = require('express')
const User = require('../../db/models/User')
const Chat = require('../../db/models/Chat')
const router = express.Router()

router.get('/userList', async (req, res) => {
  const { type } = req.query
  User.find({ type }, (err, users) => {
    if (!err) {
      res.send({ code: 0, data: users })
    }
  })
})

// 获取当前用户所有相关聊天信息列表
router.get('/msgList', (req, res) => {
  User.find((err, userDocs) => {
    if (!err) {
      const users = userDocs.reduce((users, user) => {
        users[user._id] = {
          username: user.username,
          avatar: user.avatar
        }
        return users
      }, {})
      const userId = req.user._id
      Chat.find(
        { $or: [{ from: userId }, { to: userId }] },
        (err, chatMsgs) => {
          if (!err) {
            res.send({ code: 0, data: { users, chatMsgs } })
          }
        }
      )
    }
  })
})

//修改指定消息为已读
router.post('/readMsg', (req, res) => {
  //得到from,别人发给自己的
  const { from } = req.body
  const to = req.user._id
  Chat.update(
    { from, to, read: false },
    { read: true },
    { multi: true },
    (err, doc) => {
      if (!err) {
        //nModified是更新的数量
        res.send({ code: 0, data: doc.nModified })
      }
    }
  )
})

module.exports = router
