import request from '@/utils/request'

export function login (username, password) {
  return request({
    url: '/api/login/Login',
    method: 'post',
    data: {
      loginName: username,
      pwd: password
    }
  })
}

export function getInfo (token) {
  return request({
    url: '/user/info',
    method: 'get',
    data: { token }
  })
}

export function register (username, password) {
  return request({
    url: '/api/login/register',
    method: 'post',
    data: {
      loginName: username,
      pwd: password
    }
  })
}
export function logout (username, password) {
  console.log(username, password)
  return request({
    url: '/api/login/Logout',
    method: 'post',
    data: {
    }
  })
}
