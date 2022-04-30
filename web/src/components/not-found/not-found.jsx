import React from 'react'
import { Button } from 'antd-mobile'

const NotFound = props => {
  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>404 Not Found</h2>
      <Button type='primary' onClick={() => props.history.replace('/')}>
        回到主页面
      </Button>
    </div>
  )
}

export default NotFound
