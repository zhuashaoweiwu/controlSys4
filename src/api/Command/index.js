import request from '@/utils/request'

/**
 * 通过模块id获取模块的继电器状态
 * @export
 * @param {*}
 *
 * @returns
 */
export function commandGetModelStateInfoId (modelId) {
  return request({
    url: '/api/command/commandGetModelStateInfoId',
    method: 'post',
    data: {
      modelId
    }
  })
}

/**
 * 通过UUID批量设置模块的继电器状态
 * @export
 * @param {*}
 *
 * @returns
 */
export function batchConfigModelStateUUID (modelUUIDs, modelLoop, modelLoopState) {
  return request({
    url: '/api/command/batchConfigModelStateUUID',
    method: 'post',
    data: {
      modelUUIDs,
      modelLoop,
      modelLoopState
    }
  })
}
