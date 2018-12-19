<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <div id="myChart" :style="{width: '500px', height: '400px'}"></div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">
          <div id="myChart1" :style="{width: '800px', height: '400px'}"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    name: 'demp',
    data () {
      return {}
    },
    mounted () {
      this.repairPie()
      this.monthNumber()
    },
    methods: {
      repairPie () {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption(
          {
            title: {
              text: '设备维修情况分布',
              // subtext: '纯属虚构',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              x: 'center',
              data: ['故障个数', '灯杆']
            },
            series: [
              {
                name: '维修情况',
                type: 'pie',
                radius: ['30%', '70%'],
                avoidLabelOverlap: true,
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
                  {value: 10, name: '灯具'},
                  {value: 15, name: '灯具1'}
                ]
              }
            ]
          }
        )
      },
      monthNumber () {
        let myChart = this.$echarts.init(document.getElementById('myChart1'))
        // 绘制图表
        myChart.setOption(
          {
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
              data: [820, 932, 901, 934, 1290, 1330, 1320, 125, 1561, 548, 456, 548],
              type: 'line',
              areaStyle: {}
            }]
          }
        )
      }
    }
  }
</script>
