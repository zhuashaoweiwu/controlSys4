<template>
  <div class="system-container">
    <div class="system-top clearfix">
      <el-input placeholder="请输入要搜索的部门名称" class="input-with-select" v-model="departmentName" clearable
                @clear="getListDepartment">
      </el-input>
      <el-input placeholder="请输入要搜索的部门地址" class="input-with-select" v-model="departmentAddr" clearable
                @clear="getListDepartment">
      </el-input>
    </div>
    <div class="system-center">
      <div class="operation-bar">
        <el-button @click="addNewObject()" type="primary">增加</el-button>
        <el-button @click="deleteRow(2)">删除</el-button>
      </div>
      <div class="data-list">
        <el-table
          ref="multipleTable"
          :data="listDepartment"
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
            prop="departmentName"
            fixed="left"
            label="部门名称"
            width="100">
          </el-table-column>
          <el-table-column
            label="最高级别部门"
            width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.departmentLevel==0">是</span>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            width="100">
            <template slot-scope="scope">
              {{scope.row.gmtCreated|timeFormat}}
            </template>
          </el-table-column>
          <el-table-column
            label="修改时间"
            width="100">
            <template slot-scope="scope">
              {{scope.row.gmtUpdated|timeFormat}}
            </template>
          </el-table-column>
          <el-table-column
            prop="addr"
            label="部门地址">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
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
    <!-- 修改 增加部门 -->
    <el-dialog :title="addTypeText[addType]+'部门'"
               :visible.sync="addDialog" :close-on-click-modal='false' :close-on-press-escape='false' center
               :before-close="handleCloseDialog">
      <el-form ref="addNewForm" label-width="120px" :model="newObject" :rules="addNewRules">
        <el-form-item label="部门名称" prop="departmentName" required>
          <el-input v-model="newObject.departmentName"></el-input>
        </el-form-item>
        <el-form-item label="部门所属机构" required prop="nnlightctlInstitutionIdBelong">
          <el-select v-model="newObject.nnlightctlInstitutionIdBelong">
            <el-option
              v-for="(item , index) in listAllInstitution"
              :key="index"
              :label="item.institutionName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父部门" required>
          <el-select v-model="newObject.nnlightctlDepartmentIdParent" @change="selectParent">
            <el-option
              v-for="(item , index) in listAllDepartment"
              :key="index"
              :label="item.departmentName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否是最高级别" required>
          <el-radio-group v-model="newObject.departmentLevel" @change="isLevel">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门地址">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="newObject.addr">
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="newObject.mem">
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
  import {
    addOrUpdateDepartment,
    listDepartment,
    getDepartment,
    deleteDepartment,
    listInstitution
  } from '@/api/RoadLighting/userAdmin'
  import '../../../utils/filter.js'

  export default {
    name: 'organization',
    data () {
      return {
        addTypeText: ['添加', '修改'],
        addType: 0,
        pageNumber: 1,
        pageSize: 10,
        departmentName: '',
        departmentAddr: '',
        multipleSelection: [],
        currentPage: 1,
        allTotal: null,
        newObject: {
          nnlightctlDepartmentIdParent: '',
          addr: '',
          mem: '',
          departmentName: '',
          departmentLevel: '是'
        },
        addDialog: false,
        listDepartment: [],
        listAllDepartment: [],
        listAllInstitution: [],
        addNewRules: {
          departmentName: [
            {required: true, message: '填写内容不得为空', trigger: 'blur'}
          ],
          nnlightctlInstitutionIdBelong: [
            {required: true, message: '填写内容不得为空', trigger: 'change'}
          ]
        }
      }
    },
    watch: {
      departmentName: function (val) {
        this.getListDepartment()
      },
      departmentAddr: function (val) {
        this.getListDepartment()
      }
    },
    methods: {
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleCurrentChange (val) {
        this.pageNumber = val
        this.getListDepartment()
        // 翻页请求
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.getListDepartment()
      },
      addNewObject () {
        this.addType = 0
        this.addDialog = true
      },
      onSubmit () {
        this.addOrUpdateDepartment()
      },
      // 弹窗关闭时将数据清空
      handleCloseDialog (done) {
        this.newObject = {}
        this.$refs['addNewForm'].resetFields()
        done()
      },
      // 此处两个方法用于判断是否为最高机构，相互关联
      selectParent () {
        if (this.newObject.nnlightctlDepartmentIdParent === '') {
          this.newObject.departmentLevel = '是'
        } else {
          this.newObject.departmentLevel = '否'
        }
      },
      isLevel () {
        if (this.newObject.departmentLevel === '是') {
          this.newObject.nnlightctlDepartmentIdParent = ''
        } else {
          this.newObject.departmentLevel = 1
        }
      },
      addOrUpdateDepartment () { // 新增或者修改机构
        let postData = {}
        if (this.newObject.id) {
          postData.nnlightctlDepartmentIdParent = this.newObject.nnlightctlDepartmentIdParent
          postData.nnlightctlInstitutionIdBelong = this.newObject.nnlightctlInstitutionIdBelong
          postData.id = this.newObject.id
          postData.addr = this.newObject.addr
          postData.mem = this.newObject.mem
          postData.departmentLevel = this.newObject.departmentLevel
          postData.departmentName = this.newObject.departmentName
        } else {
          postData = this.newObject
        }
        if (this.newObject.departmentLevel === '是') {
          postData.departmentLevel = 0
          postData.nnlightctlDepartmentIdParent = 0
        } else {
          postData.departmentLevel = 1
        }
        addOrUpdateDepartment(postData).then(response => {
          if (postData.id) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          } else {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
          }
          this.getListDepartment()
          this.addDialog = false
          this.newObject = {
            nnlightctlDepartmentIdParent: '',
            addr: '',
            mem: '',
            departmentName: '',
            departmentLevel: '是'
          }
          this.$refs['addNewForm'].resetFields()
        }).catch(error => {
          console.log(error)
        })
      },
      // 获取部门列表
      getListDepartment () {
        let that = this
        listDepartment(that.pageNumber, that.pageSize, that.departmentName, that.departmentAddr).then(response => {
          that.listDepartment = response.data
          if (that.listDepartment.length > 0) {
            this.allTotal = response.total
          } else {
            this.allTotal = 0
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // 获取部门不翻页列表
      getAllListDepartment () {
        let that = this
        listDepartment().then(response => {
          that.listAllDepartment = response.data
        }).catch(error => {
          console.log(error)
        })
      },
      // 获取机构不翻页列表
      getAllListInstitution () {
        let that = this
        listInstitution().then(response => {
          that.listAllInstitution = response.data
        }).catch(error => {
          console.log(error)
        })
      },
      // 获取单个部门信息进行修改
      editRow (e) {
        this.addType = 1
        let that = this
        getDepartment(this.listDepartment[e].id).then(response => {
          if (response.data[0].departmentLevel === 0) {
            response.data[0].departmentLevel = '是'
            response.data[0].nnlightctlDepartmentIdParent = ''
          } else {
            response.data[0].departmentLevel = '否'
          }
          that.newObject = response.data[0]
          this.addDialog = true
        }).catch(error => {
          console.log(error)
        })
      },
      // 删除
      deleteRow (type, e) {
        let _array = []
        if (type === 1) {
          _array.push(this.listDepartment[e].id)
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
            return false
          }
        }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDepartment(_array).then(response => {
            // that.projectList.splice(e, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getListDepartment()
            this.getAllListDepartment()
            this.getAllListInstitution()
          }).catch(error => {
            console.log(error)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    created () {
      this.getListDepartment()
      this.getAllListDepartment()
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
