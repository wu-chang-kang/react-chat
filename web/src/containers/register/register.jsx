import React, { Component } from 'react'
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Radio,
  Button,
  Flex,
  Toast
} from 'antd-mobile'
import Logo from '../../components/logo/logo'
import { register } from '../../redux/actions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
const ListItem = List.Item
const FlexItem = Flex.Item

function failToast(msg) {
  Toast.fail(msg, 1)
}

class Register extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired
  }
  state = {
    username: '',
    password: '',
    confirmPassword: '',
    type: 'boss'
  }

  register = async () => {
    const { username, type, password, confirmPassword } = this.state
    if (!username.trim()) {
      this.setState({
        username: ''
      })
      return failToast('请输入用户名')
    } else if (!password) {
      return failToast('密码不能为空')
    } else if (password !== confirmPassword) {
      return failToast('两次密码不一致')
    }
    await this.props.register({
      username: username.trim(),
      type,
      password
    })
    const { token } = this.props.user
    token && this.props.history.replace('/')
  }
  handleChange = (type, val) => {
    // 更新内部值对应的状态
    this.setState({
      [type]: val
    })
  }
  render() {
    return (
      <div>
        <NavBar>loop 特招</NavBar>
        <Logo />
        <WingBlank />
        <List>
          <WhiteSpace />
          <InputItem
            value={this.state.username}
            onChange={(val) => this.handleChange('username', val)}
          >
            用户名：
          </InputItem>
          <WhiteSpace />
          <InputItem
            type='password'
            value={this.state.password}
            onChange={(val) => this.handleChange('password', val)}
          >
            密&nbsp;&nbsp;&nbsp;码：
          </InputItem>
          <WhiteSpace />
          <InputItem
            type='password'
            value={this.state.confirmPassword}
            onChange={(val) => this.handleChange('confirmPassword', val)}
          >
            确认密码：
          </InputItem>
          <WhiteSpace />
          <ListItem>
            <Flex>
              <span>用户类型：</span>
              <FlexItem>
                <Flex justify='around'>
                  <Radio
                    checked={this.state.type === 'candidate'}
                    onChange={() => this.handleChange('type', 'candidate')}
                  >
                    求职者
                  </Radio>
                  <Radio
                    checked={this.state.type === 'boss'}
                    onChange={() => this.handleChange('type', 'boss')}
                  >
                    老板
                  </Radio>
                </Flex>
              </FlexItem>
            </Flex>
          </ListItem>
          <WhiteSpace />
          <Button type='primary' onClick={this.register}>
            注&nbsp;&nbsp;&nbsp;册
          </Button>
          <WhiteSpace />
          <Button onClick={() => this.props.history.replace('/login')}>
            已有账户
          </Button>
        </List>
      </div>
    )
  }
}

export default connect((state) => ({ user: state.user }), { register })(
  Register
)
