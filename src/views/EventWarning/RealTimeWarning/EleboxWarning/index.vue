<template>
  <div id="EleboxWarning">
    <div id="searchForm">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="设备类型">
          <el-select v-model="alarmSource" placeholder="请选择设备类型">
            <el-option label="控制柜" value="控制柜"></el-option>
            <el-option label="常规灯具" value="常规灯具"></el-option>
            <el-option label="防盗" value="防盗"></el-option>
            <el-option label="太阳能" value="太阳能"></el-option>
            <el-option label="单灯控制器" value="单灯控制器"></el-option>
          </el-select>
        </el-form-item>
        <span class="demonstration">起止时间</span>
        <el-date-picker
          v-model="alarmTimeValue"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
        <el-form-item>
          <el-button type="primary" @click="getListAlarm">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id="dataTable">
      <div class="operator">
        <el-button type="primary" icon="el-icon-delete" @click="handleDeletAlarm()" :disabled="!selectIds.length">清理警报
        </el-button>
        <el-button type="primary" icon="el-icon-download" @click="handleImportAlarm()" :disabled="!selectIds.length">
          导出实时报警
        </el-button>
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
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleGetDetail(scope.row)" type="text" size="small">查看详细信息</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--详细信息弹窗-->
      <el-dialog
        title="详细信息"
        :visible.sync="alarmDetailVisible"
        width="80%">
        <el-table
          :data="tableData"
          style="width: 100%">
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
        <span slot="footer" class="dialog-footer">
          <el-button @click="alarmDetailVisible = false">关闭</el-button>
        </span>
      </el-dialog>
      <div class="pagelist-block">
        <el-pagination
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
  import {getListAlarm, getAlarm, clearAlarm, exportAlarm} from '@/api/EventWarning/EventWarning'
  import moment from 'moment'
  import '../../../../utils/filter.js'

  export default {
    name: 'Elebox',
    data () {
      return {
        alarmDetailVisible: false,
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
        tableData: [],
        pageNumber: 1,
        pageSize: 10,
        alarmSource: '控制柜',
        alarmTimeValue: [],
        pageTotal: 0
      }
    },
    computed: {},
    methods: {
      getListAlarm () { // 获取报警列表
        let start = this.alarmTimeValue[0] && this.alarmTimeValue[0].toString()
        let end = this.alarmTimeValue[1] && this.alarmTimeValue[1].toString()
        getListAlarm(this.pageNumber, this.pageSize, this.alarmSource, start, end).then((res) => {
          this.tableData = res.data
          if (res.total % 10 < 10) {
            this.pageTotal = this.pageNumber
          } else {
            this.pageTotal = this.pageNumber * 10 + 1
          }
        })
      },
      // 打开详细信息弹窗
      handleGetDetail (row) {
        this.alarmDetailVisible = true
        // let curId = row.nnlightctlAlarmConfigId ? row.nnlightctlAlarmConfigId : 1
        // if (curId) {
        //   getAlarm(curId).then((res) => {
        //     console.log(res, '详细信息')
        //   })
        // }
      },
      // 删除警报信息
      handleDeletAlarm () {
        let alarmIds = []
        if (this.selectIds) {
          alarmIds = this.selectIds
        }
        clearAlarm(alarmIds).then((res) => {
          this.$message({
            type: 'success',
            message: '清理成功'
          })
        })
      },
      // 导出信息
      handleImportAlarm () {
        let alarmIds = []
        if (this.selectIds) {
          alarmIds = this.selectIds
        }
        exportAlarm(alarmIds)
      },
      // 时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        if (date === undefined) {
          return ''
        }
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      },
      // 选中处理ids集合
      handleSelectionChange (val) {
        this.multipleSelection = val
        if (val) {
          this.selectIds = val.map((item, index) => {
            return item.nnlightctlAlarmConfigId
          })
        }
        console.log(this.selectIds)
      },
      handleCurrentChange (val) {
        this.pageNumber = val
        this.getListAlarm()
      }
    },
    created () {
      this.getListAlarm()
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

  .operator {
    margin-bottom: 20px;
  }

  .demonstration {
    font-size: 14px;
    color: #606266;
    font-weight: 700;
    padding-right: 10px;
  }
</style>
