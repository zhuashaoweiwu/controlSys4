import request from '@/utils/request'

/**
 * 1、获取常规能耗统计数据
 * @export
 * @param {*}
 *
 * @returns
 */
export function getCommonEnergyStatistic () {
  return request({
    url: '/api/energyStatistic/getCommonEnergyStatistic',
    method: 'get',
    params: {}
  })
}

/**
 * 2、获取每月能耗统计数据
 * @export
 * @param {*}
 *
 * @returns
 */
export function listEnergyStatisticByDay (month) {
  return request({
    url: '/api/energyStatistic/listEnergyStatisticByDay',
    method: 'post',
    data: {
      month: month
    }
  })
}

/**
 * 3、通过控制柜id获取某段时间范围内的功率（包括有功功率及无功功率）
 * @export
 * @param {*}
 *
 * @returns
 */
export function listEleboxPower (obj) {
  return request({
    url: '/api/energyStatistic/listEleboxPower',
    method: 'post',
    data: obj
  })
}

/**
 * 4、通过控制柜id获取某段时间范围内的电流
 * @export
 * @param {*}
 *
 * @returns
 */
export function listEleboxElectric (obj) {
  return request({
    url: '/api/energyStatistic/listEleboxElectric',
    method: 'post',
    data: obj
  })
}

/**
 * 5、通过控制柜id获取某段时间范围内的电压
 * @export
 * @param {*}
 *
 * @returns
 */
export function listEleboxVoltage (obj) {
  return request({
    url: '/api/energyStatistic/listEleboxVoltage',
    method: 'post',
    data: obj
  })
}

/**
 * 6、通过时间段分页获取全部控制柜的能耗统计信息
 * （每个控制柜都包括“亮灯率”、“消耗电能（kW*h）”、“节约电能”、“节能率”、“满载功率（kW）”）
 * @export
 * @param {*}
 *
 * @returns
 */
export function listEleboxEnergyStatistic (startDate, endDate, pageNumber, pageSize) {
  return request({
    url: '/api/energyStatistic/listEleboxEnergyStatistic',
    method: 'post',
    data: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      startDate: startDate,
      endDate: endDate
    }
  })
}

/**
 * 7、通过控制柜id获取单个控制柜的统计信息（每个控制柜都包括“亮灯率”、“消耗电能（kW*h）”、
 * “节约电能”、“节能率”、“满载功率（kW）”），
 * 当时间范围多于一天时，同时返回控制柜每天的能耗，便于前端在选择一个控制柜后生成图表
 * @export
 * @param {*}
 *
 * @returns
 */
export function getEleboxEnergyStatistic (obj) {
  return request({
    url: '/api/energyStatistic/getEleboxEnergyStatistic',
    method: 'post',
    data: obj
  })
}

/**
 * 8、获取一段时间范围内的一组灯具（至少选择一盏灯具）的平均电压值的集合
 * @export
 * @param {*}
 *
 * @returns
 */
export function listLightAvgVoltage (lightIds, startDate, endDate) {
  return request({
    url: '/api/energyStatistic/listLightAvgVoltage',
    method: 'post',
    data: {
      lightIds: lightIds,
      startDate: startDate,
      endDate: endDate
    }
  })
}

/**
 * 9、获取一段时间范围内的一组灯具（至少选择一盏灯具）的平均电流值的集合
 * @export
 * @param {*}
 *
 * @returns
 */
export function listLightAvgElectric (lightIds, startDate, endDate) {
  return request({
    url: '/api/energyStatistic/listLightAvgElectric',
    method: 'post',
    data: {
      lightIds: lightIds,
      startDate: startDate,
      endDate: endDate
    }
  })
}

/**
 * 10、获取一段时间范围内的一组灯具（至少选择一盏灯具）的平均功率值的集合
 * @export
 * @param {*}
 *
 * @returns
 */
export function listLightAvgPower (lightIds, startDate, endDate) {
  return request({
    url: '/api/energyStatistic/listLightAvgPower',
    method: 'post',
    data: {
      lightIds: lightIds,
      startDate: startDate,
      endDate: endDate
    }
  })
}

/**
 * 11、根据灯具唯一编码统计单个灯具的电压、能耗信息
 * @export
 * @param {*}
 *
 * @returns
 */
export function statisticLightEnergy (lightingCode, startDate, endDate) {
  return request({
    url: '/api/energyStatistic/statisticLightEnergy',
    method: 'post',
    data: {
      lightingCode: lightingCode,
      startDate: startDate,
      endDate: endDate
    }
  })
}

/**
 * 12、通过uuid和时间搜索终端信息日志
 * @export
 * @param {*}
 *
 * @returns
 */
export function listLightSignalLog (obj) {
  return request({
    url: '/api/energyStatistic/listLightSignalLog',
    method: 'post',
    data: obj
  })
}
