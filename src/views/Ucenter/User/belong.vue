<template>
  <div class="system-container">
    <div class="system-top clearfix">
      <div class="item-block f-l">
        <span class="title">所属机构</span>
        <el-select v-model="selectInstitution" placeholder="请选择" @change="changeSelect">
          <el-option
            v-for="item in selectInstitutionOptions"
            :key="item.id"
            :label="item.institutionName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="btn-block f-r">
        <el-button type="primary" @click="getProjectsByInstitutionId">查询</el-button>
      </div>
    </div>
    <div class="system-center">
      <div class="data-list">
        <el-table
          ref="multipleTable"
          :data="projectList"
          tooltip-effect="dark"
          style="width: 100%"
          header-row-class-name="datalist-header">
          <el-table-column
            prop="projectName"
            fixed="left"
            label="项目"
            width="100">
          </el-table-column>
          <el-table-column
            prop="countryName"
            label="机构"
            width="100">
          </el-table-column>
          <el-table-column
            prop="state"
            label="项目状态"
            width="100">
          </el-table-column>
          <el-table-column
            prop="mem"
            label="项目备注">
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
          :total="listTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {listInstitution, getProjectsByInstitutionId} from '../../../api/RoadLighting/userAdmin'

  export default {
    name: 'organization',
    data () {
      return {
        pageNumber: 1,
        pageSize: 10,
        currentPage: 1,
        selectInstitution: '',
        selectInstitutionOptions: [],
        projectList: [],
        listTotal: 0
      }
    },
    methods: {
      handleCurrentChange (val) {
        this.pageNumber = val
        // 翻页请求
      },
      handleSizeChange (val) {
        this.pageSize = val
      },
      changeSelect (val) {
        this.selectInstitution = val
        console.log(val)
      },
      getProjectsByInstitutionId () {
        getProjectsByInstitutionId(this.selectInstitution).then(res => {
          res.data.forEach(d => {
            d.state = d.state ? '已启用' : '未启用'
          })
          this.projectList = res.data
          this.listTotal = res.total
        })
      }
    },
    created () {
      listInstitution().then(res => {
        this.selectInstitutionOptions = res.data
      })
    },
    destroyed () {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  /* reset element-ui css */
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .input-with-select {
    width: 285px;
  }
</style>
