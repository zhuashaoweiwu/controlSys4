<template>
  <div class="box">
    <p></p>
    <div class="buttonlist">
      <div>
        <p><i class="el-icon-service"></i></p>
        <p>我的工单： {{countOrderData.total}} 个</p>
      </div>
      <div>
        <p><i class="el-icon-refresh"></i></p>
        <p>待认领工单： {{countOrderData.finishTotal}} 个</p>
      </div>
      <div>
        <p><i class="el-icon-time"></i></p>
        <p>处理中工单： {{countOrderData.noFinishTotal}} 个</p>
      </div>
      <div @click="addWorkOrderOpen">
        <p><i class="el-icon-circle-plus-outline"></i></p>
        <p>新增工单</p>
      </div>
    </div>
    <div style="clear:both"></div>
    <div class="center">
      <el-tabs v-model="activeName" @tab-click="tabChange">
        <el-tab-pane label="待认领工单" name="finish"></el-tab-pane>
        <el-tab-pane label="处理中工单" name="nofinish"></el-tab-pane>
      </el-tabs>
      <!--   表格组件  -->
      <div>
        <el-table :data="workOrderList" border style="width: 100%">
          <el-table-column prop="gmtCreated" label="创建时间" :formatter="timeFilter"></el-table-column>
          <el-table-column prop="gmtUpdated" label="修改时间" :formatter="timeFilter"></el-table-column>
          <el-table-column prop="nnlightctlWorkflowerId" label="工单流ID"></el-table-column>
          <el-table-column prop="nnlightctlWorkflowerId" label="工作流"></el-table-column>
          <el-table-column prop="serialNumber" label="编号"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="content" label="内容"></el-table-column>
          <el-table-column prop="classify" label="内容" :formatter="classifyFilter"></el-table-column>
          <el-table-column label="当前处理人" prop="nnlightctlMaskerId" :formatter="maskerFilter"></el-table-column>
          <!--<el-table-column prop="nnlightctlProjectId" label="项目ID"></el-table-column>-->
          <el-table-column prop="nnlightctlRegionId" label="地区" :formatter="areaFilter"></el-table-column>
          <!--<el-table-column prop="nnlightctlWorkflowerMoveRecordId" label="当前工作流状态"></el-table-column>-->
          <el-table-column prop="priority" label="优先级" :formatter="priorityFilter"></el-table-column>
          <el-table-column prop="serialNumber" label="编号"></el-table-column>
          <el-table-column prop="state" label="状态"></el-table-column>
          <!--<el-table-column prop="workSource" label="来源"></el-table-column>-->
          <el-table-column prop="workCreated" label="工单创建时间" :formatter="timeFilter"></el-table-column>
          <el-table-column label="操作" v-if="orderState===1">
            <template slot-scope="scope"><!--v-if="$props.attachFilePath"-->
              <el-button type="text" size="small" @click="claimWordOrderOpen(scope.row)">认领</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination f-r">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNumber"
          :page-size="pageSize"
          :page-sizes="[10,20,50,100]"
          layout="prev, pager, next, sizes"
          :total="pageTotal">
        </el-pagination>
      </div>
    </div>
    <!-- 认领工单 -->
    <el-dialog title="任务执行人选择" :visible.sync="dialogClaimVisible">
      <el-form :model="claimData">
        <el-form-item label="执行人" label-width="80px">
          <el-select v-model="claimData.taskerId" placeholder="请选择">
            <el-option
              v-for="item in maskerIds"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClaimVisible = false">取 消</el-button>
        <el-button type="primary" @click="claimWordOrder">确 定</el-button>
      </div>
    </el-dialog>
    <!--   弹出框   -->
    <el-dialog title="新增" :visible.sync="formdatahide">
      <el-form ref="form" :model="addOrderData" label-width="80px">
        <el-form-item label="编号">
          <el-input v-model=" addOrderData.serialNumber"></el-input>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="addOrderData" label-width="80px">
        <el-form-item label="分类">
          <el-select v-model="addOrderData.classify" placeholder="请选择">
            <el-option
              v-for="item in classifyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="addOrderData" label-width="80px">
        <el-form-item label="工作流">
          <el-select v-model="addOrderData.nnlightctlWorkflowerId" placeholder="请选择">
            <el-option
              v-for="item in flowerNodeOptions"
              :key="item.id"
              :label="item.workflowerNodeName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="addOrderData" label-width="80px">
        <el-form-item label="优先级">
          <el-select v-model="addOrderData.priority" placeholder="请选择">
            <el-option
              v-for="item in priorityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="addOrderData" label-width="80px">
        <el-form-item label="执行人">
          <el-select v-model="addOrderData.nnlightctlMaskerId" placeholder="请选择">
            <el-option
              v-for="item in maskerIds"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="addOrderData" label-width="80px">
        <el-form-item label="选择区域">
          <el-select v-model="addOrderData.nnlightctlRegionId" placeholder="请选择">
            <el-option
              v-for="item in areaOptions"
              :key="item.id"
              :label="item.areaName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="addOrderData" label-width="80px">
        <el-form-item label="选择项目">
          <el-select v-model="addOrderData.nnlightctlProjectId" placeholder="请选择">
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.projectName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="addOrderData" label-width="80px">
        <el-form-item label="地址">
          <el-input v-model=" addOrderData.address"></el-input>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="addOrderData" label-width="80px">
        <el-form-item label="内容">
          <el-input v-model=" addOrderData.content"></el-input>
        </el-form-item>
      </el-form>
      <!--<el-form ref="form" :model="addOrderData" label-width="80px">-->
      <!--<el-form-item label="附件">-->
      <!--&lt;!&ndash;<el-upload&ndash;&gt;-->
      <!--&lt;!&ndash;class="upload-demo"&ndash;&gt;-->
      <!--&lt;!&ndash;:action="$config.baseUrl"&ndash;&gt;-->
      <!--&lt;!&ndash;:on-preview="handlePreview"&ndash;&gt;-->
      <!--&lt;!&ndash;:on-remove="handleRemove"&ndash;&gt;-->
      <!--&lt;!&ndash;:limit="1"&ndash;&gt;-->
      <!--&lt;!&ndash;:on-success="handleSuccess">&ndash;&gt;-->
      <!--&lt;!&ndash;<el-button size="small" type="primary">点击上传</el-button>&ndash;&gt;-->
      <!--&lt;!&ndash;</el-upload>&ndash;&gt;-->
      <!--<input type="file" id="resource" name="resource" ref="resource">-->
      <!--&lt;!&ndash;<el-input v-model="addOrderData.attachFilePath"></el-input>&ndash;&gt;-->
      <!--</el-form-item>-->
      <!--</el-form>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="formdatahide = false">取 消</el-button>
        <el-button type="primary" @click="addWorkOrder">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import moment from 'moment'
  import {
    countWorkOrderState,
    addWordOrder,
    listWorkOrder,
    claimWordOrder,
    listWorkFlowerNode
  } from '@/api/WorkOrder/index'
  import {listMasker} from '@/api/AssetAdmin.js'
  import {listArea} from '@/api/RoadLighting/area'
  import {listProject} from '@/api/project'

  export default {
    name: '',
    data () {
      return {
        countOrderData: {},
        pageNumber: 1,
        pageSize: 10,
        pageTotal: 0,
        orderState: 1,
        date: '1.45',
        activeName: 'finish',
        formdatahide: false,
        dialogClaimVisible: false,
        tablelist: true,
        addOrderData: {
          serialNumber: '',
          classify: '',
          nnlightctlWorkflowerId: '',
          priority: 1,
          nnlightctlRegionId: '',
          address: '',
          nnlightctlMaskerId: '',
          content: '',
          nnlightctlProjectId: ''
        },
        workOrderList: [],
        dialogTableVisible: false,
        form: {
          name: ''
        },
        tabledataShow: true,
        tabledataShow2: false,
        maskerIds: [],
        claimData: {
          workOrderId: '',
          taskerId: ''
        },
        priorityOptions: [
          {value: 1, label: '低'},
          {value: 2, label: '中'},
          {value: 3, label: '高'}
        ],
        classifyOptions: [
          {value: 1, label: '分类一'},
          {value: 2, label: '分类二'},
          {value: 3, label: '分类三'},
          {value: 4, label: '分类四'}
        ],
        areaOptions: [],
        flowerNodeOptions: [],
        projectOptions: []
      }
    },
    methods: {
      maskerFilter (row, column, cellValue, index) {
        if (!cellValue) return ''
        let val = ''
        this.maskerIds.forEach(d => {
          if (d.value === cellValue) {
            val = d.label
          }
        })
        return val
      },
      timeFilter (row, column, cellValue) {
        return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
      },
      areaFilter (row, column, cellValue) {
        if (!cellValue) return ''
        let val = ''
        this.areaOptions.forEach(d => {
          if (d.id === cellValue) {
            val = d.areaName
          }
        })
        return val
      },
      priorityFilter (row, column, cellValue) {
        if (!cellValue) return ''
        let val = ''
        this.priorityOptions.forEach(d => {
          if (d.value === cellValue) {
            val = d.label
          }
        })
        return val
      },
      classifyFilter (row, column, cellValue) {
        if (!cellValue) return ''
        let val = ''
        this.classifyOptions.forEach(d => {
          if (d.value === cellValue) {
            val = d.label
          }
        })
        return val
      },
      addWorkOrder () {
        // var formData = new FormData() // FormData 对象
        // formData = this.addOrderData
        // this.addOrderData.attachFilePath = this.$refs.resource.files[0]
        // formData.append('attachFilePath', this.$refs.resource.files[0])
        // formData.append('serialNumber', this.addOrderData.serialNumber)
        // formData.append('classify', this.addOrderData.classify)
        // formData.append('nnlightctlWorkflowerId', this.addOrderData.nnlightctlWorkflowerId)
        // formData.append('priority', this.addOrderData.priority)
        // formData.append('nnlightctlRegionId', this.addOrderData.nnlightctlRegionId)
        // formData.append('address', this.addOrderData.address)
        // formData.append('nnlightctlMaskerId', this.addOrderData.nnlightctlMaskerId)
        // formData.append('content', this.addOrderData.content)
        // console.log(formData)
        // return false
        addWordOrder(this.addOrderData).then(res => {
          if (res.data) {
            this.$message({
              text: '添加成功',
              type: 'success'
            })
            this.getWorkOrderList()
          } else {
            this.$message({
              text: '添加失败',
              type: 'warn'
            })
          }
          this.formdatahide = false
        })
      },
      addWorkOrderOpen: function () {
        this.formdatahide = true
      },
      claimWordOrderOpen (row) {
        this.claimData.workOrderId = row.id
        this.dialogClaimVisible = true
      },
      claimWordOrder () {
        claimWordOrder(this.claimData).then(res => {
          if (res.data) {
            this.$message({
              text: '操作成功',
              type: 'success'
            })
          } else {
            this.$message({
              text: '请求失败',
              type: 'warn'
            })
          }
          this.dialogClaimVisible = false
          this.getWorkOrderList()
        })
      },
      tabChange (tab, event) {
        switch (tab.name) {
          case 'finish':
            this.orderState = 1
            this.getWorkOrderList()
            break
          case 'nofinish':
            this.orderState = 2
            this.getWorkOrderList()
            break
        }
      },
      addWork () {
        addWordOrder(this.formdata.serialNumber, this.formdata.classify, this.formdata.nnlightctlWorkflowerId, this.formdata.priority, this.formdata.nnlightctlRegionId, this.formdata.address, this.formdata.nnlightctlMaskerId, this.formdata.content, this.formdata.attachFilePath).then(res => {
          console.log(res.data)
          this.formdatahide = false
          listWorkOrder().then(res => {
            for (var i = 0; i < res.data.length; i++) {
              // res.data[i].gmtCreated = changeTime(res.data[i].gmtCreated)
              // res.data[i].gmtUpdated = changeTime(res.data[i].gmtUpdated)
              // res.data[i].workCreated = changeTime(res.data[i].workCreated)
            }
            this.tableData = res.data
          })
        })
      },
      handleClick (row) {
        console.log(row)
        this.dialogTableVisible = true
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.getWorkOrderList()
      },
      handleCurrentChange (val) {
        this.pageNumber = val
        this.getWorkOrderList()
      },
      getWorkOrderList () {
        if (this.orderState) {
          listWorkOrder(this.pageNumber, this.pageSize, this.orderState).then(res => {
            // res.data.length && res.data.forEach(d => {
            //   d.gmtCreated=moment(gmtCreated)
            // })
            this.workOrderList = res.data
          })
        } else {
          listWorkOrder(this.pageNumber, this.pageSize).then(res => {
            this.workOrderList = res.data
          })
        }
      }
    },
    created () {
      listProject().then(res => {
        this.projectOptions = res.data
      })
      listWorkFlowerNode().then(res => {
        this.flowerNodeOptions = res.data
      })
      listArea().then(res => {
        this.areaOptions = res.data
      })
      listMasker().then(res => {
        res.data.length && res.data.forEach(d => {
          this.maskerIds.push({value: d.id, label: d.maskName})
        })
      })
      countWorkOrderState().then(res => {
        this.countOrderData = res.data[0]
      })
      this.getWorkOrderList()
      // listWorkOrder().then(res => {
      //   for (var i = 0; i < res.data.length; i++) {
      //     // res.data[i].gmtCreated = changeTime(res.data[i].gmtCreated)
      //     // res.data[i].gmtUpdated = changeTime(res.data[i].gmtUpdated)
      //   }
      //   this.tableData = res.data
      // })
    }
  }
</script>
<style scoped>
  .box {
    margin: 0 auto;
    width: 98%;
  }

  .box > p {
    line-height: 40px;
    font-size: 12px;
  }

  .buttonlist {
    padding-top: 20px;
  }

  .buttonlist > div {
    float: left;
    width: 150px;
    height: 80px;
    border: solid 1px blue;
    margin-right: 20px;
  }

  .buttonlist p {
    text-align: center;
    font-size: 14px;
  }

  .buttonlist > div p:nth-child(1) {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 16px;
  }

  .center {
    margin-top: 20px;
  }
</style>
