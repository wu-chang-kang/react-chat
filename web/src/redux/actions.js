import io from 'socket.io-client'
import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqGetUserInfo
} from './../api/users'
import { reqUserList, reqChatMsgList, reqReadMsg } from './../api/chat'
import { setToken } from '../utils/auth'
//注册异步action
import {
  AUTH_SUCCESS,
  RECEIVE_USER,
  RESET__USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG,
  READ_MSG
} from './action-types'

const authSuccess = (user) => ({ type: AUTH_SUCCESS, data: user })
const receiveUser = (user) => ({ type: RECEIVE_USER, data: user })
// 给request.js使用的
export const resetUser = () => ({ type: RESET__USER })

const reveiveMsg = (chatMsg) => ({ type: RECEIVE_MSG, data: chatMsg })
const read_Msg = ({ count, from, to }) => ({
  type: READ_MSG,
  data: { count, from, to }
})

//消息列表
const reveiveMsgList = ({ users, chatMsgs }) => ({
  type: RECEIVE_MSG_LIST,
  data: { users, chatMsgs }
})
// userList
const receiveUserList = (userList) => ({
  type: RECEIVE_USER_LIST,
  data: userList
})

export const register = (user) => {
  return async (dispatch) => {
    const res = await reqRegister(user)
    if (res.status === 200) {
      setToken(res.data.token)
      dispatch(authSuccess({ token: res.data.token }))
    }
  }
}

export const login = (user) => {
  return async (dispatch) => {
    const res = await reqLogin(user)
    if (res.status === 200) {
      setToken(res.data.token)
      dispatch(authSuccess({ token: res.data.token }))
    }
  }
}

export const updateUser = (user) => {
  return async (dispatch) => {
    const res = await reqUpdateUser(user)
    if (res.status === 200) {
      dispatch(receiveUser(res.data.data))
    }
  }
}

/**
 *
 * @param {func} dispatch
 * @param {string} userId
 */
function initIO(dispatch, userId) {
  if (!io.socket) {
    io.socket = io(`ws://${process.env.REACT_APP_BASE_IO_URL || '/'}`)
    //后端接收消息
    io.socket.on('receiveMsg', (chatMsg) => {
      if (userId === chatMsg.from || userId === chatMsg.to) {
        dispatch(reveiveMsg(chatMsg))
      }
    })
  }
}
// 发送消息
/**
 *
 * @param {object{form,to,content}} msg
 */
export const sendMsg = (msg) => {
  return (dispatch) => {
    //发消息
    io.socket.emit('sendMsg', msg)
  }
}

//读取消息
export const readMsg = (from, to) => {
  return async (dispatch) => {
    const res = await reqReadMsg(from)
    if (res.status === 200) {
      dispatch(read_Msg({ from, to }))
    }
  }
}

// 获取消息列表
async function getMsgList(dispatch, userId) {
  initIO(dispatch, userId)
  const res = await reqChatMsgList()
  if (res.status === 200) {
    const { users, chatMsgs } = res.data.data
    dispatch(reveiveMsgList({ users, chatMsgs }))
  }
}

export const getUser = () => {
  return async (dispatch) => {
    const res = await reqGetUserInfo()
    if (res.status === 200) {
      let { data, token } = res.data
      data.token = token
      setToken(token)
      //获取信息列表，需要先等待这个获取完再获取用户本身的信息
      /**
       *
       * @param {func} dispatch
       * @param {string} userId
       */
      await getMsgList(dispatch, data._id)
      dispatch(receiveUser(data))
    }
  }
}

export const getUserList = (type) => {
  return async (dispatch) => {
    const res = await reqUserList(type)
    if (res.status === 200) {
      dispatch(receiveUserList(res.data.data))
    }
  }
}
