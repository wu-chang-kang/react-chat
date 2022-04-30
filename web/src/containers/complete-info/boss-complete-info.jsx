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

class BossCompleteInfo extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired
  }
  state = {
    avatar: '', //头像
    post: '', // 职位
    info: '', //个人简介
    company: '', //公司名称
    salary: '' //薪资
  }

  handleChange = (type, val) => {
    // 更新内部值对应的状态
    this.setState({
      [type]: val
    })
  }

  //更新头像
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
        <NavBar>老板完善信息</NavBar>
        <AvatarSelect selectAvatar={this.selectAvatar} />
        <InputItem
          placeholder='请输入招聘职位'
          value={this.state.post}
          onChange={val => this.handleChange('post', val)}
        >
          招聘职位：
        </InputItem>
        <InputItem
          placeholder='请输入公司名称'
          value={this.state.company}
          onChange={val => this.handleChange('company', val)}
        >
          公司名称：
        </InputItem>
        <InputItem
          placeholder='请输入职位薪资'
          value={this.state.salary}
          onChange={val => this.handleChange('salary', val)}
        >
          职位薪资：
        </InputItem>
        <TextareaItem
          value={this.state.info}
          onChange={val => this.handleChange('info', val)}
          title='职位要求：'
          placeholder='请输入职位要求'
          rows={3}
        />
        <Button type='primary' onClick={this.save}>
          保&nbsp;&nbsp;&nbsp;存
        </Button>
      </div>
    )
  }
}

export default connect(
  state => ({ user: state.user }),
  { updateUser }
)(BossCompleteInfo)
