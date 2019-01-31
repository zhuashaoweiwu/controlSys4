import request from '@/utils/request'

// 获取全部区域信息
export function getLevelArea () {
  return request({
    url: '/api/roadlighting/getLevelArea',
    method: 'post',
    data: {}
  })
}
export function listArea () {
  return request({
    url: '/api/roadlighting/listArea',
    method: 'post',
    data: {}
  })
}
