<template>
  <div class="system-container">
    <div class="system-top clearfix">
      <div class="item-block f-l">
        <span class="title">区域名称</span>
        <el-input placeholder="请输入内容" v-model="areaName"></el-input>
      </div>
      <div class="btn-block f-r">
        <el-button type="primary" @click="getList">查询</el-button>
      </div>
    </div>
    <div class="system-center">
      <div class="operation-bar">
        <el-button @click="addBlock()" type="primary">增加区域</el-button>
        <el-button @click="deleteRow(2)">批量删除</el-button>
      </div>
      <div class="data-list">
        <el-table
          ref="lightTypeTable"
          :data="List"
          tooltip-effect="dark"
          style="width: 100%"
          header-row-class-name="datalist-header"
          @selection-change="handleSelectionChange">
          <el-table-column
            fixed
            type="selection"
            width="40">
          </el-table-column>
          <el-table-column
            prop="areaName"
            label="区域名称"
            width="200">
          </el-table-column>
          <el-table-column
            label="创建时间"
            width="150">
            <template slot-scope="scope">
              {{scope.row.gmtCreated|timeFormat}}
            </template>
          </el-table-column>
          <el-table-column
            label="修改时间"
            width="150">
            <template slot-scope="scope">
              {{scope.row.gmtUpdated|timeFormat}}
            </template>
          </el-table-column>
          <el-table-column
            prop="regionDesc"
            label="区域介绍">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="editRow(scope.$index)"
                type="text"
                size="small">
                编辑
              </el-button>
              <el-button
                class="danger-text-btn"
                @click.native.prevent="deleteRow(1, scope.$index)"
                type="text"
                size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagelist-block">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="allTotal">
        </el-pagination>
      </div>
    </div>
    <!-- 修改 增加区域-->
    <el-dialog :title="TITLE+'区域'"
               :visible.sync="addDialog" :close-on-click-modal='false' :close-on-press-escape='false' center
               :before-close="handleCloseDialog">
      <el-form ref="addEditForm" :model="addArea" :rules="addaddAreaRules" label-width="100px">
        <el-form-item label="区域名称" required prop="areaName">
          <el-input class="width350" v-model="addArea.areaName"></el-input>
        </el-form-item>
        <el-form-item label="父区域选择" required prop="areaName">
          <el-select v-model="addArea.nnlightctlParentRegion" placeholder="请选择">
            <el-option
              v-for="item in List"
              :key="item.id"
              :label="item.areaName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="addArea.regionDesc">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {listArea, deleteArea, addOrUpdateArea} from '@/api/RoadLighting/deploy'
  import '../../../utils/filter.js'

  export default {
    name: 'AreaAdmin',
    data () {
      return {
        pageNumber: 1,
        pageSize: 10,
        areaName: '',
        multipleSelection: [],
        currentPage: 1,
        allTotal: null,
        TITLE: null,
        List: [],
        addOrUpdateStatus: null,
        addArea: {},
        addDialog: false,
        addaddAreaRules: {
          areaName: [
            {required: true, message: '填写内容不得为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleCurrentChange (val) {
        // 翻页请求
        this.pageNumber = val
        this.getList()
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.getList()
      },
      getList () {
        // 获取区域列表
        listArea(this.pageNumber, this.pageSize, this.areaName).then(response => {
          this.List = response.data
          if (this.List.length > 0) {
            this.allTotal = response.total
          } else {
            this.allTotal = 0
          }
        }).catch(error => {
          console.log(error)
        })
      },
      addBlock () {
        this.TITLE = '添加'
        this.addDialog = true
        this.addOrUpdateStatus = 'add'
      },
      deleteRow (type, e) { // 删除区域
        let _array = []
        if (type === 1) {
          _array.push(this.List[e].id)
        } else {
          if (this.multipleSelection.length > 0) {
            this.multipleSelection.forEach(selectedItem => {
              // 取出所有待删除选项id
              _array.push(selectedItem.id)
            })
          } else {
            this.$message({
              message: '请勾选需要删除的数据',
              type: 'warning'
            })
            return
          }
        }
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteArea(_array).then(response => {
            // that.projectList.splice(e, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          }).catch(error => {
            console.log(error)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      editRow (e) { // 编辑
        this.TITLE = '修改'
        this.addOrUpdateStatus = 'edit'
        this.addArea = Object.assign({}, this.List[e])
        this.addDialog = true
      },
      onSubmit () { // 新增或者修改区域
        this.$refs['addEditForm'].validate((valid) => {
          if (valid) {
            let _text
            if (this.addOrUpdateStatus === 'add') {
              _text = '添加成功'
            } else {
              _text = '修改成功'
            }
            addOrUpdateArea(this.addArea).then(response => {
              this.$message({
                type: 'success',
                message: _text
              })
              this.getList()
              this.addDialog = false
              this.handleCloseDialog()
            }).catch(error => {
              console.log(error)
            })
          } else {
            console.log('error submit!!')
          }
        })
      },
      // 弹窗关闭时将数据清空
      handleCloseDialog (done) {
        this.addArea = {}
        this.$refs['addEditForm'].resetFields()
        done()
      }
    },
    created () {
      this.getList()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  /* reset element-ui css */
  .el-tabs__nav-scroll {
    padding: 0 40px;
  }

  .el-tabs__header {
    margin-bottom: 0
  }

  .el-tabs__item {
    height: 70px;
    line-height: 70px;
    font-size: 16px
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .system-container {
    .system-top {
      .item-block {
        padding: 0px 30px 0px 20px;
      }
    }
  }
</style>
