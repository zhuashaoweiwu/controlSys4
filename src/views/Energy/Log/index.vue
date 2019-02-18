<template>
  <div class="history">
    <div class="search-header">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input label="UUID" placeholder="请输入UUID" v-model="searchUid"></el-input>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="selectDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button @click="searchLog">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table-content">
      <el-table
        :data="logList"
        style="width: 100%">
        <el-table-column
          prop="uid"
          label="唯一编码"
          width="320">
        </el-table-column>
        <el-table-column
          prop="longitude"
          label="经度"
          width="150">
        </el-table-column>
        <el-table-column
          prop="latitude"
          label="纬度"
          width="150">
        </el-table-column>
        <el-table-column
          prop="beam"
          label="时间"
          width="180">
          <template slot-scope="scope">
            {{scope.row.signalLogDate|timeFormat1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="unit"
          label="组织"
          width="120">
        </el-table-column>
        <el-table-column
          prop="signalIntensity"
          label="信号强弱"
          width="120">
          <template slot-scope="scope">
            {{scope.row.signalIntensity?'强':'弱'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="signalLevel"
          label="信号等级"
          width="120">
          <template slot-scope="scope">
            {{scope.row.signalLevel?'高':'低'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="onlineState"
          label="在线状态">
          <template slot-scope="scope">
            {{scope.row.onlineState?'在线':'不在线'}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page.sync="pageNumber"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="pageTotal">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import {listLightSignalLog} from '@/api/EnergyAnalyze/energyanalyze'

  export default {
    name: 'EnergyMonitor',
    data () {
      return {
        pickerOptions: { // 日期只能选择当前日期
          disabledDate (time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        searchUid: '',
        selectDate: [moment().subtract(1, 'days').toDate(), moment().toDate()],
        pageNumber: 1,
        pageSize: 10,
        pageTotal: 0,
        logList: []
      }
    },
    methods: {
      searchLog () {
        this.listLightSignalLog()
      },
      sizeChange (val) {
        this.pageSize = val
        this.listLightSignalLog()
      },
      currentChange (val) {
        this.pageNumber = val
        this.listLightSignalLog()
      },
      listLightSignalLog () { // 获取信号日志
        let postData = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          startDate: this.selectDate[0].toString(),
          endDate: this.selectDate[1].toString()
        }
        if (this.searchUid) {
          postData.uuid = this.searchUid
        }
        listLightSignalLog(postData).then(res => {
          if (res.data.length) {
            this.pageTotal = res.total
            this.logList = res.data
            console.log(res.data)
          }
        }).catch(res => {
          this.$message({
            message: '请求失败',
            type: 'warning'
          })
        })
      }
    },
    created () {
      this.listLightSignalLog()
    }
  }
</script>
<style scoped rel="stylesheet/scss">
  .search-header {
    background: #fff;
    padding: 20px;
    min-height: 80px;
    margin-bottom: 20px;
  }

  .table-content {
    padding: 20px;
    background: #fff;
  }
</style>
