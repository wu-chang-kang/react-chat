import React, { Component } from 'react'
import { Result, List, WhiteSpace, Button, Modal } from 'antd-mobile'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { resetUser } from './../../redux/actions'

const Item = List.Item
const Brief = Item.Brief

class Personal extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    resetUser: PropTypes.func.isRequired
  }
  logout = () => {
    Modal.alert('退出', '确定退出登录吗？', [
      { text: '取消' },
      {
        text: '确定',
        onPress: () => {
          this.props.resetUser()
        }
      }
    ])
  }
  render() {
    const { username, avatar, info, company, post, salary } = this.props.user
    return (
      <div style={{ padding: '45px 0 50px 0' }}>
        <Result
          img={
            <img
              src={require(`../../assets/images/${avatar}.png`)}
              alt={avatar}
            />
          }
          title={username}
          message={company}
        ></Result>
        <List renderHeader={() => '相关信息'}>
          <Item multipleLine>
            <Brief>职位：{post}</Brief>
            <Brief>简介：{info}</Brief>
            {salary ? <Brief>薪资：{salary}</Brief> : null}
          </Item>
        </List>
        <WhiteSpace />
        <List>
          <Button type='warning' onClick={this.logout}>
            退出登录
          </Button>
        </List>
      </div>
    )
  }
}

export default connect(
  state => ({
    user: state.user
  }),
  { resetUser }
)(Personal)
