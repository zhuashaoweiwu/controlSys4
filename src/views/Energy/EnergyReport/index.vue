<template>
  <div class="ter-report">
    <div class="cont-inpts">
      <el-form ref="searchForm" :model="form" :rules="rules" label-width="80px">
        <el-row type="flex" class="row-bg">
          <!--<el-col :span="6">-->
            <!--<el-form-item label="控制柜" prop="eleboxId">-->
              <!--<el-select v-model="form.eleboxId" placeholder="请选择">-->
                <!--<el-option-->
                  <!--v-for="item in eleboxOptions"-->
                  <!--:key="item.uid"-->
                  <!--:label="item.codeNumber"-->
                  <!--:value="item.uid">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="8">
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
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="changeData" plain>查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="echarts-lines">
      <el-table
        :data="powerData"
        style="width: 100%">
        <el-table-column
          type="index"
          width="100">
        </el-table-column>
        <el-table-column
          prop="uid"
          label="控制柜UID"
          width="240">
        </el-table-column>
        <el-table-column
          prop="aActivepower"
          label="A相序有功功率"
          width="200">
        </el-table-column>
        <el-table-column
          prop="bActivepower"
          label="B相序有功功率"
          width="200">
        </el-table-column>
        <el-table-column
          prop="cActivepower"
          label="C相序有功功率"
          width="200">
        </el-table-column>
        <el-table-column
          prop="totalActiveEnergy"
          label="当前总能">
        </el-table-column>
      </el-table>
      <!--<el-tabs v-model="activeName" @tab-click="handleClick">-->
      <!--<el-tab-pane label="功率" name="power">-->
      <!--<div id="power"></div>-->
      <!--<div id="nonPower"></div>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="电流" name="electricity">-->
      <!--<div id="electricity"></div>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="电压" name="voltage">-->
      <!--<div id="voltage">sddsd</div>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="电能" name="electricEnergy">-->
      <!--<div id="electricEnergy"></div>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="功率因素" name="powerFactor">-->
      <!--<div id="powerFactor"></div>-->
      <!--</el-tab-pane>-->
      <!--</el-tabs>-->
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import moment from 'moment'
  import {listEleboxEnergyStatistic, getEleboxEnergyStatistic} from '@/api/EnergyAnalyze/energyanalyze'
  import {listElebox} from '@/api/RoadLighting/deploy'
  // 基于准备好的dom，初始化echarts实例
  // let myChart = echarts.init(document.getElementById('voltage'));
  export default {
    name: 'TerReport',
    data () {
      return {
        eleboxOptions: [],
        postData: {},
        powerData: [],
        form: {
          eleboxId: '',
          selectDate: [moment().subtract(20, 'days').toDate(), moment().toDate()]
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
        activeName: 'power'
      }
    },
    methods: {
      handleClick (tab, event) {
        console.log(this.activeName)
      },
      changeData () {
        this.listEleboxEnergyStatistic()
      },
      listEleboxEnergyStatistic () {
        listEleboxEnergyStatistic(this.form.selectDate[0].toString(), this.form.selectDate[1].toString()).then(res => {
          this.powerData = res.data
        })
      }
    },
    created () {
      listElebox().then(res => {
        this.eleboxOptions = res.data
        this.form.eleboxId = res.data[0].uid
      })
    },
    mounted () {
      // 初始化电压
      // var myChart = echarts.init(document.getElementById('voltage'))
      // myChart.setOption(this.voltageOption)
      listEleboxEnergyStatistic(this.form.selectDate[0].toString(), this.form.selectDate[1].toString()).then(res => {
        this.powerData = res.data
      })
    }
  }
  // 使用刚指定的配置项和数据显示图表。
  // myChart.setOption(option);
</script>

<style>
  .cont-inpts {
    height: 92px;
    padding-top: 20px;
    background: white;
  }

  .echarts-lines {
    padding: 25px;
    padding-top: 0px;
    margin-top: 25px;
    background: white;
  }

  .search {
    padding: 25px;
  }

  #voltage, #power, #electricity, #nonPower, #electricity, #electricEnergy, #powerFactor {
    height: 500px;
    width: 1000px;
  }
</style>

