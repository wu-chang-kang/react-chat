import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
//函数
import { getUser } from '../../redux/actions'
import { getToken } from '../../utils/auth.js'
import { getRedirectTo } from '../../utils/tools'
// 组件
import { Switch, Route, Redirect } from 'react-router-dom'
import BossCompleteInfo from '../complete-info/boss-complete-info'
import CandidateCompleteInfo from '../complete-info/candidate-complete-info'
import BossList from '../main-list/boss-list'
import CandidateList from './../main-list/candidate-list'
import NotFound from '../../components/not-found/not-found'
import Message from './../message/message'
import Personal from './../personal/personal'
import Chat from './../chat/chat'
import NavFooter from '../../components/nav-footer/nav-footer'
import { NavBar } from 'antd-mobile'

class Main extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    chat: PropTypes.object.isRequired,
    getUser: PropTypes.func.isRequired
  }
  getNavList(type) {
    let navList = [
      {
        path: '/message',
        component: Message,
        title: '消息列表',
        icon: 'message',
        text: '消息'
      },
      {
        path: '/personal',
        component: Personal,
        title: '用户中心',
        icon: 'personal',
        text: '个人'
      }
    ]
    if (type === 'boss') {
      navList.unshift({
        path: '/main-list',
        component: CandidateList,
        icon: 'candidate',
        title: '求职者列表',
        text: '求职者'
      })
    } else {
      navList.unshift({
        path: '/main-list',
        component: BossList,
        icon: 'boss',
        title: '老板列表',
        text: '老板'
      })
    }
    return navList
  }
  /**
   * 对所有的chatMsgs进行分组获取到每个人最近的chatMsgs并且与所有人的在一起分组
   */
  getLastMsgs = (chatMsgs, meId) => {
    const lastMsgsObj = {}
    //找出包含lastMsgs的以userId为key的对象
    chatMsgs.forEach(msg => {
      //获取未读数量，有一个就为1，最后一起加在最后的lastMsg的unReadCount中，相当于数组的reduce
      if (msg.to === meId && !msg.read) {
        msg.unReadCount = 1
      } else {
        msg.unReadCount = 0
      }

      const chatId = msg.chat_id
      const lastMsgs = lastMsgsObj[chatId]
      if (!lastMsgs) {
        //当前msgs所在组的lastMsg
        lastMsgsObj[chatId] = msg
      } else {
        const unReadCount = lastMsgs.unReadCount
        if (msg.create_time > lastMsgs.create_time) {
          lastMsgsObj[chatId] = msg
        }
        lastMsgsObj[chatId].unReadCount = unReadCount + msg.unReadCount
      }
    })
    const lastMsgs = Object.values(lastMsgsObj)
    //结果小于等于0,m1在前面
    lastMsgs.sort((m1, m2) => {
      return m2.create_time - m1.create_time
    })
    return lastMsgs
  }

  componentDidMount() {
    const { user } = this.props
    if (getToken() && !user._id) {
      this.props.getUser()
    }
  }
  render() {
    if (!getToken()) {
      return <Redirect to='/login' />
    }
    const { _id, type, avatar } = this.props.user
    const { chatMsgs } = this.props.chat
    let path = this.props.location.pathname
    if (!_id) {
      return null
    } else {
      if (path === '/') {
        path = getRedirectTo(avatar)
        return <Redirect to={path} />
      }
    }
    const navList = this.getNavList(type)
    const currentNav = navList.find(nav => nav.path === path)
    //获取的最后的消息列表已经所有未读的消息总量
    const lastMsgs = this.getLastMsgs(chatMsgs, _id)
    const unReadCount = lastMsgs.reduce((preCount, msg) => {
      return preCount + msg.unReadCount
    }, 0)

    return (
      <div style={{ width: '100%' }}>
        {currentNav ? (
          <div
            style={{
              position: 'fixed',
              top: 0,
              width: '100%',
              maxWidth: '640px',
              zIndex: '1'
            }}
          >
            <NavBar>{currentNav.title}</NavBar>
          </div>
        ) : null}
        <Switch>
          <Route
            path='/complete-info'
            component={
              type === 'boss' ? BossCompleteInfo : CandidateCompleteInfo
            }
          ></Route>

          {navList.map(nav => (
            <Route
              key={nav.path}
              path={nav.path}
              render={props => (
                <nav.component
                  {...props}
                  lastMsgs={nav.path === '/message' ? lastMsgs : null}
                />
              )}
            ></Route>
          ))}
          <Route path='/chat/:id' component={Chat}></Route>
          <Route component={NotFound}></Route>
        </Switch>
        {currentNav ? (
          <NavFooter unReadCount={unReadCount} navList={navList}></NavFooter>
        ) : null}
      </div>
    )
  }
}

export default connect(
  state => ({
    user: state.user,
    chat: state.chat
  }),
  { getUser }
)(Main)
