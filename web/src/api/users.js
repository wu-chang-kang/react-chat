import request from '../utils/request'

export function reqRegister(form) {
  return request({
    url: '/users/register',
    method: 'post',
    data: form
  })
}

export function reqLogin(form) {
  return request({
    url: '/users/login',
    method: 'post',
    data: form
  })
}

export function reqUpdateUser(form) {
  return request({
    url: '/users/update',
    method: 'post',
    data: form
  })
}

export function reqGetUserInfo() {
  return request({
    url: '/users/userInfo',
    method: 'get'
  })
}
