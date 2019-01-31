<template>
  <div class="box">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="未提交" name="0"></el-tab-pane>
      <el-tab-pane label="已提交" name="1"></el-tab-pane>
    </el-tabs>
    <div class="buttonList">
      <el-button type="primary" icon="el-icon-plus" @click="dialogAdd = true">增加</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="alldelte">批量删除</el-button>
      <el-button type="primary" plain icon="el-icon-setting" @click="setBtn" v-if="activeName==0">设置</el-button>
      <el-button type="primary" plain icon="el-icon-check" @click="updatacommitRepairRecord" v-if="activeName==0">提交
      </el-button>
    </div>
    <template>
      <el-table
        ref="multipleTable"
        :data="repairRecord"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="propertyName"
          label="资产名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="propertyCount"
          label="资产数量"
          width="120">
        </el-table-column>
        <el-table-column
          prop="faultDate"
          label="故障日期"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建日期"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="nnlightctlUserId"
          label="创建人"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="isCommit"
          label="状态"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="nnlightctlEleboxId"
          label="所属控制柜"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作">
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

    <!--    添加   -->
    <el-dialog title="添加资产" :visible.sync="dialogAdd">
      <el-form :model="addData" style="margin:0 auto" :rules="rules" ref="addData" class="demo-ruleaddData">
        <el-form-item label="资产名称" label-width="100px" prop="propertyName">
          <el-input v-model="addData.propertyName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资产数量" label-width="100px" prop="propertyCount">
          <el-input v-model="addData.propertyCount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="故障日期" label-width="100px" prop="faultDate">
          <el-date-picker
            v-model="addData.faultDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建日期" label-width="100px" prop="createDate">
          <el-date-picker
            v-model="addData.createDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建人" label-width="100px" prop="nnlightctlUserId">
          <el-input v-model="addData.nnlightctlUserId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资产目录" label-width="100px" prop="nnlightctlPropertyClassifyCatalogId">
          <el-select v-model="addData.nnlightctlPropertyClassifyCatalogId" placeholder="请选择" auto-complete="off">
            <el-option
              v-for="item in catalogSelect"
              :key="item.id"
              :label="item.myCatalogName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" label-width="100px" prop="isCommit">
          <el-select v-model="addData.isCommit" placeholder="请选择" auto-complete="off">
            <el-option
              v-for="item in isCommit"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属控制柜" label-width="100px" prop="nnlightctlEleboxId">
          <el-select v-model="addData.nnlightctlEleboxId" placeholder="请选择" auto-complete="off">
            <el-option
              v-for="item in eleBoxSelect"
              :key="item.id"
              :label="item.codeNumber"
              :value="item.id">
            </el-option>
          </el-select>
          <span> * 可不选</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="updateRepairRecord(0)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑资产" :visible.sync="dialogEdit">
      <el-form :model="editData" style="margin:0 auto" ref="editData" class="demo-ruleaddData">
        <el-form-item label="资产名称" label-width="100px" prop="propertyName">
          <el-input v-model="editData.propertyName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资产数量" label-width="100px" prop="propertyCount">
          <el-input v-model="editData.propertyCount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="故障日期" label-width="100px" prop="faultDate">
          <el-date-picker
            v-model="editData.faultDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建日期" label-width="100px" prop="createDate">
          <el-date-picker
            v-model="editData.createDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建人" label-width="100px" prop="nnlightctlUserId">
          <el-input v-model="editData.nnlightctlUserId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资产目录" label-width="100px" prop="nnlightctlPropertyClassifyCatalogId">
          <el-select v-model="editData.nnlightctlPropertyClassifyCatalogId" placeholder="请选择" auto-complete="off">
            <el-option
              v-for="item in catalogSelect"
              :key="item.id"
              :label="item.myCatalogName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" label-width="100px" prop="isCommit">
          <el-select v-model="editData.isCommit" placeholder="请选择" auto-complete="off">
            <el-option
              v-for="item in isCommit"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属控制柜" label-width="100px" prop="nnlightctlEleboxId">
          <el-select v-model="editData.nnlightctlEleboxId" placeholder="请选择" auto-complete="off">
            <el-option
              v-for="item in eleBoxSelect"
              :key="item.id"
              :label="item.codeNumber"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit = false">取 消</el-button>
        <el-button type="primary" @click="updateRepairRecord(1)">确 定</el-button>
      </div>
    </el-dialog>
    <!--   设置定时  -->
    <el-dialog title="编辑资产" :visible.sync="dialogSetTime">
      <el-form :model="setTimeData" style="margin:0 auto" ref="setTimeData" class="demo-ruleaddData">
        <el-form-item label="自动提交时间" label-width="100px">
          <el-date-picker
            v-model="setTimeData.commitDate"
            type="datetime"
            :pickerOptions="pickerOptions"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSetTime = false">取 消</el-button>
        <el-button type="primary" @click="configAutoCommitRepairRecord()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    addOrUpdateRepairRecord,
    changeTime,
    commitRepairRecord,
    configAutoCommitRepairRecord,
    deleteRepairRecord,
    getRepairRecord,
    listPropertyClassifyCatalogLevel1,
    listRepairRecord,
    listSubPropertyClassifyCatalog
  } from '@/api/AssetAdmin.js'
  import {listElebox} from '@/api/RoadLighting/deploy'
  import moment from 'moment'

  export default {
    name: '',
    data () {
      return {
        activeName: 0,
        isCommit: [{
          value: 0,
          label: '未提交'
        }, {
          value: '1',
          label: '已提交'
        }],
        repairRecord: [],
        dialogAdd: false,
        dialogEdit: false,
        dialogSetTime: false,
        addData: {
          nnlightctlEleboxId: '',
          nnlightctlPropertyClassifyCatalogId: '',
          propertyName: '',
          propertyCount: '',
          faultDate: '',
          createDate: '',
          nnlightctlUserId: '',
          isCommit: 0
        },
        editData: {
          id: '',
          nnlightctlEleboxId: '',
          nnlightctlPropertyClassifyCatalogId: '',
          propertyName: '',
          propertyCount: '',
          faultDate: '',
          createDate: '',
          nnlightctlUserId: '',
          isCommit: ''
        },
        setTimeData: {
          commitDate: ''
        },
        eleBoxSelect: [],
        catalogSelect: [],
        multipleSelection: [],
        pickerOptions: {
          disabledDate: function (val) {
            return !moment().isBefore(val)
          }
        },
        rules: {
          propertyName: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    created () {
      listPropertyClassifyCatalogLevel1().then(res => {
        res.data.forEach(d => {
          this.catalogSelect.push(d)
          listSubPropertyClassifyCatalog(d.id).then(res => {
            res.data.forEach(c => {
              this.catalogSelect.push(c)
            })
          })
        })
        console.log(this.catalogSelect)
      })
      listElebox().then(res => {
        this.eleBoxSelect = res.data
      })
      listRepairRecord(this.activeName).then(res => {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].faultDate = changeTime(res.data[i].faultDate)
          res.data[i].createDate = changeTime(res.data[i].createDate)
          if (res.data[i].isCommit === 0) {
            res.data[i].isCommit = '未提交'
          } else {
            res.data[i].isCommit = '已提交'
          }
        }
        this.repairRecord = res.data
      })
    },
    methods: {
      handleClick (tab, event) {
        this.activeName = tab.name
        listRepairRecord(tab.name).then(res => {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].faultDate = changeTime(res.data[i].faultDate)
            res.data[i].createDate = changeTime(res.data[i].createDate)
            if (res.data[i].isCommit === 0) {
              res.data[i].isCommit = '未提交'
            } else {
              res.data[i].isCommit = '已提交'
            }
          }
          this.repairRecord = res.data
        })
      },
      handleEdit (index, row) {
        this.dialogEdit = true
        getRepairRecord(row.id).then(res => {
          this.editData = res.data[0]
          this.editData.id = row.id
        })
      },
      handleDelete (index, row) {
        var a = []
        a.push(row.id)
        console.log(a)
        var that = this
        deleteRepairRecord(a).then(res => {
          that.$message({
            type: 'success',
            message: '删除成功'
          })
          listRepairRecord(this.activeName).then(res => {
            for (var i = 0; i < res.data.length; i++) {
              res.data[i].faultDate = changeTime(res.data[i].faultDate)
              res.data[i].createDate = changeTime(res.data[i].createDate)
              if (res.data[i].isCommit === 0) {
                res.data[i].isCommit = '未提交'
              } else {
                res.data[i].isCommit = '已提交'
              }
            }
            this.repairRecord = res.data
          })
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      setBtn () {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'default',
            message: '请选择至少一条数据！'
          })
        } else {
          this.dialogSetTime = true
        }
      },
      configAutoCommitRepairRecord () {
        let repairRecordIds = []
        this.multipleSelection.forEach(d => {
          repairRecordIds.push(d.id)
        })
        let commitDate = moment(moment(this.setTimeData.commitDate).format('YYYY-MM-DD HH:mm')).toString()
        configAutoCommitRepairRecord(repairRecordIds, commitDate).then(res => {
          // console.log(res.data)
          this.$message({
            type: 'success',
            message: '设置成功'
          })
          this.dialogSetTime = false
          listRepairRecord(this.activeName).then(res => {
            for (var i = 0; i < res.data.length; i++) {
              res.data[i].faultDate = changeTime(res.data[i].faultDate)
              res.data[i].createDate = changeTime(res.data[i].createDate)
              if (res.data[i].isCommit === 0) {
                res.data[i].isCommit = '未提交'
              } else {
                res.data[i].isCommit = '已提交'
              }
            }
            this.repairRecord = res.data
          })
        })
      },
      alldelte () {
        let repairRecordIds = []
        if (this.multipleSelection.length) {
          this.multipleSelection.forEach(d => {
            repairRecordIds.push(d.id)
          })
        } else {
          this.$message({
            type: 'default',
            message: '请选择至少一条数据！'
          })
          return
        }
        deleteRepairRecord(repairRecordIds).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          listRepairRecord(this.activeName).then(res => {
            for (var i = 0; i < res.data.length; i++) {
              res.data[i].faultDate = changeTime(res.data[i].faultDate)
              res.data[i].createDate = changeTime(res.data[i].createDate)
              if (res.data[i].isCommit === 0) {
                res.data[i].isCommit = '未提交'
              } else {
                res.data[i].isCommit = '已提交'
              }
            }
            this.repairRecord = res.data
          })
        })
      },
      updatacommitRepairRecord () {
        let repairRecordIds = []
        if (this.multipleSelection.length) {
          this.multipleSelection.forEach(d => {
            repairRecordIds.push(d.id)
          })
        } else {
          this.$message({
            type: 'default',
            message: '请选择至少一条数据！'
          })
          return
        }
        commitRepairRecord(repairRecordIds).then(res => {
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          listRepairRecord(this.activeName).then(res => {
            for (var i = 0; i < res.data.length; i++) {
              res.data[i].faultDate = changeTime(res.data[i].faultDate)
              res.data[i].createDate = changeTime(res.data[i].createDate)
              if (res.data[i].isCommit === 0) {
                res.data[i].isCommit = '未提交'
              } else {
                res.data[i].isCommit = '已提交'
              }
            }
            this.repairRecord = res.data
          })
        })
      },
      updateRepairRecord (type) {
        let dom = 'addData'
        let obj = {}
        if (type) {
          dom = 'editData'
          this.editData.faultDate = moment(this.editData.faultDate).toString()
          this.editData.createDate = moment(this.editData.createDate).toString()
          obj = this.editData
          delete obj.gmtCreated
          delete obj.gmtUpdated
        } else {
          this.addData.faultDate = this.addData.faultDate.toString()
          this.addData.createDate = this.addData.createDate.toString()
          obj = this.addData
        }
        this.$refs[dom].validate((valid) => {
          if (valid) {
            addOrUpdateRepairRecord(obj).then(res => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.dialogAdd = false
              this.dialogEdit = false
              // that.repairRecord.push(that.addData)
              listRepairRecord().then(res => {
                for (var i = 0; i < res.data.length; i++) {
                  res.data[i].faultDate = changeTime(res.data[i].faultDate)
                  res.data[i].createDate = changeTime(res.data[i].createDate)
                  if (res.data[i].isCommit === 0) {
                    res.data[i].isCommit = '未提交'
                  } else {
                    res.data[i].isCommit = '已提交'
                  }
                }
                this.repairRecord = res.data
              })
            }).catch(res => {
              console.log(res)
              this.$message({
                type: 'warning',
                message: '修改失败'
              })
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>
<style scoped>
  .box {
    width: 98%;
    margin: 0 auto;

    height: auto;
  }

  .search {
    display: flex;
    width: 50%;
    margin-top: 20px;

  }

  .dateChange {
    display: flex;
    line-height: 40px;
  }

  .buttonList {
    margin-bottom: 20px;
    padding-top: 10px;
  }
</style>
