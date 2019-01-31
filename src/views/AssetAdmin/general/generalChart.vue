<template>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <div ref="myChart" :style="{width: '500px', height: '400px'}"></div>
        </div>
      </el-col>
</template>
<script>
  export default {
    name: 'demp',
    props: ['pieData'],
    data () {
      return {
        pieOptions: {
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
              data: []
            }
          ]
        }
      }
    },
    mounted () {
      this.pieOptions.series[0].data = this.pieData
      this.repairPie()
    },
    created () {
    },
    watch: {
      pieData: function (val) {
        this.pieOptions.series[0].data = val
        this.repairPie()
      }
    },
    methods: {
      repairPie () {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(this.$refs.myChart)
        // 绘制图表
        myChart.clear()
        myChart.setOption(this.pieOptions, true)
      }
    }
  }
</script>
