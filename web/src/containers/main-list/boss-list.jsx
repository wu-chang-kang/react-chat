import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import UserList from './../../components/user-list/user-list'
import { getUserList } from '../../redux/actions'

class BossList extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    userList: PropTypes.array.isRequired,
    getUserList: PropTypes.func.isRequired
  }
  componentDidMount() {
    this.props.getUserList('boss')
  }
  render() {
    const { avatar } = this.props.user
    if (!avatar) {
      return <Redirect to='/complete-info' />
    }
    return <UserList userList={this.props.userList}></UserList>
  }
}

export default connect(
  state => ({ user: state.user, userList: state.userList }),
  { getUserList }
)(BossList)
