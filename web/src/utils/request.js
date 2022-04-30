import axios from 'axios'
import { Toast } from 'antd-mobile'
import store from './../redux/store'
import { resetUser } from './../redux/actions'
import { getToken } from '../utils/auth'
function failToast(msg) {
  Toast.fail(msg, 2)
}
function successToast(msg) {
  Toast.success(msg, 2)
}

// 创建axios实例
//第一个接口
const service = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL || ''}api`, // api 的 base_url
  timeout: 26000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    config.headers.authorization = 'Bearer ' + getToken()
    return config
  },
  (error) => {
    failToast('发送请求失败，请检查网络')
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.data && response.data.msg) {
        successToast(response.data.msg)
      }
    }
    return response
  },
  (error) => {
    console.log('err' + error) // for debug
    if (!error.response || !error.response.data.msg) {
      failToast('服务器出现问题,请稍后再试')
    } else {
      failToast(error.response.data.msg)
    }
    if (error.response && error.response.status === 401) {
      store.dispatch(resetUser())
    }
    return Promise.reject(error)
  }
)

export default service
