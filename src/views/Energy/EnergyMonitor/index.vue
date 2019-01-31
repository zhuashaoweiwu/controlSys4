<template>
  <div class="ter-report">
    <div class="cont-inpts">
      <el-form ref="searchForm" :model="form" :rules="rules" label-width="80px">
        <el-row type="flex" class="row-bg">
          <el-col :span="5">
            <el-form-item label="控制柜" prop="eleboxId">
              <el-select v-model="form.eleboxId" placeholder="请选择">
                <el-option
                  v-for="item in eleboxOptions"
                  :key="item.id"
                  :label="item.codeNumber"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="日期" prop="startDate">
              <el-date-picker
                v-model="form.selectDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" @click="getData" plain>查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- <div class="search">
      <el-button type="primary" @click="this.changeData" plain>查询</el-button>
    </div> -->
    <div class="echarts-lines">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="功率" name="power">
          <div id="power"></div>
          <!--<div id="nonPower"></div>-->
        </el-tab-pane>
        <el-tab-pane label="电流" name="electricity">
          <div id="electricity"></div>
        </el-tab-pane>
        <el-tab-pane label="电压" name="voltage">
          <div id="voltage">sddsd</div>
        </el-tab-pane>
        <!--<el-tab-pane label="电能" name="electricEnergy">-->
          <!--<div id="electricEnergy"></div>-->
        <!--</el-tab-pane>-->
        <!--<el-tab-pane label="功率因素" name="powerFactor">-->
          <!--<div id="powerFactor"></div>-->
        <!--</el-tab-pane>-->
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import moment from 'moment'
  // import _ from 'lodash'
  import {
    listEleboxPower,
    listEleboxElectric,
    listEleboxVoltage
  } from '@/api/EnergyAnalyze/energyanalyze'
  import {listElebox} from '@/api/RoadLighting/deploy'
  // 基于准备好的dom，初始化echarts实例
  // let myChart = echarts.init(document.getElementById('voltage'));
  export default {
    name: 'TerReport',
    data () {
      return {
        form: {
          eleboxId: '',
          selectDate: [moment().subtract(20, 'days'), moment()]
        },
        rules: {
          eleboxId: [
            {required: true, message: '请输入控制柜ID', trigger: 'blur'}
          ],
          selectDate: [
            {required: true, message: '请选择日期', trigger: 'blur'}
          ]
        },
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        searchData: {},
        dateArr: [],
        powerData: null,
        nonPowerData: null,
        voltageOption: {
          title: {
            text: '电压（V）'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              return params[0].axisValueLabel + '<br>电压：' + params[0].value + '<br>单位：V'
            }
          },
          xAxis: [{
            type: 'category',
            name: '日期',
            nameTextStyle: {
              fontWeight: 'normal',
              verticalAlign: 'bottom',
              padding: 50,
              fontSize: 16
            },
            data: []
          }],
          yAxis: [
            {
              type: 'value',
              name: '电压（V）',
              nameLocation: 'middle',
              nameTextStyle: {
                fontWeight: 'normal',
                verticalAlign: 'top',
                padding: 20,
                fontSize: 16
              }
            }
          ],
          series: [
            {
              name: '用电量',
              type: 'line',
              smooth: true,
              data: []
            }
          ]
        },
        // 有功功率配置
        powerOption: {
          title: {
            text: '有功功率：（kw）'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              return params[0].axisValueLabel + '<br>有功功率：' + params[0].value + '<br>单位：kW·h'
            }
          },
          xAxis: [{
            type: 'category',
            name: '日期',
            nameTextStyle: {
              fontWeight: 'normal',
              verticalAlign: 'bottom',
              padding: 50,
              fontSize: 16
            },
            data: []
          }],
          yAxis: [
            {
              type: 'value',
              name: '有功功率（kw）',
              nameLocation: 'middle',
              nameTextStyle: {
                fontWeight: 'normal',
                verticalAlign: 'top',
                padding: 20,
                fontSize: 16
              }
            }
          ],
          series: [
            {
              name: '用电量',
              type: 'line',
              smooth: true,
              data: []
            }
          ]
        },
        // 无功功率
        nonPowerOption: {
          title: {
            text: '无功功率：（kw）'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              return params[0].axisValueLabel + '<br>无功功率：' + params[0].value + '<br>单位：kW·h'
            }
          },
          xAxis: [{
            type: 'category',
            name: '日期',
            nameTextStyle: {
              fontWeight: 'normal',
              verticalAlign: 'bottom',
              padding: 50,
              fontSize: 16
            },
            data: []
          }],
          yAxis: [
            {
              type: 'value',
              name: '无功功率（kw）',
              nameLocation: 'middle',
              nameTextStyle: {
                fontWeight: 'normal',
                verticalAlign: 'top',
                padding: 20,
                fontSize: 16
              }
            }
          ],
          series: [
            {
              name: '用电量',
              type: 'line',
              smooth: true,
              data: []
            }
          ]
        },
        // 电流
        electricityOption: {
          title: {
            text: '电流（A）'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              return params[0].axisValueLabel + '<br>电流：' + params[0].value + '<br>单位：A'
            }
          },
          xAxis: [{
            type: 'category',
            name: '日期',
            nameTextStyle: {
              fontWeight: 'normal',
              verticalAlign: 'bottom',
              padding: 50,
              fontSize: 16
            },
            data: []
          }],
          yAxis: [
            {
              type: 'value',
              name: '电流（A）',
              nameLocation: 'middle',
              nameTextStyle: {
                fontWeight: 'normal',
                verticalAlign: 'top',
                padding: 20,
                fontSize: 16
              }
            }
          ],
          series: [
            {
              name: '用电量',
              type: 'line',
              smooth: true,
              data: []
            }
          ]
        },
        // 电能
        electricEnergyOption: {
          title: {
            text: '无功功率：（kw）'
          },
          xAxis: [{
            type: 'category',
            name: '日期',
            nameTextStyle: {
              fontWeight: 'normal',
              verticalAlign: 'bottom',
              padding: 50,
              fontSize: 16
            },
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
          }],
          yAxis: [
            {
              type: 'value',
              name: '无功功率（kw）',
              nameLocation: 'middle',
              nameTextStyle: {
                fontWeight: 'normal',
                verticalAlign: 'top',
                padding: 20,
                fontSize: 16
              },
              min: 0,
              max: 1.5,
              interval: 0.25
            }
          ],
          series: [
            {
              name: '用电量',
              type: 'line',
              smooth: true,
              data: [0, 1, 0.25, 1.25, 1.5, 0.6, 0.5, 1.3, 1, 0.25, 1.25, 1.5, 0.6, 0.5, 1.3]
            }
          ]
        },
        // 功率因素
        powerFactorOption: {
          title: {
            text: '无功功率：（kw）'
          },
          xAxis: [{
            type: 'category',
            name: '日期',
            nameTextStyle: {
              fontWeight: 'normal',
              verticalAlign: 'bottom',
              padding: 50,
              fontSize: 16
            },
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
          }],
          yAxis: [
            {
              type: 'value',
              name: '无功功率（kw）',
              nameLocation: 'middle',
              nameTextStyle: {
                fontWeight: 'normal',
                verticalAlign: 'top',
                padding: 20,
                fontSize: 16
              },
              min: 0,
              max: 1.5,
              interval: 0.25
            }
          ],
          series: [
            {
              name: '用电量',
              type: 'line',
              smooth: true,
              data: [0, 1, 0.25, 1.25, 1.5, 0.6, 0.5, 1.3, 1, 0.25, 1.25, 1.5, 0.6, 0.5, 1.3]
              // markArea: {
              //   data: [ [{
              //     name: '早高峰',
              //     xAxis: '07:30'
              //   }, {
              //     xAxis: '10:00'
              //   }], [{
              //     name: '晚高峰',
              //     xAxis: '17:30'
              //   }, {
              //     xAxis: '21:15'
              //   }] ]
              // }
            }
          ]
        },
        activeName: 'power',
        eleboxOptions: [],
        drainVoltageChart: null,
        nodrainVoltageChart: null,
        electricityVoltageChart: null,
        electricEnergyVoltageChart: null,
        powerFactorVoltageChart: null,
        voltageChart: null
      }
    },
    created () {
      listElebox().then(res => {
        this.eleboxOptions = res.data
      })
      for (let i = 20; i > 0; i--) {
        this.dateArr.push(moment().day(-(i - 1)).format('MM-DD'))
      }
    },
    methods: {
      handleClick (tab, event) {
        switch (this.activeName) {
          case 'power':
            this.listEleboxPower()
            break
          case 'electricity':
            this.listEleboxElectric()
            break
          case 'voltage':
            this.listEleboxVoltage()
            break
          case 'electricEnergy':
            break
          case 'powerFactor':
            break
        }
        console.log(this.activeName)
      },
      getData () {
        let start = moment(this.form.selectDate[0])
        let end = moment(this.form.selectDate[1])
        let dif = end.diff(start, 'days')
        if (dif < 1 || dif > 20) {
          this.$message({
            message: '请选择正确的日期且日期间隔不能大于20天！',
            type: 'warning'
          })
          return
        }
        this.$refs['searchForm'].validate((valid) => {
          if (valid) {
            this.searchData = {
              eleboxId: this.form.eleboxId,
              startDate: this.form.selectDate[0].toString(),
              endDate: this.form.selectDate[1].toString()
            }
            switch (this.activeName) {
              case 'power':
                // 有功功率
                this.listEleboxPower()
                break
              case 'electricity':
                // 电流
                this.listEleboxElectric()
                break
              case 'voltage':
                // 电压
                this.listEleboxVoltage()
                break
              // case 'electricEnergy':
              //   // 电能
              //   listEleboxEnergyStatistic(params).then(res => {
              //     console.log(res, '请求功率数据')
              //     // 后续数据处理
              //   })
              //   break
              // case 'powerFactor':
              //   // 电压
              //   listEleboxPower(params).then(res => {
              //     console.log(res, '请求功率数据')
              //     // 后续数据处理
              //   })
              //   break
            }
          } else {
            return false
          }
        })
      },
      listEleboxPower () {
        listEleboxPower(this.searchData).then(res => {
          let date = []
          let dataNum = []
          res.data.forEach(d => {
            date.push(moment(d.realtimeDate).format('MM-DD hh:mm'))
            dataNum.push(d.eleboxPower || 0)
          })
          this.powerOption.xAxis[0].data = date
          // this.nonPowerOption.xAxis[0].data = date
          this.powerOption.series[0].data = dataNum
          // this.nonPowerOption.series[0].data = dataNum
          this.drainVoltageChart.setOption(this.powerOption)
          // this.nodrainVoltageChart.setOption(this.nonPowerOption)
        })
      },
      listEleboxElectric () {
        listEleboxElectric(this.searchData).then(res => {
          let date = []
          let dataNum = []
          res.data.forEach(d => {
            date.push(moment(d.realtimeDate).format('MM-DD hh:mm'))
            dataNum.push(d.electricity || 0)
          })
          this.electricityOption.xAxis[0].data = date
          this.electricityOption.series[0].data = dataNum
          this.electricityVoltageChart.setOption(this.electricityOption)
        })
      },
      listEleboxVoltage () {
        listEleboxVoltage(this.searchData).then(res => {
          let date = []
          let dataNum = []
          res.data.forEach(d => {
            date.push(moment(d.realtimeDate).format('MM-DD hh:mm'))
            dataNum.push(d.voltage || 0)
          })
          this.voltageOption.xAxis[0].data = date
          this.voltageOption.series[0].data = dataNum
          this.voltageChart.setOption(this.voltageOption)
        })
      }
    },
    mounted () {
      // 有功功率
      this.drainVoltageChart = echarts.init(document.getElementById('power'))
      this.listEleboxPower()
      // 无功功率
      // this.nodrainVoltageChart = echarts.init(document.getElementById('nonPower'))
      // this.nodrainVoltageChart.setOption(this.nonPowerOption)
      // 电流
      this.electricityVoltageChart = echarts.init(document.getElementById('electricity'))
      // 初始化电压
      this.voltageChart = echarts.init(document.getElementById('voltage'))
      // 电能
      // this.electricEnergyVoltageChart = echarts.init(document.getElementById('electricEnergy'))
      // this.electricEnergyVoltageChart.setOption(this.electricEnergyOption)
      // // 功率因数
      // this.powerFactorVoltageChart = echarts.init(document.getElementById('powerFactor'))
      // this.powerFactorVoltageChart.setOption(this.powerFactorOption)
    }
  }
  // 使用刚指定的配置项和数据显示图表。
  // myChart.setOption(option);
</script>

<style>
  .cont-inpts {
    height: 90px;
    padding: 20px 0 0 10px;
    background: white;
  }

  .echarts-lines {
    padding: 25px;
    padding-top: 0px;
    margin-top: 20px;
    background: white;
  }

  #voltage, #power, #electricity, #nonPower, #electricity, #electricEnergy, #powerFactor {
    height: 500px;
    width: 1000px;
  }
</style>

