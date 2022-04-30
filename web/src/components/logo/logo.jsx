import React from 'react' // 使用函数也必须引入React,否则jsx语法报错

import './logo.less'
import logo from './logo.png'
export default function Logo() {
  return (
    <div className='logo-container'>
      <img src={logo} alt='logo' className='logo-img' />
    </div>
  )
}
