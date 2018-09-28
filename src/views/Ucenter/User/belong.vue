<template>
  <div class="system-container">
      <div class="system-top clearfix">
        <div class="item-block f-l">
          <span class="title">条件</span>
          <el-select v-model="value" placeholder="请选择">
            <!-- <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option> -->
          </el-select>
        </div>
        <div class="item-block f-l">
          <span class="title">属于</span>
          <el-select v-model="value" placeholder="请选择">
            <!-- <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option> -->
          </el-select>
        </div>
        <div class="item-block f-l">
          <span class="title">项目</span>
          <el-select v-model="value" placeholder="请选择">
            <!-- <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option> -->
          </el-select>
        </div>
        <div class="btn-block f-r">
          <el-button type="primary">查询</el-button>
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
              prop="provinceName"
              label="授权用户"
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
            :total="allTotal">
          </el-pagination>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'organization',
  data () {
    return {
      pageNumber: 1,
      pageSize: 10,
      currentPage: 1,
      allTotal: null,
      List: []
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.pageNumber = val
      // 翻页请求
    },
    handleSizeChange (val) {
      this.pageSize = val
    }
  },
  created () {
  },
  destroyed () {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* reset element-ui css */
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .input-with-select{
    width: 285px;
  }
</style>
