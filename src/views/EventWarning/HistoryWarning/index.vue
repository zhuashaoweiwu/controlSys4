/*
* @Author: Ouber23
* @Date: 2018-08-14 04:49:28
* @LastEditors: Ouber23
* @LastEditTime: 2018-08-14 04:54:59
*/
<template>
  <div id="EleboxWarning">
    <div id="searchForm">
      <el-form :inline="true" class="demo-form-inline">
        <span class="demonstration">起止时间</span>
        <el-date-picker
          v-model="alarmTimeValue"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
        <el-form-item>
          <el-button type="primary" @click="getHistoryAlarmData">查询</el-button>
        </el-form-item>
        <!--<el-form-item>-->
        <!--<el-button type="primary" @click="onResume">重置</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <div id="dataTable">
      <div class="operator">
        <el-button type="primary" icon="el-icon-delete" @click="clearAlarmHistory" :disabled="!selectIds.length">清理历史报警</el-button>
      </div>
      <el-table
        :data="tableData"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          width="80">
        </el-table-column>
        <el-table-column
          prop="alarmLevel"
          label="等级"
          width="80">
        </el-table-column>
        <el-table-column
          prop="codeNumber"
          label="控制柜/区域"
          width="120">
        </el-table-column>
        <el-table-column
          prop="alarmSource"
          label="来自"
          width="120">
        </el-table-column>
        <el-table-column
          prop="gmtCreated"
          :formatter="dateFormat"
          label="创建时间"
          width="150">
        </el-table-column>
        <el-table-column
          prop="gmtUpdated"
          :formatter="dateFormat"
          label="更新时间"
          width="150">
        </el-table-column>
        <el-table-column
          prop="ctype"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="nnlightctlAlarmConfigId"
          label="警報配置ID">
        </el-table-column>
        <el-table-column
          prop="alarmTime"
          :formatter="dateFormat"
          label="报警/解除时间">
        </el-table-column>
        <el-table-column
          prop="msg"
          label="消息">
        </el-table-column>
        <el-table-column
          prop="alarmCount"
          label="次数">
        </el-table-column>
      </el-table>
      <div class="pagelist-block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNumber"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {listAlarmHistory, clearAlarmHistory} from '@/api/EventWarning/EventWarning'
  import '../../../utils/filter.js'
  import moment from 'moment'

  export default {
    name: 'Elebox',
    data () {
      return {
        tableData: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        selectIds: [], // 选中的id数组
        alarmDetailData: [],
        pageNumber: 1,
        pageSize: 10,
        alarmSource: '控制柜',
        alarmTimeValue: [],
        pageTotal: 0
      }
    },
    computed: {},
    methods: {
      handleSelectionChange (val) {
        this.multipleSelection = val
        if (val) {
          this.selectIds = val.map((item, index) => {
            return item.id
          })
        }
        console.log(this.selectIds)
      },
      getHistoryAlarmData () {
        let start = this.alarmTimeValue[0] && this.alarmTimeValue[0].toString()
        let end = this.alarmTimeValue[1] && this.alarmTimeValue[1].toString()
        listAlarmHistory(this.pageNumber, this.pageSize, start, end).then((res) => {
          if (res.total % 10 < 10) {
            this.pageTotal = this.pageNumber
          } else {
            this.pageTotal = this.pageNumber * 10 + 1
          }
          // console.log(res, '历史数据')
          this.tableData = res.data // 数据初始化
        })
      },
      clearAlarmHistory () {
        clearAlarmHistory(this.selectIds).then(res => {
          this.$message({
            message: '清除成功',
            type: 'success'
          })
        })
      },
      // 时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        if (date === undefined) {
          return ''
        }
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      },
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange (val) {
        console.log(`当前页: ${val}`)
      }
    },
    created () {
      this.getHistoryAlarmData()
    }
  }
</script>

<style lang="scss" scoped>
  #searchForm {
    padding-left: 32px;
    padding-top: 10px;
  }

  #dataTable {
    padding-left: 32px;
    padding-top: 10px;
    padding-right: 32px;
  }

  .demonstration {
    font-size: 14px;
    color: #606266;
    font-weight: 700;
    padding-right: 10px;
  }

  .operator {
    margin-bottom: 20px;
  }
</style>
