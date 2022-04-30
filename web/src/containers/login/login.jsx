import React, { Component } from 'react'
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Button,
  Toast
} from 'antd-mobile'
import Logo from '../../components/logo/logo'
import { login } from '../../redux/actions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

function failToast(msg) {
  Toast.fail(msg, 1)
}

class Login extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired
  }
  state = {
    username: '',
    password: ''
  }
  login = async () => {
    const { username, password } = this.state
    if (!username.trim() || !password) {
      this.setState({
        username: username.trim()
      })
      return failToast('用户名或密码不能为空')
    }
    //dispatch返回函数的话已经被修改成了promise
    await this.props.login(this.state)
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
          <Button type='primary' onClick={this.login}>
            登&nbsp;&nbsp;&nbsp;录
          </Button>
          <WhiteSpace />
          <Button onClick={() => this.props.history.replace('/register')}>
            立刻注册
          </Button>
        </List>
      </div>
    )
  }
}

export default connect((state) => ({ user: state.user }), { login })(Login)
