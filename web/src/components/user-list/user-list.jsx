import React from 'react'
import { withRouter } from 'react-router-dom'
import { WingBlank, WhiteSpace, Card } from 'antd-mobile'
import QueueAnim from 'rc-queue-anim' //进出场动画
const Header = Card.Header
const Body = Card.Body

const UserList = props => {
  const { userList, history } = props
  return (
    <WingBlank style={{ padding: '45px 0 50px 0' }}>
      <QueueAnim type='scale'>
        {userList.map(user => (
          <div
            key={user._id}
            onClick={() => {
              history.push(`/chat/${user._id}`)
            }}
          >
            <WhiteSpace />
            <Card>
              <Header
                thumb={require(`../../assets/images/${user.avatar ||
                  '头像1'}.png`)}
                extra={user.username}
              />
              <Body>
                <div>职位：{user.post}</div>
                {user.company ? <div>公司：{user.company}</div> : null}
                {user.salary ? <div>职位：{user.salary}</div> : null}
                <div>描述：{user.info}</div>
              </Body>
            </Card>
          </div>
        ))}
      </QueueAnim>
    </WingBlank>
  )
}

export default withRouter(UserList)
