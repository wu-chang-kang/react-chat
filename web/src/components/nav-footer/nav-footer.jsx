import React from 'react'
import { TabBar } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
const Item = TabBar.Item

const NavFooter = props => {
  const { navList, location, history, unReadCount } = props
  const path = location.pathname
  return (
    <div
      style={{ position: 'fixed', width: '100%', maxWidth: '640px', bottom: 0 }}
    >
      <TabBar>
        {navList.map(nav => (
          <Item
            key={nav.path}
            title={nav.text}
            badge={nav.path === '/message' ? unReadCount : 0}
            icon={{
              uri: require(`../../assets/nav-footer-icons/${nav.icon}.png`)
            }}
            selectedIcon={{
              uri: require(`../../assets/nav-footer-icons/${nav.icon}-selected.png`)
            }}
            selected={path === nav.path}
            onPress={() => history.replace(nav.path)}
          ></Item>
        ))}
      </TabBar>
    </div>
  )
}

export default withRouter(NavFooter)
