<template>
  <div class="system-container">
    <el-tabs v-model="activeName" @tab-click="tabHandleClick">
      <el-tab-pane label="控制柜警报" name="cabinet">
        <div id="open-alarm" class="open-alram-btn">
          <el-button type="primary" @click="handleOpenAlara()">是否开启报警</el-button>
        </div>
        <div id="ele-warning">
          <el-row style="margin: 20px 0">
            <el-col :span="6">
              <div class="light-wrap" @click="handleLightOpen()">
                <h4 class="light-wrap-title">意外亮灯</h4>
                <i class="light-right icon-item"></i>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="light-wrap" @click="handleLightOpen()">
                <h4 class="light-wrap-title">意外灭灯</h4>
                <i class="icon-item light-wrong" :style="{ opacity: 1 }"></i>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="light-wrap" @click="handleLightOpen()">
                <h4 class="light-wrap-title">线路过流</h4>
                <i class="icon-item lines" :style="{ opacity: 1 }"></i>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="light-wrap" @click="handleLightOpen()">
                <h4 class="light-wrap-title">线路过压</h4>
                <i class="icon-item xianluguoya" :style="{ opacity: 1 }">&#xe62b;</i>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin: 20px 0">
            <el-col :span="6">
              <div class="light-wrap" @click="handleLightOpen()">
                <h4 class="light-wrap-title">线路欠压</h4>
                <i class="icon-item xianluqianya" :style="{ opacity: 1 }"></i>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="light-wrap" @click="handleLightOpen()">
                <h4 class="light-wrap-title">配电柜断电</h4>
                <i class="icon-item peidianguiduandian" :style="{ opacity: 1 }"></i>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="light-wrap" @click="handleLightOpen()">
                <h4 class="light-wrap-title">配电柜缺相</h4>
                <i class="icon-item electricity_meter_unconnected" :style="{ opacity: 1 }"></i>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="light-wrap" @click="handleLightOpen()">
                <h4 class="light-wrap-title">配电柜漏电</h4>
                <i class="icon-item electricity" :style="{ opacity: 1 }"></i>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin: 20px 0">
            <el-col :span="6">
              <div class="light-wrap" @click="handleLightOpen()">
                <h4 class="light-wrap-title">功率因数越限</h4>
                <i class="icon-item electricity_meter2" :style="{ opacity: 1 }"></i>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="light-wrap" @click="handleLightOpen()">
                <h4 class="light-wrap-title">柜门开启</h4>
                <i class="icon-item open_door" :style="{ opacity: 1 }"></i>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="light-wrap" @click="handleLightOpen()">
                <h4 class="light-wrap-title">配电柜倾斜</h4>
                <i class="icon-item elexbox_1" :style="{ opacity: 1 }"></i>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="light-wrap" @click="handleLightOpen()">
                <h4 class="light-wrap-title">配电柜进水</h4>
                <i class="icon-item Group_4" :style="{ opacity: 1 }"></i>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin: 20px 0">
            <el-col :span="6">
              <div class="light-wrap" @click="handleLightOpen()">
                <h4 class="light-wrap-title">配电柜雷击</h4>
                <i class="icon-item elexbox_simple" :style="{ opacity: 1 }"></i>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="light-wrap" @click="handleLightOpen()">
                <h4 class="light-wrap-title">手自控切换</h4>
                <i class="icon-item current_sensor" :style="{ opacity: 1 }"></i>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="light-wrap" @click="handleLightOpen()">
                <h4 class="light-wrap-title">外部控制器</h4>
                <i class="icon-item main_mada" :style="{ opacity: 1 }"></i>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="light-wrap" @click="handleLightOpen()">
                <h4 class="light-wrap-title">自定义报警</h4>
                <i class="icon-item diy_icon" :style="{ opacity: 1 }"></i>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="常规灯具警报" name="lighting">
        <div id="open-alarm2" class="open-alram-btn">
          <el-button type="primary" @click="handleOpenAlara()">是否开启报警</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--是否开启警报-->
    <el-dialog class="opendialog" title="是否开启警报" :visible.sync="openAlarmVisible">
      <el-table
        ref="multipleTable"
        :data="openAlarmBoxData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          label="警报类型"
          prop="ctype"
          width="300">
        </el-table-column>
        <el-table-column
          label="是否开启"
          prop="oepn"
          width="100">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isUse"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="openAlarmVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOpenAlarmOk">确 定</el-button>
      </span>
    </el-dialog>

    <!--意外亮灯-->
    <el-dialog title="意外亮灯" :visible.sync="lightisUseVisible">
      <el-row>
        <el-col :span="6">
          <span>警报等级</span>
        </el-col>
        <el-col :span="18">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="(item, index) in alarmLevelOptions"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="6">
          <el-checkbox v-model="alermConfigData.isNoticeMap">在地图上显示警报信息</el-checkbox>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="6">
          <el-checkbox v-model="alermConfigData.isNoticeSms">发送短信警报信息</el-checkbox>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="6">
          <el-checkbox v-model="alermConfigData.isWechat">发送微信警报信息</el-checkbox>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="6">
          <el-checkbox v-model="alermConfigData.isEmail">发送邮件警报信息</el-checkbox>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="lightOpenVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAlarmConfigSave">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {configAlarm, getAlarm, configIsUseAlarm} from '@/api/EventWarning/EventWarning'
  import '../../../utils/filter.js'

  export default {
    name: 'Deploy',
    data () {
      return {
        activeName: 'cabinet',
        lightisUseVisible: false,
        openAlarmVisible: false,
        lightOpenVisible: false, // 意外亮灯显示控制
        options: [],
        alermConfigData: {
          alarmLevel: true,
          isNoticeMap: false,
          isNoticeSms: true,
          isWechat: true,
          isEmail: false
        },
        alarmLevelOptions: [
          {
            value: '严重（等级一）',
            label: '等级一'
          },
          {
            value: '严重（等级一）',
            label: '等级一'
          },
          {
            value: '严重（等级一）',
            label: '等级一'
          }
        ],
        openAlarmBoxData: [
          {
            ctype: '意外亮灯',
            alarmSource: '控制柜',
            isUse: false
          },
          {
            ctype: '意外灭灯',
            alarmSource: '控制柜',
            isUse: false
          },
          {
            ctype: '线路过流',
            alarmSource: '控制柜',
            isUse: false
          },
          {
            ctype: '线路过压',
            alarmSource: '控制柜',
            isUse: false
          },
          {
            ctype: '线路欠压',
            alarmSource: '控制柜',
            isUse: false
          },
          {
            ctype: '配电柜断电',
            alarmSource: '控制柜',
            isUse: false
          },
          {
            ctype: '配电柜缺相',
            alarmSource: '控制柜',
            isUse: false
          },
          {
            ctype: '配电柜漏电',
            alarmSource: '控制柜',
            isUse: false
          },
          {
            ctype: '功率因数越线',
            alarmSource: '控制柜',
            isUse: false
          },
          {
            ctype: '柜门开启',
            alarmSource: '控制柜',
            isUse: false
          },
          {
            ctype: '配电柜倾斜',
            alarmSource: '控制柜',
            isUse: false
          },
          {
            ctype: '配电柜进水',
            alarmSource: '控制柜',
            isUse: false
          },
          {
            ctype: '配电柜雷击',
            alarmSource: '控制柜',
            isUse: false
          },
          {
            ctype: '手自控切换',
            alarmSource: '控制柜',
            isUse: false
          },
          {
            ctype: '外部控制器',
            alarmSource: '控制柜',
            isUse: false
          },
          {
            ctype: '自定义警报',
            alarmSource: '控制柜',
            isUse: false
          }
        ],
        value: ''
      }
    },
    watch: {
      activeName: function (val, oldVal) {
        if (val === 'lighting') {
        } else {
        }
      }
    },
    methods: {
      // 开启警报确定提交数据
      handleOpenAlarmOk () {
        this.openAlarmVisible = false
        let temData = []
        this.openAlarmBoxData.map((item, index) => {
          const obj = {
            ctype: item.ctype,
            alarmSource: item.alarmSource,
            isUse: Number(item.isUse)
          }
          temData.push(obj)
        })
        configIsUseAlarm(temData).then(res => {
          if (res.data) {
            this.$message({
              showClose: true,
              message: '修改成功！'
            })
            this.openAlarmVisible = false
          } else {
            this.$message({
              showClose: true,
              message: '修改失败！'
            })
          }
        })
      },
      // 是否开启警报
      handleOpenAlara () {
        // 初始化数据todo
        this.openAlarmVisible = true
      },
      // 意外亮灯
      handleLightOpen () {
        getAlarm().then(res => {
          console.log(res, '请求的初始化配置数据')
        })
        this.lightOpenVisible = true
      },
      // 配置保存数据
      handleAlarmConfigSave () {
        this.lightOpenVisible = false
      },
      tabHandleClick (tab, event) {
        console.log(tab, event)
      }
    },
    created () {
    }
  }
</script>

<style lang="scss">
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

  .uid-dgh-item {
    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
  }

  .el-form--inline {
    .el-form-item__content {
      width: 160px
    }
  }

  .light-wrap-title {
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    font-weight: normal;
    text-align: left;
  }

  .upload-demo {
    display: inline-block;
  }
</style>
<style lang="scss" scoped>
  .activep {
    background: #e5e5e5;
    line-height: 28px;
    height: 28px;
    padding: 0 5px;
  }

  .system-container {
    .system-top {
      .item-block {
        padding: 0 30px 0 55px;
      }
    }
  }

  .open-alram-btn {
    padding-top: 20px;
    padding-left: 30px;
  }

  .area-dialog-content {
    min-height: 200px;
  }

  .area-tree {
    margin-top: 20px;
  }

  .model-select-dialog {
    width: 450px;
    margin: 20px auto 40px;

    .select-wrap {
      width: 360px;
    }
  }

  .useable-select-dialog {
    margin: 10px 0 20px;
    text-align: center;

    .select-item {
      margin: 0 30px;
    }
  }

  .light-wrap {
    cursor: pointer;
    height: 184px;
    width: 210px;
    position: relative;
    border: 1px #EBEBEB solid;
    text-align: center;

    .iconfont {
      font-size: 160px;
      color: #F8E71C;
    }

    .open-alarm {
      padding-top: 20px;
      padding-left: 30px;
    }

    .icon-item {
      display: inline-block;
      width: 60px;
      height: 60px;
      margin-top: 30px;
    }

    .diy_icon {
      background: url("img/diy_icon.png") no-repeat;
      background-size: 100% 100%;
    }

    .current_sensor {
      background: url("img/current_sensor.png") no-repeat;
      background-size: 100% 100%;
    }

    .main_mada {
      background: url("img/main_mada.png") no-repeat;
      background-size: 100% 100%;
    }

    .elexbox_simple {
      background: url("img/elexbox_simple.png") no-repeat;
      background-size: 100% 100%;
    }

    .Group_4 {
      background: url("img/Group_4.png") no-repeat;
      background-size: 100% 100%;
    }

    .elexbox_1 {
      background: url("img/elexbox_1.png") no-repeat;
      background-size: 100% 100%;
    }

    .electricity_meter2 {
      background: url("img/electricity_meter2.png") no-repeat;
      background-size: 100% 100%;
    }

    .light-right {
      display: inline-block;
      width: 50px;
      height: 67px;
      background: url("img/Shape_Copy.png") no-repeat;
      background-size: 100% 100%;
    }

    .light-wrong {
      background: url("img/Shape_Copy2.png") no-repeat;
      background-size: 100% 100%;
      width: 50px;
      height: 67px;
    }

    .lines {
      background: url("img/lines.png") no-repeat;
      background-size: 100% 100%;
    }

    .peidianguiduandian {
      background: url("img/electricity_meter_close.png") no-repeat;
      background-size: 100% 100%;
    }

    .electricity_meter_unconnected {
      background: url("img/electricity_meter_unconnected.png") no-repeat;
      background-size: 100% 100%;
    }

    .electricity {
      background: url("img/electricity.png") no-repeat;
      background-size: 100% 100%;
    }

    .xianluguoya {
      background: url("img/xiebo_dianbiao.png") no-repeat;
      background-size: 100% 100%;
    }

    .xianluqianya {
      background: url("img/Harmonic_electric_meter.png") no-repeat;
      background-size: 100% 100%;
    }

    .open_door {
      background: url("img/open_door.png") no-repeat;
      background-size: 100% 100%;
    }
  }

  .mapicon-dialog {
    text-align: center;

    .el-upload--picture-card {
      height: 100px;
      width: 100px;
    }

    .el-upload {
      height: 100px;
      width: 100px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
  }

  // 新增控制柜
  .cabinet-list {
    margin: 0 auto;
    width: 530px;
    padding: 20px;
    box-sizing: 100%;
    border: 1px solid #dedede;
  }

  .operate-block {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: bold;

    a {
      display: inline-block;
      font-size: 14px;
      color: #5789fa;
      font-weight: normal;
      margin-right: 15px;

      i {
        font-size: 14px;
        font-weight: normal;
        padding-right: 5px;
      }
    }
  }

  // 添加设备
  .add-device {
    .device-info {
      padding: 20px;
      margin-left: 8px;
      float: left;
      width: 560px;
      height: 580px;
      border: 1px solid #dedede;
      box-sizing: border-box;
    }

    .loop-info {
      padding: 20px;
      margin-left: 20px;
      float: left;
      width: 560px;
      height: 580px;
      border: 1px solid #dedede;
    }
  }

  .lamp-form {
    .input-wrap {
      width: 360px;
    }
  }

  .insert-lamp {
    .select-wrap {
      padding: 20px;
      float: left;
      width: 540px;
      height: 450px;
      border: 1px solid #dedede;
      box-sizing: border-box;
    }

    .controll-wrap {
      padding-top: 150px;
      float: left;
      width: 80px;
      height: 450px;
      text-align: center;

      .controll-btn {
        margin: 20px 0;
      }
    }
  }

  // 管理灯具
  .manage-lamp {
    .operation-bar {
      margin-bottom: 20px;
    }
  }

  .p-title {
    font-size: 16px;
    color: #333
  }

  .p-title-add {
    color: #909399;
    font-size: 14px;
    margin-top: 5px;
  }

  // 回路拆分
  .modeloop-split {
    width: 100%;

    .title {
      font-size: 16px;
      margin-bottom: 10px;
    }

    .modeloop-split-center {
      .split-center-left {
        float: left;
        width: 280px;

        .title {
          width: 100%;
          height: 24px;

          .item {
            float: left;
            width: 130px;
            height: 16px;
            text-align: left;
          }
        }

        .center-left-item {
          padding: 10px 5px;
          border: 1px solid #e5e5e5;
          overflow-y: auto;
          float: left;
          width: 130px;
          height: 400px;
        }
      }

      .split-center-right {
        float: right;
        width: 360px;
        // overflow-y: scroll;
        .add-loop-split {
          color: #5789fa;
          float: right;
        }

        .title {
          font-size: 16px;
          height: 24px;
        }

        .center-right-item {
          padding: 10px;
          border: 1px solid #e5e5e5;
          height: 400px;
        }
      }
    }
  }

  #ele-warning {
    padding: 32px;
  }

  .uid-dgh-item {
    margin-bottom: 15px;

    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }

    .item-block {
      width: 150px;

      .el-input {
        width: 80px;
      }

      .title {
        color: #606266;
        font-weight: 700;
        padding-right: 10px;

        &::before {
          content: "*";
          color: #f56c6c;
          margin-right: 4px;
        }
      }
    }

  }
</style>
