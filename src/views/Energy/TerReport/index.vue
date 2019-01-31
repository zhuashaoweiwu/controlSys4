<template>
  <div class="ter-report">
    <div class="cont-inpts">
      <el-form label-width="80px">
        <el-row type="flex" class="row-bg">
          <el-col :span="5">
            <el-form-item label="日期" prop="startDate">
              <el-date-picker
                v-model="selectDate"
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
              <el-button type="primary" @click="this.changeData" plain>查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="content">
      <el-row class="content-row">
        <el-col :span="4" class="el-select">
          <div class="el-dialog__title">灯具选择：</div>
          <el-tree :data="lightData" :props="defaultProps" @check="lightSelect" show-checkbox node-key="id" ref="tree">
          </el-tree>
        </el-col>
        <el-col :span="20" class="result">
          <el-table
            :data="voltageElectric"
            style="width: 100%">
            <el-table-column
              prop="uid"
              label="灯具唯一编码"
              width="150">
            </el-table-column>
            <el-table-column
              prop="voltage"
              label="记录电压"
              width="120">
            </el-table-column>
            <el-table-column
              prop="electricty"
              label="记录电流"
              width="120">
            </el-table-column>
            <el-table-column
              prop="beam"
              label="记录光照"
              width="120">
            </el-table-column>
            <el-table-column
              prop="dampness"
              label="记录湿度"
              width="120">
            </el-table-column>
            <el-table-column
              prop="temperature"
              label="记录温度"
              width="120">
            </el-table-column>
            <el-table-column
              prop="recordDatetime"
              label="记录日期">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import {listLightAvgVoltage, listLightAvgElectric, listLightAvgPower} from '@/api/EnergyAnalyze/energyanalyze'
  import {listLightGroup} from '@/api/GisService/lamp'

  export default {
    name: 'TerReport',
    data () {
      return {
        lightData: [],
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        selectDate: [moment().subtract(20, 'days').toDate(), moment().toDate()],
        defaultProps: {
          children: 'lightingList',
          label: 'mem'
        },
        selectIds: [],
        voltageElectric: []
      }
    },
    methods: {
      changeData () {
        this.listLightAvgVoltage()
      },
      lightSelect (val) {
        let ids = this.$refs['tree'].getCheckedKeys()
        this.lightData.forEach(d => {
          if (ids.includes(d.id)) {
            ids.splice(ids.indexOf(d.id), 1)
          }
        })
        this.selectIds = ids
        this.listLightAvgVoltage()
      },
      listLightAvgVoltage () {
        listLightAvgVoltage(this.selectIds, this.selectDate[0].toString(), this.selectDate[1].toString()).then(res => {
          this.voltageElectric = res.data
          res.data.length && res.data.forEach(d => {
            d.recordDatetime = moment(d.recordDatetime).format('YYYY-MM-DD hh:mm:ss')
          })
          if (!res.data.length) {
            this.$message({
              message: '当前无数据',
              type: 'default'
            })
          }
        }).catch(res => {
          this.$message({
            message: '请求失败',
            type: 'warning'
          })
        })
      }
    },
    mounted () {
      // 初始化电压
    },
    created () {
      listLightGroup().then(res => {
        this.lightData = res.data
        res.data.forEach((d, i) => {
          d.mem = d.mem || '灯具分组' + (i + 1)
        })
      })
    }
  }
</script>

<style lang="scss" scoped>
  .el-select {
    border-right: 2px solid #F6F7FB;
    min-height: 400px;
  }

  .result {
    padding: 0 10px;
  }

  .cont-inpts {
    height: 92px;
    padding-top: 20px;
    background: white;
    margin-bottom: 20px;
  }

  .content {
    min-height: 500px;
    background: #fff;
    padding-top: 0;
  }

  .content-row {
    padding: 20px 30px;
  }

  .el-tree {
    padding: 10px 0;
  }
</style>
