import request from '../utils/request'
//用户列表
export function reqUserList(type) {
  return request({
    url: `/chat/userList?type=${type}`,
    method: 'get'
  })
}
//获取当前用户消息列表
export function reqChatMsgList() {
  return request({
    url: '/chat/msgList',
    method: 'get'
  })
}

export function reqReadMsg(from) {
  return request({
    url: '/chat/readMsg',
    method: 'post',
    data: {
      from
    }
  })
}
