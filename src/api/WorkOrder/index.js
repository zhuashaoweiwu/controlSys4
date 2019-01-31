import request from '@/utils/request'
import qs from 'qs'
import axios from 'axios'
import Vue from 'vue'

// 按年月统计工单概况
export function statisticWorkOrder (date, timeType) {
  return request({
    url: '/api/workOrder/statisticWorkOrder',
    method: 'post',
    data: {date, timeType}
  })
}

// 统计工单状态
export function countWorkOrderState () {
  return request({
    url: '/api/workOrder/countWorkOrderState',
    method: 'post',
    data: {}
  })
}

// 分页获取工单信息
export function listWorkOrder (pageNumber, pageSize, state) {
  return request({
    url: '/api/workOrder/listWorkOrder',
    method: 'post',
    data: {pageNumber, pageSize, state}
  })
}

// 认领工单操作
export function claimWordOrder (obj) {
  return request({
    url: '/api/workOrder/claimWordOrder',
    method: 'post',
    data: obj
  })
}

// 新增工单
export function addWordOrder (obj) {
  return request({
    url: '/api/workOrder/addWordOrder',
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // },
    // transformRequest: [function (data) {
    //   return qs.stringify(data)
    // }
    // ],
    // paramsSerializer: function (data) {
    //   return qs.stringify(data)
    // },
    // transformRequest: [function (data) {
    //   return data
    // }],
    method: 'post',
    data: obj
  })
}

// 搜索条件分页获取历史工单信息
export function listWorkOrderHistory (pageNumber, pageSize, startTime, endTime, nnlightctlMaskerId) {
  return request({
    url: '/api/workOrder/listWorkOrderHistory',
    method: 'post',
    data: {pageNumber, pageSize, startTime, endTime, nnlightctlMaskerId}
  })
}

// 已认领工单工作流执行预览
export function previewWorkFlower (workOrderId) {
  return request({
    url: '/api/workOrder/previewWorkFlower',
    method: 'post',
    data: {workOrderId}
  })
}

// 分页获取流程节点
export function listWorkFlowerNode () {
  return request({
    url: '/api/workOrder/listWorkFlowerNode',
    method: 'post',
    data: {}
  })
}
