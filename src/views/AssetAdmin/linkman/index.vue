<template>
  <div class="box">
    <div class="search_top">
      <el-input placeholder="请输入部门名称" v-model="department" class="input-with-select"></el-input>
      <el-input placeholder="请输入手机号码" v-model="phoneNumber" class="input-with-select"></el-input>
      <el-button icon="el-icon-search" @click="getListMasker"></el-button>
    </div>
    <div class="addData">
      <div>
        <el-button type="primary"
                   @click="dialogFormVisible = true,addData.maskName=addData.sex=addData.age=addData.phoneNumber=addData.email=addData.place=addData.nnlightctlMaskerId=addData.codeNumber=addData.department=''"
                   icon="el-icon-plus">增加
        </el-button>
      </div>
      <div>
        <el-button plain icon="el-icon-delete" @click="alldelte">批量删除</el-button>
      </div>
    </div>
    <!--新增联系人-->
    <el-dialog title="添加联系人" :visible.sync="dialogFormVisible">
      <el-form :model="addData" style="margin:0 auto" :rules="rules" ref="addForm" class="demo-ruleForm">
        <el-form-item label="联系人" label-width="80px" prop="maskName">
          <el-input v-model="addData.maskName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="80px">
          <el-select v-model="addData.sex" placeholder="请选择">
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" label-width="80px" prop="age">
          <el-input v-model="addData.age" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" label-width="80px">
          <el-input v-model="addData.phoneNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="80px" prop="email">
          <el-input v-model="addData.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="职位" label-width="80px" prop="place">
          <el-input v-model="addData.place" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="直属上级" label-width="80px" prop="nnlightctlMaskerId">
          <el-input v-model="addData.nnlightctlMaskerId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="编号" label-width="80px" prop="codeNumber">
          <el-input v-model="addData.codeNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" label-width="80px" prop="department">
          <el-input v-model="addData.department" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="linkmanUpdate(0)">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑联系人-->
    <el-dialog title="编辑联系人" :visible.sync="dialogFormVisible2">
      <el-form :model="Contact" style="margin:0 auto" :rules="rules" ref="Contact" class="demo-ruleForm">
        <el-form-item label="联系人" label-width="80px" prop="maskName">
          <el-input v-model="Contact.maskName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="80px" prop="sex">
          <el-select v-model="Contact.sex" placeholder="请选择">
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" label-width="80px" prop="age">
          <el-input v-model="Contact.age" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" label-width="80px">
          <el-input v-model="Contact.phoneNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="80px" prop="email">
          <el-input v-model="Contact.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="职位" label-width="80px" prop="place">
          <el-input v-model="Contact.place" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="直属上级" label-width="80px" prop="nnlightctlMaskerId">
          <el-input v-model="Contact.nnlightctlMaskerId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="编号" label-width="80px" prop="codeNumber">
          <el-input v-model="Contact.codeNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" label-width="80px" prop="department">
          <el-input v-model="Contact.department" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="linkmanUpdate(1)">确 定</el-button>
      </div>
    </el-dialog>
    <!--联系人列表-->
    <div class="table">
      <template>
        <el-table
          ref="multipleTable"
          :data="listMaskerData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="maskName"
            label="联系人"
            width="120">
          </el-table-column>
          <el-table-column
            prop="sex"
            label="性别"
            width="120">
          </el-table-column>
          <el-table-column
            prop="age"
            label="年龄"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="phoneNumber"
            label="联系电话"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="place"
            label="职位"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="nnlightctlMaskerId"
            label="直属上级"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="codeNumber"
            label="编号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="department"
            label="部门"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNumber"
        :page-sizes="[10, 50, 100]"
        :page-size="pageSize"
        :total="listTotal"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {
    listMasker,
    addOrUpdateMasker,
    isvalidPhone,
    getMasker,
    ConOrUpdateMasker,
    deleteMasker
  } from '@/api/AssetAdmin.js'

  export default {
    name: 'linkman',
    data () {
      return {
        pageNumber: 1,
        pageSize: 10,
        department: '',
        phoneNumber: '',
        dialogTableVisible: false,
        dialogFormVisible: false,
        dialogFormVisible2: false,
        multipleSelection: [],
        addData: { // 增加联系人数据
          maskName: '',
          sex: '',
          age: '',
          phoneNumber: '',
          email: '',
          place: '',
          nnlightctlMaskerId: '',
          codeNumber: '',
          department: ''
        },
        Contact: { // 修改联系人数据
          maskName: '',
          sex: '',
          age: '',
          phoneNumber: '',
          email: '',
          place: '',
          nnlightctlMaskerId: '',
          codeNumber: '',
          department: ''
        },
        listMaskerData: [],
        sexOptions: [{
          value: 1,
          label: '男'
        }, {
          value: 0,
          label: '女'
        }],
        rules: {
          maskName: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          age: [
            {required: true, message: '年龄不能为空'}
          ],
          email: [
            {required: true, message: '请输入邮箱地址', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
          ]
        },
        listTotal: 0
      }
    },
    created () {
      this.getListMasker()
    },
    methods: {
      getListMasker () { // 获取联系人列表
        // listMasker(this.pageNumber, this.pageSize, this.department, this.phoneNumber).then(res => {  // 后台未更新模糊查询为空
        listMasker(this.pageNumber, this.pageSize).then(res => {
          res.data.length && res.data.forEach(d => {
              d.sex === 0 ? d.sex = '女' : d.sex = '男' // 性别显示
            }
          )
          this.listMaskerData = res.data
          this.listTotal = res.total
        })
      },
      alldelte () { // 批量删除联系人
        let ids = []
        if (this.multipleSelection.length) {
          this.multipleSelection.forEach(d => {
            ids.push(d.id)
          })
        } else {
          this.$message({
            type: 'default',
            message: '请至少选择一条数据！'
          })
          return
        }
        deleteMasker(ids).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getListMasker()
        })
      },
      handleSelectionChange (val) { // 选择联系人
        this.multipleSelection = val
      },
      handleEdit (index, row) { // 编辑联系人对话框
        getMasker(row.id).then(res => {
          this.Contact = res.data[0]
        })
        this.dialogFormVisible2 = true
      },
      handleDelete (index, row) { // 删除单个联系人
        deleteMasker(row.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getListMasker()
        })
      },
      handleSizeChange (val) { // 改变每页条数
        this.pageSize = val
        this.getListMasker()
      },
      handleCurrentChange (val) { // 改变页数
        this.pageNumber = val
        this.getListMasker()
      },
      linkmanUpdate (type) { // 更新联系人
        let obj = this.addData
        if (type) {
          obj = this.Contact
        }
        if (!isvalidPhone(obj.phoneNumber)) {
          this.$message({
            type: 'default',
            message: '请输入正确的手机号码！'
          })
        }
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            addOrUpdateMasker(obj).then(res => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.dialogFormVisible = false
              this.getListMasker()
            })
          } else {
            return false
          }
        })
      },
      linkmanContact (formName) { // 修改联系人
        this.$refs[formName].validate((valid) => {
          if (valid) {
            ConOrUpdateMasker(this.Contact.id, this.Contact.maskName, this.Contact.sex, this.Contact.age, this.Contact.phoneNumber, this.Contact.email, this.Contact.place, this.Contact.nnlightctlMaskerId, this.Contact.codeNumber, this.Contact.department).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.dialogFormVisible2 = false
              // that.tableData3.push(that.form)
              this.getListMasker()
            })
          } else {
            return false
          }
        })
        // /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/邮箱正则
      }
    }
  }
</script>
<style scoped lang="scss">
  .box {
    width: 98%;
    margin: 0 auto;
  }

  .search_top {
    margin-top: 20px;

    > div {
      width: 300px;
      float: left;
      margin-right: 20px;
    }
  }

  .addData {
    display: flex;
    margin-top: 20px;
    width: 250px;
    justify-content: space-around;
  }

  .table {
    margin-top: 20px;
  }
</style>
