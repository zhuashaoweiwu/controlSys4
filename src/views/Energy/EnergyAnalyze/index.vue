<template>
  <div class="energy-analyze">
    <h4 class="analyze-title">用电量</h4>
    <div class="main">
      <el-row :gutter="60" class="el-padding" v-if="energyConsume">
        <el-col :span="5">
          <div class="grid-content grid-kwh grid1">
            <h5>今年</h5>
            <p>{{parseFloat(energyConsume[2].totalEnergy/1000).toFixed(3)}} kW·h</p>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content grid-kwh grid2">
            <h5>本月</h5>
            <p>{{parseFloat(energyConsume[1].totalEnergy/1000).toFixed(3)}} kW·h</p>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content grid-kwh grid3">
            <h5>昨天</h5>
            <p>{{parseFloat(energyConsume[0].totalEnergy/1000).toFixed(3)}} kW·h</p>
          </div>
        </el-col>
        <el-col :span="9" class="grid-kwh"></el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <div class="grid-content bg-purple" id="mainEcharts" :style="{width:'663px',height:'572px'}"></div>
        </el-col>
        <el-col :span="9">
          <div class="grid-content bg-purple-light" id="mainEchartsBing" :style="{width:'356px',height:'278px'}"></div>
          <div class="grid-content bg-purple-light" id="mainEchartsDayMonth"
               :style="{width:'356px',height:'278px'}"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import {getCommonEnergyStatistic, listEnergyStatisticByDay} from '@/api/EnergyAnalyze/energyanalyze'
  export default {
    name: 'EnergyAnalyze',
    data () {
      return {
        keyss: true,
        energyConsume: [{totalEnergy: 0}, {totalEnergy: 0}, {totalEnergy: 0}],
        // 图表配置项
        curMonthechartsOption: {
          title: {
            text: '月能耗'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              return params[0].axisValueLabel + '<br>用电量：' + params[0].value + '<br>单位：kW·h'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              name: '日期',
              nameTextStyle: {
                align: 'center'
              },
              type: 'category',
              data: ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7', '1-8', '1-9', '1-10', '1-11', '1-12']
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '耗电量（kW·h）',
              nameLocation: 'middle',
              nameTextStyle: {
                fontWeight: 'bold',
                verticalAlign: 'top',
                padding: 10,
                fontSize: 16
              },
              min: 0
            }
          ],
          series: [
            {
              name: '用电量',
              type: 'bar',
              barWidth: 20,
              data: []
            }
          ]
        },
        monthYearRateOptions: {
          title: {
            text: '月能耗与本年能耗',
            subtext: '月/年比例',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} kW·h({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: ['本月能耗', '本年能耗']
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {
                show: true,
                type: ['pie', 'funnel'],
                option: {
                  funnel: {
                    x: '25%',
                    width: '50%',
                    funnelAlign: 'left'
                  }
                }
              },
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          calculable: true,
          series: [
            {
              name: '能耗比例',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              minAngle: 15,
              data: [
                {value: 0, name: '本月能耗'},
                {value: 0, name: '本年能耗'}
              ]
            }
          ]
        },
        dayMonthRateOptions: {
          title: {
            text: '本天能耗与本月能耗',
            subtext: '本天/本月比例',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} kW·h({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: ['本天能耗', '本月能耗']
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {
                show: true,
                type: ['pie', 'funnel'],
                option: {
                  funnel: {
                    x: '25%',
                    width: '50%',
                    funnelAlign: 'left'
                  }
                }
              },
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          calculable: true,
          series: [
            {
              name: '能耗比例',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              minAngle: 15,
              data: [
                {value: 0, name: '本天能耗'},
                {value: 0, name: '本月能耗'}
              ]
            }
          ]
        }
      }
    },
    created () {
      // 组件创建成功拉取数据
      this.$nextTick(function () {
        getCommonEnergyStatistic().then(res => {
          console.log(res)
          this.energyConsume = res.data ? res.data : [{total: '暂无数据'}, {total: '暂无数据'}, {total: '暂无数据'}]
          // 处理饼状图
          let temBingData = [
            {
              name: '本月能耗',
              value: parseFloat(res.data[1].totalEnergy / 1000).toFixed(3)
            },
            {
              name: '本年能耗',
              value: parseFloat(res.data[2].totalEnergy / 1000).toFixed(3)
            }
          ]
          let temBingDayMonthData = [
            {
              name: '本天能耗',
              value: parseFloat(res.data[0].totalEnergy / 1000).toFixed(3)
            },
            {
              name: '本月能耗',
              value: parseFloat(res.data[1].totalEnergy / 1000).toFixed(3)
            }
          ]
          // 初始化异步数据
          this.monthYearRateOptions.series[0].data = temBingData
          this.dayMonthRateOptions.series[0].data = temBingDayMonthData
          // 重新渲染饼状图
          let myChartBing1 = echarts.init(document.getElementById('mainEchartsBing'))
          let myChartBing2 = echarts.init(document.getElementById('mainEchartsDayMonth'))
          myChartBing1.setOption(this.monthYearRateOptions)
          myChartBing2.setOption(this.dayMonthRateOptions)
        })
        let date = new Date()
        let curMonth = date.getMonth() + 1
        listEnergyStatisticByDay(curMonth).then(res => {
          let curMonthxData = []
          let curMonthxTotal = []
          if (res.data) {
            let curMtolDay = date.getDate()
            let comArr = []
            let curM = (date.getMonth() + 1) >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
            for (var d = 1; d <= curMtolDay; d++) {
              let dateString = d < 10 ? `${date.getFullYear()}-${curM}-0${d}` : `${date.getFullYear()}-${curM}-${d}`
              let filterArr = res.data.filter((item, index) => { // 无数据
                return item.date === dateString
              })
              if (filterArr.length === 0) {
                let dayData1 = {
                  date: dateString,
                  total: 0
                }
                comArr.push(dayData1)
              } else {
                let dayData = res.data.filter((item, index) => { // 无数据
                  return item.date === dateString
                })
                comArr.push(dayData[0])
              }
            }
            curMonthxData = comArr.map((item, index) => {
              let reg = /^(\d{4})-([\s\S]+)$/g
              reg.test(item.date)
              // console.log(RegExp.$2)
              return RegExp.$2
            })
            curMonthxTotal = comArr.map((item, index) => {
              return item.energy / 1000
            })
            this.curMonthechartsOption.xAxis[0].data = curMonthxData
            this.curMonthechartsOption.series[0].data = curMonthxTotal
            let myChart = echarts.init(document.getElementById('mainEcharts'))
            myChart.setOption(this.curMonthechartsOption)
          }
        })
      })
    },
    mounted () {
      if (document.getElementById('mainEcharts')) {
        let myChart = echarts.init(document.getElementById('mainEcharts'))
        let myChartBing = echarts.init(document.getElementById('mainEchartsBing'))
        let myChartDayMonth = echarts.init(document.getElementById('mainEchartsDayMonth'))
        myChart.setOption(this.curMonthechartsOption)
        myChartBing.setOption(this.monthYearRateOptions)
        myChartDayMonth.setOption(this.dayMonthRateOptions)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  // .energy-analyze {
  //   // background: red;
  // }

  .energy-analyze {
    padding-top: 14px;
    padding-left: 20px;
    background: #F5F7FA;
  }

  .analyze-title {
    padding-left: 12px;
    font-size: 14px;
    height: 20px;
    line-height: 20px;
  }

  .grid-kwh {
    padding-left: 15px;

    h5 {
      font-size: 17px;
      height: 50px;
      line-height: 50px;
      color: #000;
    }

    p {
      font-size: 18px;
      height: 50px;
      line-height: 50px;
    }
  }

  .grid1 {
    border: 1px solid #1c9cf2;
    border-radius: 10px;
    color: #1c9cf2;
  }

  .grid2 {
    border: 1px solid #00ffff;
    border-radius: 10px;
    color: #00ffff;
  }

  .grid3 {
    border: 1px solid aquamarine;
    border-radius: 10px;
    color: aquamarine;
  }

  .el-padding {
    padding: 30px;
    background: white;
  }
</style>
