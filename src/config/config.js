const devUrl = 'http://103.48.232.124:8080/nnlightctl'
export default {
  baseUrl: devUrl,
  api: {
    exportDeviceOperation: devUrl + '/api/propertyManager/exportDeviceOperation',
    exportAlarmHistory: devUrl + '/api/alarm/exportAlarmHistory',
    exportAlarm: devUrl + '/api/alarm/exportAlarm'
  }
}
