import request from '@/utils/request'

/**
 * 1、获取历史报警数据
 * @export
 * @param {*}
 *
 * @returns
 */
export function getListAlarmHistory (pageNumber, pageSize, startTime, endTime) {
  return request({
    url: '/api/alarm/listAlarmHistory',
    method: 'post',
    data: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      startTime: startTime,
      endTime: endTime
    }
  })
}
