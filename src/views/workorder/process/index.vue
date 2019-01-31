<template>
  <div class="box">
    <div class="listtop">
      <el-radio-group v-model="timeType" style="margin-bottom: 20px;" @change="timeTypeChange">
        <el-radio-button :label="0">月统计</el-radio-button>
        <el-radio-button :label="1">年统计</el-radio-button>
      </el-radio-group>
      <div class="block">
        <span class="demonstration"></span>
        <el-date-picker
          v-model="dateDate"
          :type="timeType?'year':'month'"
          placeholder="请选择日期"
          @change="dateChange">
        </el-date-picker>
      </div>
    </div>
    <div style="clear:both"></div>
    <div class="center">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <div ref="projectChart" :style="{width: '600px', height: '400px'}"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <div id="areaChart" :style="{width: '600px', height: '400px'}"></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import {statisticWorkOrder} from '../../../api/WorkOrder/index'

  export default {
    name: '',
    data () {
      return {
        dateDate: new Date(),
        timeType: 0,
        projectChartOptions: {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'center',
            y: 'bottom',
            data: ['已完成', '未完成']
          },
          series: [
            {
              name: '基于项目分类工单概况',
              type: 'pie',
              radius: ['30%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {},
              data: [
                {value: 235, name: '已完成'},
                {value: 110, name: '未完成'}
              ]
            }
          ]
        },
        areaChartOptions: {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'center',
            y: 'bottom',
            data: ['已完成', '未完成']
          },
          series: [
            {
              name: '基于区域分类工单概况',
              type: 'pie',
              radius: ['30%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {},
              data: [
                {value: 235, name: '已完成'},
                {value: 110, name: '未完成'}
              ]
            }
          ]
        },
        projectChart: null,
        areaChart: null
      }
    },
    methods: {
      dateChange () {
        this.statisticWorkOrder()
      },
      timeTypeChange () {
        this.statisticWorkOrder()
      },
      statisticWorkOrder () {
        statisticWorkOrder(this.dateDate.toString(), this.timeType).then(res => {
          console.log(res)// setOption(this.projectChartOptions)
        })
      }
    },
    mounted () {
      this.statisticWorkOrder()
      this.projectChart = this.$echarts.init(this.$refs.projectChart)
    },
    created () {
    }
  }
</script>
<style scoped>
  .box {
    width: 98%;
    margin: 0 auto;

  }

  .listtop {
    margin-top: 20px;

  }

  .listtop > div {
    float: left;
  }

  .block {
    margin-left: 20px;
  }

  .center {
    width: 100%;
  }
</style>
