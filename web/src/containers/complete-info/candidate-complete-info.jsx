import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavBar, InputItem, TextareaItem, Button, Toast } from 'antd-mobile'
import AvatarSelect from './../../components/avatar-selector/avatar-selector'
import { updateUser } from '../../redux/actions'
import { PropTypes } from 'prop-types'
import { Redirect } from 'react-router-dom'

function failToast(msg) {
  Toast.fail(msg, 1)
}

class CandidateCompleteInfo extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired
  }
  state = {
    avatar: '', //头像
    post: '', // 职位
    info: '' //个人简介
  }
  handleChange = (type, val) => {
    // 更新内部值对应的状态
    this.setState({
      [type]: val
    })
  } //更新头像
  selectAvatar = avatar => {
    this.setState({
      avatar
    })
  }
  save = () => {
    let data = { ...this.state }
    let i
    for (i in data) {
      data[i] = data[i].trim()
      if (!data[i]) {
        return failToast('请将信息全部完善！')
      }
    }
    this.props.updateUser(this.state)
  }
  render() {
    const { avatar } = this.props.user
    if (avatar) {
      return <Redirect to='/main-list' />
    }
    return (
      <div>
        <NavBar>求职者完善信息</NavBar>
        <AvatarSelect selectAvatar={this.selectAvatar} />
        <InputItem
          placeholder='请输入求职岗位'
          value={this.state.post}
          onChange={val => this.handleChange('post', val)}
        >
          求职岗位：
        </InputItem>
        <TextareaItem
          title='个人介绍：'
          placeholder='请输入个人介绍'
          rows={3}
          value={this.state.info}
          onChange={val => this.handleChange('info', val)}
        />
        <Button onClick={this.save} type='primary'>
          保&nbsp;&nbsp;&nbsp;存
        </Button>
      </div>
    )
  }
}

export default connect(
  state => ({ user: state.user }),
  { updateUser }
)(CandidateCompleteInfo)
