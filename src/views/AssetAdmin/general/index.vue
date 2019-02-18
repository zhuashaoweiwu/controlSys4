<template>
  <div class="box">
    <div class="seach_lest">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="时间选择">
          <el-select v-model="timeValue" placeholder="请选择时间段" @change="getListDeviceRepaireStatistic">
            <el-option label="本月" :value="1"></el-option>
            <el-option label="本季度" :value="2"></el-option>
            <el-option label="本年" :value="3"></el-option>
            <el-option label="时间不限" :value="4"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="rightList">
        <div class="button" @click="exportDeviceOperation">导出设备运维状况</div>
      </div>
    </div>
    <div style="clear:both"></div>
    <div class="viewsTab">
      <div>
        <el-row :gutter="20">
          <GeneralChart :pie-data="pieData"></GeneralChart>
          <el-col :span="16">
            <div class="grid-content bg-purple">
              <div ref="myChart_" :style="{width: '800px', height: '400px'}"></div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  import GeneralChart from './generalChart.vue'
  import moment from 'moment'
  import {listDeviceRepaireStatistic, listDeviceDamageCountByMonth, exportDeviceOperation} from '@/api/AssetAdmin.js'

  export default {
    data () {
      return {
        timeValue: 1, // 1 代表本月 ；2代表本季度 3代表本年 4代表所有时间
        activeName: 'first',
        tabPosition: 'top',
        timeStart: '',
        timeEnd: '',
        dateChange: '',
        quarterStart: '',
        quarterEnd: '',
        monthStart: '',
        monthEnd: '',
        yearStart: '',
        yearEnd: '',
        pieData: [],
        lineData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        value: '',
        areaOptions: {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{c} {b}月'
          },
          title: {
            text: '设备损坏总数',
            // subtext: '纯属虚构',
            x: 'center'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: '损坏总数',
            data: [],
            type: 'line',
            areaStyle: {}
          }]
        }
      }
    },
    methods: {
      exportDeviceOperation () { // 导出设备运维情况
        let params = { // 时间转化为字符串
          startDate: this.timeStart.toString(),
          endDate: this.timeEnd.toString()
        }
        exportDeviceOperation(params)
      },
      monthNumber () {
        let myChart1 = this.$echarts.init(this.$refs.myChart_)
        // 绘制图表
        myChart1.clear()
        myChart1.setOption(this.areaOptions, true)
      },
      listDeviceDamageCountByMonth () { // 设备损坏总数
        listDeviceDamageCountByMonth(this.yearStart.toString(), moment().toString()).then(res => {
          res.data.forEach(d => {
            let index_ = moment(d.month).month()
            this.lineData[index_] = d.monthCount
          })
          this.areaOptions.series[0].data = this.lineData
          this.monthNumber()
        })
      },
      getListDeviceRepaireStatistic () { // 获取设备维修情况分布
        switch (this.timeValue) { // 判断是根据年还是季度还是月
          case 1:
            this.timeStart = this.monthStart
            this.timeEnd = this.monthEnd
            break
          case 2:
            this.timeStart = this.quarterStart
            this.timeEnd = this.quarterEnd
            break
          case 3:
            this.timeStart = this.yearStart
            this.timeEnd = this.yearEnd
            break
          case 4:
            break
        }
        listDeviceRepaireStatistic(this.timeStart.toString(), this.timeEnd.toString()).then(res => {
          this.pieData = []
          res.data.forEach((d) => {
            this.pieData.push({value: d.listDeviceRepairStatisticCount, name: d.myCatalogName})
          })
        })
      },
      getDate () { // 判断日期
        let currentQuarter = moment().quarter() // 当前是第几季度
        let currentYear = moment().year()
        this.quarterStart = moment(moment(currentYear + '-01-01').toDate()).quarter(currentQuarter).toDate()
        let endMonth = 3 * parseInt(currentQuarter) // 当季度最后一个月
        /* 对月数进行格式化 */
        if (endMonth < 10) {
          endMonth = '0' + endMonth
        } else {
          endMonth += ''
        }
        let endMonthDays = moment(currentYear + '-' + endMonth).daysInMonth() // 末尾月天数
        let endDays = currentYear + '-' + endMonth + '-' + endMonthDays + ' 23:59:59' // 完整年月日整合
        this.quarterEnd = moment(endDays).toDate() // 计算结果
        this.monthStart = moment().startOf('month').toDate()
        this.monthEnd = moment().endOf('month').endOf('month').toDate()
        this.yearStart = moment(currentYear + '-01-01').toDate()
        this.yearEnd = moment(currentYear + '-12-31 23:59:59').toDate()
      }
    },
    created () {
      this.getDate()
      this.getListDeviceRepaireStatistic()
    },
    mounted () {
      this.listDeviceDamageCountByMonth()
    },
    components: {
      GeneralChart
    }
  }
</script>

<style lang="scss" scoped>
  .box {
    width: 98%;
    margin: 0 auto;
  }

  .seach_lest {
    margin-top: 20px;
  }

  .dateChange {
    display: flex;
    float: left;
    margin-left: 30px;
    line-height: 40px;
    font-size: 14px;
  }

  .rightList {
    float: right;
    display: flex;
    // line-height: 40px;
  }

  .rightList .button {
    background: #409EFF;
    margin-right: 10px;
    border-radius: 5px;
    color: #fff;
    font-size: 14px;
    line-height: 40px;
    padding: 0 20px;
  }

  .rightList div:nth-child(2) {
    margin-left: 20px;
  }

  .demonstration {
    font-size: 14px;
    color: #606266;
    font-weight: 700;
    padding: 0 10px;
  }
</style>
