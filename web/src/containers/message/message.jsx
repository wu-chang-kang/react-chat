import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { List, Badge } from 'antd-mobile'
import QueueAnim from 'rc-queue-anim' //进出场动画
const Item = List.Item
const Brief = Item.Brief

class Message extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    chat: PropTypes.object.isRequired,
    lastMsgs: PropTypes.array.isRequired
  }

  render() {
    //从父级那道的lastMsgs数组
    const { user, lastMsgs } = this.props
    const { users } = this.props.chat

    return (
      <div style={{ padding: '45px 0 50px 0' }}>
        {lastMsgs.length === 0 ? (
          <p style={{ textAlign: 'center' }}>还没有人与你发送过消息</p>
        ) : (
          <List>
            <QueueAnim type='left'>
              {lastMsgs.map(msg => {
                const targetUserId = msg.to === user._id ? msg.from : msg.to
                const tartgetUser = users[targetUserId]
                return (
                  <Item
                    key={msg._id}
                    extra={<Badge text={msg.unReadCount}></Badge>}
                    thumb={require(`../../assets/images/${msg.avatar ||
                      '头像1'}.png`)}
                    arrow='horizontal'
                    onClick={() =>
                      this.props.history.push(`/chat/${targetUserId}`)
                    }
                  >
                    {msg.content}
                    <Brief>{tartgetUser.username}</Brief>
                  </Item>
                )
              })}
            </QueueAnim>
          </List>
        )}
      </div>
    )
  }
}

export default connect(
  state => ({ user: state.user, chat: state.chat }),
  {}
)(Message)
