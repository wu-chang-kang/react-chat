import React, { Component } from 'react'
import { List, Grid } from 'antd-mobile'
import PropTypes from 'prop-types'

class AvatarSelect extends Component {
  static propTypes = {
    selectAvatar: PropTypes.func.isRequired
  }
  state = {
    avatarList: [],
    icon: null
  }
  constructor(props) {
    super(props)
    for (let i = 0; i < 20; i++) {
      this.state.avatarList.push({
        text: `头像${i + 1}`,
        icon: require(`../../assets/images/头像${i + 1}.png`)
      })
    }
  }

  handleClick = ({ text, icon }) => {
    this.setState({
      icon
    })
    this.props.selectAvatar(text)
  }
  render() {
    const { icon, text } = this.state
    const ListAvatar = icon ? (
      <div>
        已选择头像：
        <img src={icon} alt={text} />
      </div>
    ) : (
      '请选择头像'
    )
    return (
      <List renderHeader={() => ListAvatar}>
        <Grid
          data={this.state.avatarList}
          columnNum={5}
          onClick={this.handleClick}
        ></Grid>
      </List>
    )
  }
}

export default AvatarSelect
