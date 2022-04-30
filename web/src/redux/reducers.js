import { combineReducers } from 'redux'
import {
  AUTH_SUCCESS,
  RECEIVE_USER,
  RESET__USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG,
  READ_MSG
} from './action-types'

import { removeToken } from '../utils/auth'

const initUser = {
  username: '',
  type: '',
  token: ''
}

function user(state = initUser, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      return { ...initUser, ...action.data }
    case RECEIVE_USER:
      return action.data
    case RESET__USER:
      // 清除cookie
      removeToken()
      // 解构变成另外一个对象来刷新
      return { ...initUser }
    default:
      return state
  }
}

const initUserList = []

//产生userList状态的state
function userList(state = initUserList, action) {
  switch (action.type) {
    case RECEIVE_USER_LIST:
      return action.data
    default:
      return state
  }
}

const initChat = {
  users: {}, //所有用户信息的对象，属性名为id
  chatMsgs: [] //当前用户所有相关的msg数组
}

/**
 *
 * @param {object{type,data{users,chatMsgs}}} action
 */

function chat(state = initChat, action) {
  switch (action.type) {
    case RECEIVE_MSG_LIST:
      const { users, chatMsgs } = action.data
      return {
        users,
        chatMsgs
      }
    case RECEIVE_MSG:
      const chatMsg = action.data
      return {
        users: state.users,
        chatMsgs: [...state.chatMsgs, chatMsg]
      }
    case READ_MSG:
      const { from, to } = action.data
      return {
        users: state.users,
        chatMsgs: state.chatMsgs.map(msg => {
          if (msg.from === from && msg.to === to && !msg.read) {
            return { ...msg, read: true }
          } else {
            return msg
          }
        })
      }
    default:
      return state
  }
}

// 向外保留一个联合的结构
export default combineReducers({
  user,
  userList,
  chat
})
