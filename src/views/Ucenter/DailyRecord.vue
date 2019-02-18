<template>
  <div class="system-container">
    <div class="top clearfix">
      <div class="item-block f-l">
        <el-date-picker
          style="width:350px"
          v-model="selectTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </div>
      <div class="item-block f-l">
        <div class="f-l">
          <el-input v-model="searchObj.content" placeholder="请输入日志内容"></el-input>
        </div>
      </div>
      <div class="item-block f-l">
        <div class="f-l">
          <el-select v-model="searchObj.userId" placeholder="请选择用户">
            <el-option v-for="u in userData" :key="u.id"
                       :label="u.userName"
                       :value="u.id"></el-option>
          </el-select>
        </div>
      </div>
      <div class="btn-block f-l">
        <el-button @click="goSearch" type="primary">查询</el-button>
      </div>
    </div>
    <div class="system-center">
      <div class="data-list">
        <el-table
          ref="multipleTable"
          :data="List"
          tooltip-effect="dark"
          style="width: 100%"
          header-row-class-name="datalist-header">
          <el-table-column
            prop="loginName"
            fixed="left"
            label="账号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="用户"
            width="100">
          </el-table-column>
          <el-table-column
            prop="operationDesc"
            label="执行操作">
          </el-table-column>
          <!-- <el-table-column
            prop="mem"
            label="描述">
          </el-table-column> -->
          <el-table-column
            label="操作时间"
            width="200">
            <template slot-scope="scope">
              {{scope.row.operationTime|timeFormat1}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagelist-block">
        <el-pagination
          @size-change="handleSizeChange"
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="allTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {listUserOpLog, listUser} from '@/api/RoadLighting/userAdmin'
  import '../../utils/filter.js'

  export default {
    name: 'DailyRecord',
    data () {
      return {
        pageNumber: 1,
        pageSize: 10,
        currentPage: 1,
        allTotal: null,
        List: [],
        selectTime: null,
        searchObj: {
          content: '',
          userId: '',
          operationType: ''
        },
        userData: [],
        pickerOptions: { // date控件转换
          disabledDate (time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        }
      }
    },
    methods: {
      handleCurrentChange (val) {
        this.pageNumber = val
        this.getList()
        // 翻页请求
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.getList()
        // 改变每页条数
      },
      selectTimeFun () { // 时间转换
        if (this.selectTime !== null) {
          this.searchObj.startDate = new Date(this.selectTime[0]).toString()
          this.searchObj.endDate = new Date(this.selectTime[1]).toString()
        }
      },
      goSearch () { // 查找
        this.getList()
      },
      getList () { // 获取列表
        this.selectTimeFun()
        this.searchObj.pageNumber = this.pageNumber
        this.searchObj.pageSize = this.pageSize
        listUserOpLog(this.searchObj).then(response => {
          this.List = response.data
          if (this.List.length > 0) {
            this.allTotal = response.total
          } else {
            this.allTotal = 0
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    created () {
      // 获取用户信息
      listUser().then(res => {
        this.userData = res.data || []
      })
      this.getList()
    },
    destroyed () {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  /* reset element-ui css */
  .el-date-editor .el-range-separator {
    width: 10%
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .input-with-select {
    width: 285px;
  }

  .system-container .system-top .item-block {
    width: initial;
  }

  .top {
    padding: 20px 0 0;

    > div {
      margin-left: 20px;
    }
  }
</style>
