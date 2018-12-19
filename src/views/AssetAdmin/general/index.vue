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
        <template>
          <el-select v-model="value" placeholder="选择项目">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
        <div class="button">导出</div>
        <div class="button">打印</div>
      </div>
    </div>
    <div style="clear:both"></div>

    <div class="viewsTab">
      <div>
        <div class="objName">项目</div>
        <GeneralChart></GeneralChart>
      </div>
    </div>
  </div>
</template>
<script>
  import GeneralChart from './generalChart.vue'
  import moment from 'moment'

  import {listDeviceRepaireStatistic, listDeviceDamageCountByMonth} from '@/api/AssetAdmin.js'

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
        options: [{
          value: '选项1',
          label: '项目1'
        }, {
          value: '选项2',
          label: '项目2'
        }, {
          value: '选项3',
          label: '项目3'
        }, {
          value: '选项4',
          label: '项目4'
        }, {
          value: '选项5',
          label: '项目5'
        }],
        value: ''
      }
    },
    methods: {
      listDeviceDamageCountByMonth () {
        listDeviceDamageCountByMonth(this.yearStart.toString(), moment().toString()).then(res => {
          console.log(res)
        })
      },
      getListDeviceRepaireStatistic () {
        switch (this.timeValue) {
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
          console.log(res)
          // for (var i = 0; i < res.data.length; i++) {
          //   console.log(res.data[i].listDeviceRepairStatisticCount)
          // }
        })
      },
      getDate () {
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
        console.log(this.quarterEnd)
        console.log(this.quarterStart)
        this.monthStart = moment().startOf('month').toDate()
        this.monthEnd = moment().endOf('month').endOf('month').toDate()
        this.yearStart = moment(currentYear + '-01-01').toDate()
        this.yearEnd = moment(currentYear + '-12-31 23:59:59').toDate()
      }
    },
    created () {
      this.getDate()
      this.getListDeviceRepaireStatistic()
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

  .objack_tab {
    display: flex;
    float: left;
    font-size: 14px;
  }

  .objack_tab > div {
    padding: 10px 20px;
    border: solid 1px #bbb;
    background: #fff;
  }

  .objack_tab > div:nth-child(1) {
    border-right: none;
    border-radius: 5px 0 0 5px;
  }

  .objack_tab > div:nth-child(2) {
    // border-right: none;
    border-radius: 0px 5px 5px 0px;
  }

  .objack_tab .active_objack {
    border: solid 1px #409EFF;
    color: #409EFF;
    background: #eee;
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

  .objName {
    margin-top: 30px;
    width: 100%;
  }

  .allobj {
    margin-top: 20px;
  }

  .demonstration {
    font-size: 14px;
    color: #606266;
    font-weight: 700;
    padding: 0 10px;
  }
</style>
