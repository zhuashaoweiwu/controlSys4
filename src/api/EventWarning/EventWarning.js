// 事件报警API

import request from '@/utils/request'
import qs from 'qs'
import axios from 'axios'
import Vue from 'vue'

/**
 * 1、获取实时报警数据
 * @export
 * @param {*}
 *
 * @returns
 */
export function getListAlarm (pageNumber, pageSize, alarmSource, alarmTimeStart, alarmTimeEnd) {
  return request({
    url: '/api/alarm/listAlarm',
    method: 'post',
    data: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      alarmSource: alarmSource,
      alarmTimeStart: alarmTimeStart,
      alarmTimeEnd: alarmTimeEnd
    }
  })
}

/**
 * 2、通过id获取单个报警信息（同时获取报警配置信息，包括是否在地图上显示、是否发送短信等）
 * @export
 * @param {*}
 *
 * @returns
 */
export function getAlarm () {
  return request({
    url: '/api/alarm/getAlarm',
    method: 'get',
    params: {}
  })
}

/**
 * 3、导出实时报警信息
 * @export
 * @param {*} List<Long> alarmIds -- 要清理的报警信息id值的集合
 *
 * @returns
 */

export function exportAlarm (param) {
  let params = qs.stringify(param, {allowDots: true})
  axios.post(Vue.conf.api.exportAlarm, params, {
    ContentType: 'application/x-www-form-urlencoded',
    responseType: 'arraybuffer'
  }).then((res) => {
    console.log(res)
    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
    let objectUrl = URL.createObjectURL(blob)
    window.location.href = objectUrl
  }).catch(function (res) {
  })
}

/**
 * 4、清理实时报警信息（将报警状态置为“已失效”，并生成一条历史报警记录）
 * @export
 * @param {*} List<Long> alarmIds -- 要清理的报警信息id值的集合
 *
 * @returns
 */
export function clearAlarm (alarmIds) {
  return request({
    url: '/api/alarm/clearAlarm',
    method: 'post',
    data: {
      alarmIds: alarmIds
    }
  })
}

/**
 * 5、通过搜索条件分页获取历史报警信息
 * @export
 * @param {*} listAlarmHistory(int pageNumber, int pageSize)

 *
 * @returns
 */
export function listAlarmHistory (pageNumber, pageSize, startTime, endTime) {
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

/**
 * 6、清理报警历史记录（直接从数据库中删除）
 * @export
 * @param {*} List<Long> alarmHistoryIds -- 要删除的报警历史记录id值的集合

 *
 * @returns
 */
export function clearAlarmHistory (alarmHistoryIds) {
  return request({
    url: '/api/alarm/clearAlarmHistory',
    method: 'POST',
    data: {
      alarmHistoryIds: alarmHistoryIds
    }
  })
}

/**
 * 7、导出报警历史记录
 * @export
 * @param {*} List<Long> alarmHistoryIds -- 要删除的报警历史记录id值的集合

 *
 * @returns
 */

export function exportAlarmHistory (param) {
  let params = qs.stringify(param, {allowDots: true})
  axios.post(Vue.conf.api.exportAlarmHistory, params, {
    ContentType: 'application/x-www-form-urlencoded',
    responseType: 'arraybuffer'
  }).then((res) => {
    console.log(res)
    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
    let objectUrl = URL.createObjectURL(blob)
    window.location.href = objectUrl
  }).catch(function (res) {
  })
}

/**
 * 8、导出报警历史记录
 * @export
 * @param {*} List<Long> alarmHistoryIds -- 要删除的报警历史记录id值的集合
 * configAlarm(

 * Byte alarmConfigLevel; -- 设置报警等级

 * Byte isNoticeMap; -- 是否地图展示

 * Byte isNoticeSms; -- 是否短信通知

 * Byte isNoticeEmail; -- 是否邮件通知

 * Byte isNoticeWeixin; -- 是否微信通知

 * )
 *
 *
 * @returns
 */
export function configAlarm (configAlarm) {
  return request({
    url: '/api/alarm/configAlarm',
    method: 'post',
    data: configAlarm
  })
}

/**
 * 9. 是否开启警报设置
 */
export function configIsUseAlarm (alarmRequestList) {
  return request({
    url: '/api/alarm/configIsUseAlarm',
    method: 'POST',
    data: {alarmRequestList}
  })
}
