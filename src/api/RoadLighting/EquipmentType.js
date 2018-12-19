import request from '@/utils/request'

/**
 * 获取灯具型号列表
 * @export
 * @param {any} pageNumber
 * @param {any} pageSize
 * @returns obj
 */
export function listLightModel (pageNumber, pageSize, modelName) {
  return request({
    url: '/api/roadlighting/listLightModel',
    method: 'post',
    data: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      modelName: modelName
    }
  })
}

/**
 * 删除灯具型号
 * @export
 * @param {any} deleteLightModelList
 * @returns obj
 */
export function deleteLightModel (deleteLightModelList) {
  return request({
    url: '/api/roadlighting/deleteLightModel',
    method: 'post',
    data: {
      deleteLightModelList
    }
  })
}

/**
 * 添加编辑灯具型号
 * @export
 * @param {any} light
 * @returns obj
 */
export function addOrUpdateLightModel (light) {
  return request({
    url: '/api/roadlighting/addOrUpdateLightModel',
    method: 'post',
    data: light
  })
}
