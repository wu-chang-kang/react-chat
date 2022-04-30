import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sendMsg, readMsg } from '../../redux/actions'
import { NavBar, List, InputItem, Toast, Icon, Grid } from 'antd-mobile'
import { PropTypes } from 'prop-types'
import './chat.css'
import emojis from '../../assets/emojis/emojis.json'
const Item = List.Item

function failToast(msg) {
  Toast.fail(msg, 1)
}
class Chat extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    chat: PropTypes.object.isRequired,
    sendMsg: PropTypes.func.isRequired
  }
  state = {
    content: '',
    isEmojisShow: false
  }
  emojis = null

  handleSendMsg = () => {
    if (!this.state.content.trim()) {
      return failToast('发送内容不能为空')
    }
    const from = this.props.user._id
    const to = this.props.match.params.id
    const content = this.state.content.trim()
    if (content) {
      this.props.sendMsg({ from, to, content })
    }
    this.setState({
      content: '',
      isEmojisShow: false
    })
    // 不在componentDidMount里面使用，因为如果输入值也是改变视图
    //必须要异步，因为同步的话会先进行这个才更新状态
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight + '45')
    }, 0)
  }
  hadnleChange = val => {
    this.setState({ content: val })
  }

  toggleShow = () => {
    const isEmojisShow = !this.state.isEmojisShow
    this.setState({
      isEmojisShow
    })
    if (isEmojisShow) {
      //异步派发resize事件，解决表情列表显示的bug
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 0)
    }
  }

  //进入页面就是更新数据
  componentDidMount() {
    window.scrollTo(0, document.body.scrollHeight)
    //发请求更新消息的未读状态
    this.emojis = emojis.map(emoji => ({ text: emoji }))

    const from = this.props.match.params.id
    const to = this.props.user._id
    this.props.readMsg(from, to)
    //如果没有执行readMsg或者中途没有改变state需要手动更新
    // this.forceUpdate()
  }
  componentWillUnmount() {
    //发请求更新消息的未读状态
    const from = this.props.match.params.id
    const to = this.props.user._id
    this.props.readMsg(from, to)
  }

  render() {
    const { user } = this.props
    const { users, chatMsgs } = this.props.chat
    //计算当前聊天的chatId
    const meId = user._id
    const targetId = this.props.match.params.id
    const chatId = [meId, targetId].sort().join('_')

    //对chatMsgs进行过滤.
    const msgs = chatMsgs.filter(msg => msg.chat_id === chatId)
    //目标用户的avatar
    const targetAvatar = users[targetId].avatar
    const targetIcon = require(`../../assets/images/${targetAvatar ||
      '头像1'}.png`)
    return (
      <div className='chat-page'>
        <div
          style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            maxWidth: '640px',
            zIndex: '1'
          }}
        >
          <NavBar
            icon={
              <Icon type='left' onClick={() => this.props.history.goBack()} />
            }
          >
            {users[targetId].username}
          </NavBar>
        </div>
        <div style={{ padding: '45px 0 50px 0' }}>
          {msgs.length === 0 ? (
            <p style={{ textAlign: 'center' }}>你们之间还没有互相发送过消息</p>
          ) : (
            <List>
              {msgs.map(msg => {
                if (meId === msg.to) {
                  //对方给我的
                  return (
                    <Item key={msg._id} thumb={targetIcon}>
                      {msg.content}
                    </Item>
                  )
                } else {
                  return (
                    <Item key={msg._id} extra='我' className='chat-me'>
                      {msg.content}
                    </Item>
                  )
                }
              })}
            </List>
          )}
        </div>
        <div
          style={{
            position: 'fixed',
            width: '100%',
            maxWidth: '640px',
            zIndex: 1,
            background: '#fff',
            minHeight: '50px',
            bottom: 0
          }}
        >
          <InputItem
            placeholder='请输入'
            value={this.state.content}
            onChange={val => this.hadnleChange(val)}
            onFocus={() => this.setState({ isEmojisShow: false })}
            extra={
              <div style={{ lineHeight: '1.2em' }}>
                <span
                  style={{ marginRight: '.5em' }}
                  onClick={() => this.toggleShow()}
                >
                  {'🙂'}
                </span>
                <span onClick={this.handleSendMsg}>发送</span>
              </div>
            }
          />
          {this.state.isEmojisShow ? (
            <Grid
              data={this.emojis}
              carouselMaxRow={4}
              columnNum={8}
              isCarousel={true}
              onClick={item => {
                this.setState({ content: this.state.content + item.text })
              }}
            />
          ) : null}
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({ user: state.user, chat: state.chat }),
  { sendMsg, readMsg }
)(Chat)
