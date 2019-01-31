<template>
  <div class='map-wrap'>
    <div id="lamp-map"></div>
    <!--<el-amap vid='amapDemo' :zoom="zoom" :zooms="zooms" :center="center" :plugin='plugin'>-->
    <!--&lt;!&ndash;控制柜&ndash;&gt;-->
    <!--<el-amap-marker v-for="(marker, index) in EleBoxMarks" :key="index + 'a'" :template='marker.template'-->
    <!--:position="marker.position" :visible="marker.visible"-->
    <!--:draggable="marker.draggable" :offset='[-20, -8]' :vid="`a{{index}}`" events="null">-->
    <!--</el-amap-marker>-->
    <!--&lt;!&ndash; 灯具 &ndash;&gt;-->
    <!--<el-amap-marker v-for="(marker, index) in LightMarks" :key="index + 'b'" :template='marker.template'-->
    <!--:position="marker.position" :visible="marker.visible"-->
    <!--:draggable="marker.draggable" :offset='[-8, -10]' :vid="`b{{index}}`" title="点击调节灯具信息"-->
    <!--events="null">-->
    <!--</el-amap-marker>-->
    <!--&lt;!&ndash; 连线 &ndash;&gt;-->
    <!--&lt;!&ndash; <el-amap-polyline :editable="false"  v-for="(marker, index) in LightLine" :key="index"  :path="marker.path"></el-amap-polyline> &ndash;&gt;-->
    <!--&lt;!&ndash;<el-amap-polyline v-for="(marker, index) in LightLine" :key="index + 'c'" :editable="marker.editable"&ndash;&gt;-->
    <!--&lt;!&ndash;:path="marker.path" :events="marker.events"&ndash;&gt;-->
    <!--&lt;!&ndash;:strokeColor="marker.state === 1 ? '#17BEB0' : '#FF2851'"></el-amap-polyline>&ndash;&gt;-->
    <!--</el-amap>-->
    <!-- 搜索栏 -->
    <!-- <div class='search-wrap'>
      <el-autocomplete
        style='width:320px'
        v-model='state4'
        :fetch-suggestions='querySearchAsync'
        placeholder='请输入内容'
        @select='handleSelect'
      ></el-autocomplete>
      <el-button type='primary' icon='el-icon-search'></el-button>
    </div> -->
    <!-- <el-tooltip :value='true' placement="bottom-start" effect="light">
      <div slot="content">
        <div class="select-device">
          <el-tabs type="card">
            <el-tab-pane label="控制柜">
              <el-tree
                :data="dataEleBox"
                :props="defaultProps"
                accordion
                @node-click="handleNodeClick">
              </el-tree>
            </el-tab-pane>
            <el-tab-pane label="区域">
              <el-tree
                :data="dataArea"
                :props="defaultProps"
                accordion
                @node-click="handleNodeClick">
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="located-tool">
        <i class="iconfont">&#xe662;</i>
      </div>
    </el-tooltip> -->
    <!-- 工具栏 -->
    <div class="lamp-tool">
      <a class="tool-li tool-li-1" href="javascript:;" @click="getLightGroupList()"><span>灯具<br/>分组</span></a>
      <a class="tool-li tool-li-2" href="javascript:;" @click="getSwitchTaskList()"><span>任务<br/>开关</span></a>
      <a class="tool-li tool-li-3" href="javascript:;" @click="getSceneList()"><span>场景</span></a>
      <!--<a class="tool-li tool-li-4" href="javascript:;" @click="getEleboxList()"><span>控制</span></a>-->
      <!--<a class="tool-li tool-li-5" href="javascript:;" @click="getLightList()"><span>灯具</span></a>-->
    </div>
    <!-- 警告信息 -->
    <div class="satellite" v-bind:class="{'off':satelliteState}" @click="satellite"><i class="iconfont">&#xe623;</i>卫星云图
    </div>
    <div class="sys-warnning" @click="sysWarnningOpen"><i class="iconfont">&#xe623;</i>警报信息</div>
    <div class="shortcut-key" @click="shotCutOpen"><i class="iconfont">&#xe609;</i>快捷键</div>
    <!-- 场景  ***start -->
    <el-dialog title="场景" :visible.sync="sceneDialog" width="540px" center>
      <div class="scene-dialog">
        <div class="operate">
          <el-button type="text" icon='el-icon-plus' @click="addSceneDialog = true">添加场景</el-button>
        </div>
        <el-table ref="multipleTable"
                  :data="sceneList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  header-row-class-name="datalist-header"
                  @selection-change="handleSelectionChange">>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="场景ID"></el-table-column>
          <el-table-column prop="sceneName" label="场景名称"></el-table-column>
          <el-table-column prop="sceneDesc" label="场景描述"></el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="editScene(scope.row.id)"
                type="text"
                size="small">
                编辑
              </el-button>
              <el-button
                class="danger-text-btn"
                @click.native.prevent="deleteScene(scope.row.id)"
                type="text"
                size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :page-size="scenePageSize"
          :current-page.sync="scenePage"
          @current-change="sceneCurrentChange"
          layout="total, prev, pager, next"
          :total="scenePageTotal">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sceneDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="sceneDialog = false" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加场景 -->
    <el-dialog title="添加场景" :visible.sync="addSceneDialog" width="1100px" center :before-close="cancelAddScene">
      <div class="scene-dialog">
        <div class="form-wrap">
          <el-form :model="addScene" :rules="addScenerRules" ref="addScene" label-width="100px">
            <el-form-item label="场景名称" prop="name">
              <el-input v-model="addScene.sceneName" size='small' style="width:360px"></el-input>
            </el-form-item>
            <el-form-item label="场景描述" prop="desc">
              <el-input type="textarea" v-model="addScene.sceneDesc" placeholder="请输入" style="width:500px"
                        size='small'></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="item-list">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="grid-content scene-item">
                <div class="title">灯具分组</div>
                <div class="operate">
                  <el-button type="text" icon='el-icon-plus' @click="selectlampGroup">添加灯具分组</el-button>
                </div>
                <el-table ref="multipleTable"
                          :data="addScene.lightingGroups"
                          tooltip-effect="dark"
                          style="width: 100%"
                          height="300"
                          header-row-class-name="datalist-header"
                          @selection-change="handleSelectionChange">>
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column label="ID" prop="id"></el-table-column>
                  <el-table-column prop="cGroupName" label="分组名称"></el-table-column>
                  <el-table-column prop="mem" label="描述"></el-table-column>
                  <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                      <el-button
                        class="danger-text-btn"
                        @click.native.prevent="deleteRow(scope.$index,addScene.lightingGroups)"
                        type="text"
                        size="small">
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content scene-item">
                <div class="title">任务开关</div>
                <div class="operate">
                  <el-button type="text" icon='el-icon-plus' @click="selectTaskSwitch">添加任务开关</el-button>
                </div>
                <el-table ref="multipleTable"
                          :data="addScene.switchTasks"
                          tooltip-effect="dark"
                          style="width: 100%"
                          height="300"
                          header-row-class-name="datalist-header"
                          @selection-change="handleSelectionChange">>
                  <el-table-column type="selection" width="55" prop="selected"></el-table-column>
                  <el-table-column label="ID" prop="id"></el-table-column>
                  <el-table-column prop="switchName" label="任务名称"></el-table-column>
                  <el-table-column prop="lightPercent" label="调光控制"></el-table-column>
                  <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                      <el-button
                        class="danger-text-btn"
                        @click.native.prevent="deleteRow(scope.$index, addScene.switchTasks)"
                        type="text"
                        size="small">
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddScene" size="small">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateScene" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择灯具分组 -->
    <el-dialog title="选择灯具分组" :visible.sync="selectlampGroupDialog" width="1000px" center>
      <div class="scene-dialog">
        <el-table ref="multipleTable"
                  :data="addSceneLightGroup"
                  tooltip-effect="dark"
                  style="width: 100%"
                  height="340"
                  header-row-class-name="datalist-header"
                  @selection-change="selectLampChange">
          <el-table-column type="selection" width="55" prop="selected"></el-table-column>
          <el-table-column prop="id" width="120" label="ID"></el-table-column>
          <el-table-column prop="cGroupName" width="120" label="灯具分组名称"></el-table-column>
          <el-table-column prop="mem" label="分组描述"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectlampGroupDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="selectlampConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择任务开关 -->
    <el-dialog title="选择任务开关" :visible.sync="selectTaskSwitchDialog" width="1000px" center>
      <div class="scene-dialog">
        <el-table ref="multipleTable"
                  :data="addSceneSwitchTasks"
                  tooltip-effect="dark"
                  style="width: 100%"
                  height="340"
                  header-row-class-name="datalist-header"
                  @selection-change="selectTaskChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="switchName" width="120" label="任务开关名称"></el-table-column>
          <el-table-column label="开始时间" prop="startTime"></el-table-column>
          <el-table-column label="结束时间" prop="endTime"></el-table-column>
          <el-table-column label="启用光照计" prop="isUsebeam"></el-table-column>
          <el-table-column label="周期" prop="period"></el-table-column>
          <el-table-column label="是否开灯" prop="isLighton"></el-table-column>
          <el-table-column label="调光控制" prop="lightPercent"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectTaskSwitchDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="selectTaskConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 场景  ***end-->
    <!-- 任务开关  ***start -->
    <el-dialog title="任务开关" :visible.sync="taskSwitchDialog" width="1000px" center>
      <div class="scene-dialog">
        <div class="operate">
          <el-button type="text" icon='el-icon-plus' @click="openSwitchTaskAdd">添加任务开关</el-button>
        </div>
        <el-table ref="multipleTable"
                  :data="switchTaskList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  height="340px"
                  header-row-class-name="datalist-header"
                  @selection-change="handleSelectionChange">>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="switchName" label="任务开关名称" width="140"></el-table-column>
          <el-table-column label="开始时间" prop="startTime"></el-table-column>
          <el-table-column label="结束时间" prop="endTime"></el-table-column>
          <el-table-column label="启用光照计" prop="isUsebeam"></el-table-column>
          <el-table-column label="是否开灯" prop="isLighton"></el-table-column>
          <el-table-column label="调光控制百分比" prop="lightPercent"></el-table-column>
          <el-table-column label="周期" prop="period"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="getSwitchTask(scope.row.id)"
                type="text"
                size="small">
                编辑
              </el-button>
              <el-button
                class="danger-text-btn"
                @click.native.prevent="deleteSwitchTask(scope.row.id)"
                type="text"
                size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        :page-size="switchTaskPageSize"
        :current-page.sync="switchTaskPage"
        @current-change="switchTaskCurrentChange"
        layout="total, prev, pager, next"
        :total="switchTaskPageTotal">
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="taskSwitchDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="taskSwitchDialog = false" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加任务开关 -->
    <el-dialog title="添加任务开关" :visible.sync="addTaskSwitchDialog" width="700px" center>
      <div class="taskswitch-dialog">
        <div class="form-wrap">
          <el-form :model="addOrUpdateSwitchTaskFormData" ref="addScene" label-width="110px">
            <el-form-item label="任务开关名称" prop="name">
              <el-input v-model="addOrUpdateSwitchTaskFormData.switchName" size='small' required
                        style="width:360px"></el-input>
            </el-form-item>
            <el-form-item label="定时设置">
              <el-time-picker
                is-range
                v-model="addOrUpdateSwitchTaskFormData.time"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker>
            </el-form-item>
            <el-form-item label="是否开灯">
              <el-checkbox v-model="addOrUpdateSwitchTaskFormData.isLighton">是否开灯</el-checkbox>
            </el-form-item>
            <el-form-item label="是否启用光照计">
              <el-checkbox v-model="addOrUpdateSwitchTaskFormData.isUsebeam">是否启用光照计</el-checkbox>
            </el-form-item>
            <el-form-item label="周期(可多选)">
              <el-checkbox v-model="item.flag" v-for="item in addOrUpdateSwitchTaskFormData.period" :key="item.value">
                {{item.label}}
              </el-checkbox>
            </el-form-item>
            <el-form-item label="调光控制百分比">
              <el-slider show-input v-model="addOrUpdateSwitchTaskFormData.lightPercent"></el-slider>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTaskSwitchDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateSwitchTask" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 任务开关  ***end -->
    <!-- 控制柜  ***start -->
    <el-dialog title="控制柜" :visible.sync="ctrlBoxDialog" width="1100px" center>
      <div class="ctrlbox-dialog">
        <el-table ref="multipleTable"
                  :data="EleboxList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  height="340"
                  header-row-class-name="datalist-header"
                  @selection-change="handleSelectionChange">>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop='uid' label="UID"></el-table-column>
          <el-table-column prop='codeNumber' label="编码"></el-table-column>
          <el-table-column prop='mainSwitch' label="主进线开关"></el-table-column>
          <el-table-column prop='latitude' label="纬度"></el-table-column>
          <el-table-column prop='longitude' label="经度"></el-table-column>
          <el-table-column prop='powerRating' label="额定功率"></el-table-column>
          <el-table-column prop='ratedElectricty' label="额定电流"></el-table-column>
          <el-table-column prop='ratedVoltage' label="额定电压"></el-table-column>
          <el-table-column label="使用时间">
            <template slot-scope="scope">
              {{scope.row.useDate | timeFormat}}
            </template>
          </el-table-column>
        </el-table>
        <div class="pagelist-block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage3"
            :page-size="5"
            layout="total, prev, pager, next, jumper"
            :total="10">
          </el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer"></div>
    </el-dialog>
    <!-- 灯具 ***start -->
    <el-dialog title="灯具" :visible.sync="lampsDialog" width="1100px" center>
      <div class="ctrlbox-dialog">
        <el-table ref="multipleTable"
                  :data="lightList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  height="340"
                  header-row-class-name="datalist-header"
                  @selection-change="handleSelectionChange">>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop='uid' label="UID"></el-table-column>
          <el-table-column prop='propertySerialNumber' label="资产编号"></el-table-column>
          <el-table-column prop='lamphead' label="灯头"></el-table-column>
          <el-table-column prop='lamppost' label="灯杆"></el-table-column>
          <el-table-column prop='decay' label="光衰"></el-table-column>
          <el-table-column prop='manufacture' label="生产日期"></el-table-column>
          <el-table-column label="使用时间">
            <template slot-scope="scope">
              {{scope.row.useDate | timeFormat}}
            </template>
          </el-table-column>
          <el-table-column prop='mem' label="备注"></el-table-column>
        </el-table>
        <div class="pagelist-block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage3"
            :page-size="100"
            layout="total, prev, pager, next, jumper"
            :total="1000">
          </el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer"></div>
    </el-dialog>
    <!-- 灯具分组 ***start -->
    <el-dialog title="灯具分组" :visible.sync="lampGroupDialog" width="1000px" center>
      <div class="scene-dialog">
        <div class="operate">
          <el-button type="text" icon='el-icon-plus' @click="addLampEnter">新建灯具分组</el-button>
        </div>
        <el-table
          v-loading="loading.loadLampGroup"
          :data="lightGroupList"
          tooltip-effect="dark"
          style="width: 100%"
          height="340px"
          header-row-class-name="datalist-header">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="组ID" width="140"></el-table-column>
          <el-table-column prop="cGroupName" label="灯具分组名称" width="140"></el-table-column>
          <el-table-column prop="mem" label="描述"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="editLightGroup(scope.row.id)"
                type="text"
                size="small">
                编辑
              </el-button>
              <el-button
                class="danger-text-btn"
                @click.native.prevent="deleteLightGroup(scope.row.id)"
                type="text"
                size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :page-size="lightGroupPageSize"
          :current-page.sync="lightGroupPage"
          @current-change="lightGroupCurrentChange"
          layout="total, prev, pager, next"
          :total="lightGroupPageTotal">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="lampGroupDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="lampGroupDialog = false" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 控制柜模块 ***start -->
    <el-dialog title="控制柜模块" :visible.sync="eleboxModelDialog" width="700px" center>
      <div>
        <el-table
          :data="currentModelList"
          tooltip-effect="dark"
          style="width: 100%"
          height="340px"
          header-row-class-name="datalist-header">
          <el-table-column prop="modelCode" label="模块编码" width="140"></el-table-column>
          <el-table-column prop="modelName" label="模块名称" width="140"></el-table-column>
          <el-table-column prop="loopCount" label="回路数量"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="getLoop(scope.row.id)"
                type="text"
                size="small">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eleboxModelDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="eleboxModelDialog = false" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 控制柜模块回路 ***start -->
    <el-dialog title="控制柜模块回路" :visible.sync="eleboxModelLoopDialog" width="550px" center>
      <div>
        <el-table
          :data="currentModelLoopList"
          tooltip-effect="dark"
          style="width: 100%"
          height="300px"
          header-row-class-name="datalist-header">
          <el-table-column prop="loopCode" label="回路编码" width="140"></el-table-column>
          <el-table-column prop="lightCount" label="灯具数量"></el-table-column>
          <el-table-column prop="modelName" label="状态" width="140">
            <template slot-scope="scope">
              {{scope.row.state?'通电':'断电'}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.state"
                active-text="OFF"
                inactive-text="ON">
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eleboxModelLoopDialog = false" size="small">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 新建灯具分组 -->
    <el-dialog title="新建灯具分组" :visible.sync="addLampGroupDialog" width="1100px" center :show-close="false">
      <div class="lamp-group-dialog">
        <div class="form-wrap">
          <el-form :model="addLightGroupFormData" ref="addScene" label-width="120px">
            <el-form-item label="灯具分组名称" required prop="cGroupName">
              <el-input size='small' style="width:360px" v-model="addLightGroupFormData.cGroupName"></el-input>
            </el-form-item>
            <el-form-item label="描述" required prop="mem">
              <el-input type="textarea" placeholder="请输入" style="width:500px" size='small'
                        v-model="addLightGroupFormData.mem"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-tabs v-model="activemode">
          <!--<el-tab-pane label="地图模式" name="mapMode">-->
          <!--<div class="map-mode">-->
          <!--<el-amap vid='amapDemo2' :center="center" :plugin='plugins'></el-amap>-->
          <!--</div>-->
          <!--</el-tab-pane>-->
          <el-tab-pane label="控制柜模式" name="ctrlBoxMode">
            <div class="transfer-wrap clearfix">
              <div class="select-wrap">
                <div class="title">可添加灯具列表</div>
                <el-table
                  ref="multipleTable"
                  :data="lightList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  height="350"
                  header-row-class-name="datalist-header"
                  @row-click="addLightRow">
                  <el-table-column label="ID" width="80" prop="id"></el-table-column>
                  <el-table-column label="灯杆" width="130" prop="lamppost"></el-table-column>
                  <el-table-column label="灯头号" prop="lamphead" width="120"></el-table-column>
                  <el-table-column label="备注" width="140" prop="mem"></el-table-column>
                </el-table>
              </div>
              <div class="controll-wrap">
                <div class="controll-btn">
                  <el-button size='small' icon="el-icon-arrow-left"></el-button>
                </div>
                <div class="controll-btn">
                  <el-button size='small' icon="el-icon-arrow-right"></el-button>
                </div>
              </div>
              <div class="select-wrap">
                <div class="title">已添加灯具列表</div>
                <el-table
                  ref="multipleTable"
                  :data="addLightGroupFormData.lightingList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  height="350"
                  header-row-class-name="datalist-header"
                  @row-click="deleteLightRow">
                  <el-table-column label="ID" width="80" prop="id"></el-table-column>
                  <el-table-column label="灯杆" width="130" prop="lamppost"></el-table-column>
                  <el-table-column label="灯头号" prop="lamphead" width="120"></el-table-column>
                  <el-table-column label="备注" width="140" prop="mem"></el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="组组模式" name="groupMode">
            <div class="transfer-wrap clearfix">
              <div class="select-wrap">
                <div class="title">可添加灯具分组</div>
                <el-table
                  ref="multipleTable"
                  :data="lightGroupList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  height="350"
                  header-row-class-name="datalist-header"
                  @row-click="addLightGroupRow">
                  <el-table-column label="灯具分组名称" width="140" prop="cGroupName"></el-table-column>
                  <el-table-column label="描述" prop="mem"></el-table-column>
                </el-table>
              </div>
              <div class="controll-wrap">
                <div class="controll-btn">
                  <el-button size='small' icon="el-icon-arrow-left"></el-button>
                </div>
                <div class="controll-btn">
                  <el-button size='small' icon="el-icon-arrow-right"></el-button>
                </div>
              </div>
              <div class="select-wrap">
                <div class="title">已添加灯具分组</div>
                <el-table
                  ref="multipleTable"
                  :data="addLightGroupFormData.lightingGroupList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  height="350"
                  header-row-class-name="datalist-header"
                  @row-click="deleteLightGroupRow">
                  <el-table-column label="灯具分组名称" width="140" prop="cGroupName"></el-table-column>
                  <el-table-column label="描述" prop="mem"></el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddLightGroup" size="small">取 消</el-button>
        <el-button type="primary" @click="createLightGroup" size="small">确认提交</el-button>
      </span>
    </el-dialog>
    <!-- 警告信息 -->
    <el-dialog title="警报信息" :visible.sync="sysWarnningDialog" width="780px" center>
      <div class="system-warning clearfix">
        <div class="info-classify">
          <h3>警报类型</h3>
          <el-tree
            :data="dataWarnClassify"
            :props="defaultProps"
            accordion
            @node-click="getAlarmList">
          </el-tree>
        </div>
        <div class="info-list">
          <h3>警报列表</h3>
          <el-table ref="multipleTable"
                    :data="alarmList"
                    tooltip-effect="dark"
                    style="width: 100%"
                    height="325"
                    header-row-class-name="datalist-header">
            <el-table-column prop='alarmSource' label="来源"></el-table-column>
            <el-table-column prop='alarmTime' label="报警时间"></el-table-column>
            <el-table-column prop='ctype' label="类型"></el-table-column>
            <el-table-column prop='msg' label="消息"></el-table-column>
            <el-table-column prop='state' label="状态"></el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sysWarnningDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="sysWarnningDialog = false" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 快捷键 -->
    <el-dialog title="设置快捷键" :visible.sync="shortcutKeyDialog" width="500px" center @before-close="openKeyDown=false">
      <div class="shortcut-wrap">
        <div class="operate">
          <el-button type="text" icon='el-icon-plus' @click="addShotCutDialog=true">添加快捷键</el-button>
          <el-button type="text" @click="openKeyDown=!openKeyDown">{{openKeyDown?'停止':'开始'}}快捷键调用</el-button>
        </div>
        <el-row>
          <el-col>
            <div class="grid-content">
              <div class="select-wrap" v-for="item in shotCutList" :key="item.id">
                <span>快捷键 {{item.shotcutName}}</span>
                <el-select v-model="item.nnlightctlSceneId" placeholder="选择场景" @change="addOrUpdateSceneShotcut(item)">
                  <el-option
                    v-for="item in sceneList"
                    :key="item.id"
                    :label="item.sceneName"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-button class="f-r" @click="deleteSceneShotcut(item.id)">删除</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <!--<span slot="footer" class="dialog-footer">-->
      <!--<el-button @click="shortcutKeyDialog = false" size="small">取 消</el-button>-->
      <!--<el-button type="primary" @click="shortcutKeyDialog = false" size="small">确 定</el-button>-->
      <!--</span>-->
    </el-dialog>
    <!-- 灯具信息调节 -->
    <el-dialog title="灯具信息调节" :visible.sync="loghtInfoDialog" width="800px" center>
      <div class="lightinfo-wrap">
        <el-row>
          <el-col :span="10">
            <div class="info">
              灯具坐标：<span>经度：{{ Number(this.lightData[0].longitude).toFixed(5) }}</span><span>纬度：{{ Number(this.lightData[0].latitude).toFixed(5) }}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="info">光衰：<span>{{ this.lightData[0].decay }}年 </span></div>
          </el-col>
          <el-col :span="10">
            <div class="info">UUID：<span>{{ this.lightData[0].uid }} </span></div>
          </el-col>
        </el-row>
        <el-row style="margin: 20px 0">
          <el-col :span="12">
            <div class="light-wrap">
              <i class="iconfont" :style="{ opacity: lightOpacity }">&#xe62b;</i>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="select-btn" v-for="(item, key, index) in brightness" v-bind:key="index">
              <div class="btn-wrap" v-bind:key="index">
                <el-button style="width:90px" :class="{active:item===selectitem + '%'}" size="medium"
                           @click="active(item)">{{item}}
                </el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="slide-block">
              <el-slider
                v-model="selectitem"
                vertical
                @change="handleslidechange"
                height="200px">
              </el-slider>
              <p class="show-lightness">灯具亮度: {{selectitem}}% </p>
            </div>
          </el-col>
        </el-row>
        <el-table
          :data="lightData"
          tooltip-effect="dark"
          style="width: 100%"
          height="96px"
          header-row-class-name="datalist-header">
          <el-table-column prop="lamphead" label="灯具型号" width="140"></el-table-column>
          <el-table-column prop="propertySerialNumber" label="资产编号" width="140"></el-table-column>
          <el-table-column prop="lamppost" label="灯杆" width="140"></el-table-column>
          <el-table-column prop="manufacture" label="生产日期">
            <template slot-scope="scope">
              {{scope.row.manufacture|timeFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="useDate" label="使用日期">
            <template slot-scope="scope">
              {{scope.row.useDate|timeFormat}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="loghtInfoDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleUpdateLightInof" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加快捷键" :visible.sync="addShotCutDialog" width="500px" center>
      <div class="add-shot-cut">
        <div class="form-wrap">
          <el-form :model="addShotCutFormData" label-width="100px">
            <el-form-item label="快捷键名称" required>
              <el-input size='small' style="width:300px" v-model="addShotCutFormData.shotcutName"
                        placeholder="请输入1-9之间的数字"></el-input>
            </el-form-item>
            <el-form-item label="场景选择" required>
              <el-select v-model="addShotCutFormData.nnlightctlSceneId" placeholder="选择场景">
                <el-option
                  v-for="item in sceneList"
                  :key="item.id"
                  :label="item.sceneName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addShotCutDialog=false" size="small">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateSceneShotcut" size="small">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listElebox,
    listLighting,
    listLightGroup,
    listSwitchTask,
    listScene,
    listEleboxLoop,
    listLoopLighting,
    deleteLightGroup,
    commandLightAdjust,
    createLightGroupByLightIds,
    createLightGroupByLightGroup,
    updateLightGroupFromLight,
    updateLightGroupFromLightGroup,
    deleteSwitchTask,
    addOrUpdateSwitchTask,
    getSwitchTask,
    deleteScene,
    getScene,
    addOrUpdateScene,
    listSceneShotCut,
    deleteSceneShotcut,
    addOrUpdateSceneShotcut,
    listAlarm,
    invokeSceneShotCut
  } from '@/api/GisService/lamp'
  import {getLighting, listEleboxModelByEle, listModelLoop, getLoopLight} from '@/api/RoadLighting/deploy'
  import {commandGetModelStateInfoId, batchConfigModelStateUUID} from '@/api/Command'
  import '../../../utils/filter.js'
  import moment from 'moment'

  export default {
    name: 'GisIndex',
    data () {
      return {
        // 控制柜图标示例
        EleBoxMarks: [],
        LightMarks: [],
        LightLine: '',
        value5: '',
        valuesation: '',
        options: [],
        checked: false,
        EleboxList: null,
        lightList: null,
        lightGroupList: null,
        selectitem: 75,
        brightness: ['100%', '75%', '50%', '25%', '0%'],
        lightData: [{
          decay: 20, // -- 光衰
          gmtCreated: 1527662927000,
          gmtUpdated: 1527662927000,
          longitude: '113.920400',
          latitude: '22.533800',
          id: 1,
          lamphead: 'LL650', // -- 灯头号
          lamppost: '5米长灯标', // -- 灯杆
          manufacture: 1526453346000, // -- 生产日期
          maxUseTime: 15, // -- 最大使用时间（年）
          mem: '测试灯具1', // -- 备注
          propertySerialNumber: 'P0092929', // -- 资产编号
          uid: '0010101010', // -- 灯具uid
          useDate: 1527662952000, // -- 使用日期
          brightness: '70%'
        }],
        // lightOpacity: 0.5, //灯的亮度
        mockList: [
          {
            longitude: '113.920400',
            latitude: '22.533800',
            state: 1
          },
          {
            longitude: '113.940400',
            latitude: '22.522600',
            state: 1
          },
          {
            longitude: '113.940400',
            latitude: '22.511200',
            state: 0
          }], // mockdataA
        cabinetList: [],
        projectId: '',
        addLightGroupFormData: {lightingList: [], lightingGroupList: []},
        eleboxModelDialog: false,
        eleboxModelLoopDialog: false,
        sceneDialog: false,
        addSceneDialog: false,
        selectlampGroupDialog: false,
        selectTaskSwitchDialog: false,
        taskSwitchDialog: false,
        addTaskSwitchDialog: false,
        ctrlBoxDialog: false,
        lampsDialog: false,
        lampGroupDialog: false,
        addLampGroupDialog: false,
        sysWarnningDialog: false,
        shortcutKeyDialog: false,
        loghtInfoDialog: false,
        addShotCutDialog: false,
        openKeyDown: false, // 是否可以利用快捷键
        activemode: 'ctrlBoxMode',
        loading: {
          loadLampGroup: false
        },
        addScenerRules: {
          name: [
            {required: true, message: '请输入场景名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          desc: [
            {required: true, message: '请输入场景描述', trigger: 'blur'}
          ]
        },
        // 控制柜
        dataEleBox: [
          {
            label: '控制柜1',
            children: [{
              label: '灯具1'
            },
              {
                label: '灯具1'
              }]
          },
          {
            label: '控制柜1',
            children: [{
              label: '灯具1'
            },
              {
                label: '灯具1'
              }]
          }],
        defaultProps: {
          children: 'children',
          label: 'ctype'
        },
        dataWarnClassify: [
          {
            ctype: '全部',
            children: [{
              ctype: '控制柜',
              children: [
                {
                  ctype: '意外亮灯',
                  alarmSource: '控制柜',
                  value: 1
                },
                {
                  ctype: '意外灭灯',
                  alarmSource: '控制柜',
                  value: 2
                },
                {
                  ctype: '线路过流',
                  alarmSource: '控制柜',
                  value: 3
                },
                {
                  ctype: '线路过压',
                  alarmSource: '控制柜',
                  value: 4
                },
                {
                  ctype: '线路欠压',
                  alarmSource: '控制柜',
                  value: 5
                },
                {
                  ctype: '配电柜断电',
                  alarmSource: '控制柜',
                  value: 6
                },
                {
                  ctype: '配电柜缺相',
                  alarmSource: '控制柜',
                  value: 7
                },
                {
                  ctype: '配电柜漏电',
                  alarmSource: '控制柜',
                  value: 8
                },
                {
                  ctype: '功率因数越线',
                  alarmSource: '控制柜',
                  value: 9
                },
                {
                  ctype: '柜门开启',
                  alarmSource: '控制柜',
                  value: 10
                },
                {
                  ctype: '配电柜倾斜',
                  alarmSource: '控制柜',
                  value: 11
                },
                {
                  ctype: '配电柜进水',
                  alarmSource: '控制柜',
                  value: 12
                },
                {
                  ctype: '配电柜雷击',
                  alarmSource: '控制柜',
                  value: 13
                },
                {
                  ctype: '手自控切换',
                  alarmSource: '控制柜',
                  value: 14
                },
                {
                  ctype: '外部控制器',
                  alarmSource: '控制柜',
                  value: 15
                },
                {
                  ctype: '自定义警报',
                  alarmSource: '控制柜',
                  value: 16
                }]
            },
              {
                ctype: '常规灯具',
                children: [
                  {
                    ctype: '灯具故障',
                    alarmSource: '常规灯具',
                    value: 1
                  },
                  {
                    ctype: '电源故障',
                    alarmSource: '常规灯具',
                    value: 2
                  },
                  {
                    ctype: '补偿电容',
                    alarmSource: '常规灯具',
                    value: 3
                  },
                  {
                    ctype: '灯杆漏电',
                    alarmSource: '常规灯具',
                    value: 4
                  },
                  {
                    ctype: '节点丢失',
                    alarmSource: '常规灯具',
                    value: 5
                  },
                  {
                    ctype: '继电器故障',
                    alarmSource: '常规灯具',
                    value: 6
                  },
                  {
                    ctype: '灯具过流',
                    alarmSource: '常规灯具',
                    value: 7
                  },
                  {
                    ctype: '灯具过压',
                    alarmSource: '常规灯具',
                    value: 8
                  },
                  {
                    ctype: '高温',
                    alarmSource: '常规灯具',
                    value: 9
                  },
                  {
                    ctype: '灯具寿命',
                    alarmSource: '常规灯具',
                    value: 10
                  },
                  {
                    ctype: '检修口门',
                    alarmSource: '常规灯具',
                    value: 11
                  },
                  {
                    ctype: '灯杆倾斜',
                    alarmSource: '常规灯具',
                    value: 12
                  }
                ]
              }]
          }
        ],
        lampMap: null,
        satelliteState: 0,
        satelliteLayer: new AMap.TileLayer.Satellite(),
        lightGroupPage: 1,
        lightGroupPageSize: 10,
        lightGroupPageTotal: 0,
        switchTaskList: [],
        switchTaskPage: 1,
        switchTaskPageSize: 10,
        switchTaskPageTotal: 0,
        addOrUpdateSwitchTaskFormData: {
          id: '',
          switchName: '',
          time: [new Date(), new Date()],
          isLighton: false,
          isUsebeam: false,
          period: [
            {flag: false, value: 1, label: '平常'},
            {flag: false, value: 2, label: '周末'},
            {flag: false, value: 4, label: '节假日'}
          ],
          lightPercent: 0
        },
        addScene: {
          lightingGroups: [],
          switchTasks: []
        },
        switchTasks: [],
        lightingGroups: [],
        scenePage: 1,
        scenePageSize: 10,
        scenePageTotal: 0,
        sceneName: '',
        sceneList: [],
        addSceneLightGroup: [],
        addSceneSwitchTasks: [],
        shotCutList: [],
        addShotCutFormData: {},
        alarmList: [],
        alarmState: {
          0: '报警中',
          1: '已解除',
          2: '已处理',
          3: '已失效'
        },
        currentModelList: [],
        currentModelLoopList: []
      }
    },
    watch: {
      openKeyDown: function (val) {
        if (val) {
          this.$message({
            message: '现在可以进行快捷键调用',
            type: 'default'
          })
        } else {
          this.$message({
            message: '已停止进行快捷键调用',
            type: 'default'
          })
        }
      }
    },
    computed: {
      lightOpacity: function () {
        return this.selectitem / 100
      }
    },
    mounted () {
      let _this = this
      document.onkeydown = function (e) { // 用于快捷场景调用
        if (_this.openKeyDown) {
          invokeSceneShotCut(e.key.toString()).then(res => {
            console.log(res)
          })
        }
      }
      this.lampMap = new AMap.Map('lamp-map', { // 地图初始化
        resizeEnable: true, // 自适应大小
        zoom: 12, // 初始视窗
        center: [116.397428, 39.90923]
      })
      this.listElebox()
    },
    methods: {
      getLoop (id) { // 获取回路
        this.eleboxModelLoopDialog = true
        listModelLoop(id).then(res => {
          this.currentModelLoopList = res.data
        })
        commandGetModelStateInfoId(id).then(res => {
          console.log(res)
        })
      },
      getClickModel (id) { // 获取模块
        listEleboxModelByEle(id).then(res => {
          this.eleboxModelDialog = true
          this.currentModelList = res.data
        })
      },
      listElebox () { // 获取项目下所有的控制柜
        listElebox(this.projectId).then(res => {
          this.EleboxList = res.data ? res.data : this.EleboxList
          let marks = []
          this.EleboxList.length && this.EleboxList.forEach(element => {
            let gps = [element.longitude, element.latitude]
            AMap.convertFrom(gps, 'gps', (status, result) => {
              if (result.info === 'ok') {
                let markData = new AMap.Marker({ // 控制柜标记
                  position: new AMap.LngLat(result.locations[0].lng, result.locations[0].lat),
                  content: `<i class="iconfont" style="font-size: 20px">&#xe602;</i>`,
                  offset: new AMap.Pixel(-10, -10),
                  label: {content: '控制柜', offset: (-20, -30)}
                })
                markData.on('click', () => {
                  this.getClickModel(element.id)
                })
                this.listEleboxModelByEle(element.id, [result.locations[0].lng, result.locations[0].lat])
                marks.push(markData)
                this.lampMap.add(marks)
              }
            })
          })
        })
      },
      listEleboxModelByEle (id, eleBoxLnglat) { // 获取控制柜下边所有的模块
        listEleboxModelByEle(id).then(res => {
          res.data.length && res.data.forEach(d => {
            this.listModelLoop(d.id, eleBoxLnglat)
          })
        })
      },
      listModelLoop (id, eleBoxLnglat) { // 获取模块下所有的回路
        listModelLoop(id).then(res => {
          res.data.length && res.data.forEach(d => {
            this.getLoopLight(d.id, eleBoxLnglat)
          })
        })
      },
      getLoopLight (id, eleBoxLnglat) { // 获取回路下所有灯具
        getLoopLight(id).then(res => {
          if (res.data.length) {
            let lineArr = [] // 存储回路的gps信息，此经纬度已经是高德地图的坐标
            lineArr.push(new AMap.LngLat(eleBoxLnglat[0], eleBoxLnglat[1]))
            let marks = []
            this.lightList = []
            // this.lampMap.setCenter([res.data[0].longitude, res.data[0].latitude])
            res.data.length && res.data.forEach((element, i) => {
              this.lightList.push({
                id: element.id,
                mem: element.mem,
                lamphead: element.lamphead,
                lamppost: element.lamppost
              })
              let gps = [element.longitude, element.latitude]
              AMap.convertFrom(gps, 'gps', (status, result) => {
                if (result.info === 'ok') {
                  let markData = new AMap.Marker({
                    position: new AMap.LngLat(result.locations[0].lng, result.locations[0].lat),
                    content: `<i class="iconfont ${element.state === 1 ? '' : 'not-work'}">&#xe60b;</i>`,
                    offset: new AMap.Pixel(-10, -10),
                    label: {content: element.mem, offset: (20, 30)}
                  })
                  lineArr.push(new AMap.LngLat(result.locations[0].lng, result.locations[0].lat))
                  markData.on('click', () => {
                    this.editLightInfo(element.id)
                  })
                  marks.push(markData)
                  this.lampMap.add(marks)
                  if (i === res.data.length - 1) {
                    this.$hub.$emit('drawLine') // 高德地图坐标转化为异步执行，此处等待所有坐标完成后通知页面进行花回路连接线
                  }
                }
              })
            })
            this.$hub.$on('drawLine', () => {
              let polyline = new AMap.Polyline({
                path: lineArr,
                borderWeight: 2, // 线条宽度，默认为 1
                strokeColor: '#00CEFF', // 线条颜色
                lineJoin: 'round' // 折线拐点连接处样式
              })
              // 将折线添加至地图实例
              this.lampMap.add(polyline)
            })
          }
        })
      },
      sysWarnningOpen () { // 获取警报
        this.sysWarnningDialog = true
        this.getListAlarm()
      },
      getAlarmList (val) { // 获取报警列表类型处理
        switch (val.ctype) {
          case '全部':
            this.getListAlarm()
            break
          case '控制柜':
            this.getListAlarm('控制柜')
            break
          case '常规灯具':
            this.getListAlarm('常规灯具')
            break
          default:
            this.getListAlarm(val.alarmSource, val.value)
        }
      },
      getListAlarm (alarmSource, ctype) { // 获取报警的请求
        listAlarm(alarmSource, ctype).then(res => {
          this.alarmList = res.data
          res.data.length && res.data.forEach(d => {
            d.alarmTime = moment(d.alarmTime).format('YYYY-MM-DD')
            d.state = this.alarmState[d.state] || '未知'
          })
        })
      },
      deleteRow (index, rows) {
        rows.splice(index, 1)
      },
      addLightRow (row, event, column) { // 灯具处理
        let flag = false
        this.addLightGroupFormData.lightingList.length && this.addLightGroupFormData.lightingList.forEach(d => {
          if (d.id === row.id) {
            this.$message({
              message: '请勿重复添加',
              type: 'warning'
            })
            flag = true
          }
        })
        if (!flag) {
          let index_ = this.lightList.indexOf(row)
          this.lightList.splice(index_, 1)
          this.addLightGroupFormData.lightingList.push(row)
        }
      },
      deleteLightRow (row, event, column) { // 删除当前灯具
        let index_ = this.addLightGroupFormData.lightingList.indexOf(row)
        this.addLightGroupFormData.lightingList.splice(index_, 1)
        this.lightList.push(row)
      },
      addLightGroupRow (row, event, column) {
        let flag = false
        this.addLightGroupFormData.lightingGroupList.length && this.addLightGroupFormData.lightingGroupList.forEach(d => {
          if (d.id === row.id) {
            this.$message({
              message: '请勿重复添加',
              type: 'warning'
            })
            flag = true
          }
        })
        if (!flag) {
          let index_ = this.lightGroupList.indexOf(row)
          this.lightGroupList.splice(index_, 1)
          this.addLightGroupFormData.lightingGroupList.push(row)
        }
      },
      deleteLightGroupRow (row, event, column) {
        let index_ = this.addLightGroupFormData.lightingGroupList.indexOf(row)
        this.addLightGroupFormData.lightingGroupList.splice(index_, 1)
        this.lightGroupList.push(row)
      },
      addLampEnter () { // 打开灯具分组对话框，并且按照醒目获取灯具数据
        this.addLampGroupDialog = true
        listLighting(this.projectId).then(res => {
          this.cabinetList = res.data
        })
      },
      closeAddLightGroup () { // 关闭添加灯具分组
        this.addLampGroupDialog = false
        this.addLightGroupFormData = {lightingList: [], lightingGroupList: []} // 把灯具分组的data置为空
        this.getLightGroupList()
        this.getLightList()
      },
      deleteLightGroup (id) { // 删除灯具分组
        let arr = []
        arr.push(id)
        deleteLightGroup(arr).then(res => {
          if (res.data) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getLightGroupList()
          }
        }).catch(err => {
          console.log(err)
        })
      },
      editLightGroup (id) { // 编辑灯具分组
        this.lightGroupList.forEach(d => {
          if (d.id === id) {
            this.addLightGroupFormData = d
          }
        })
        this.addLampGroupDialog = true
      },
      active (item) { // 调节灯亮度
        switch (item) {
          case '100%':
            this.selectitem = 100
            break
          case '75%':
            this.selectitem = 75
            break
          case '50%':
            this.selectitem = 50
            break
          case '25%':
            this.selectitem = 25
            break
          case '0%':
            this.selectitem = 0
            break
        }
        commandLightAdjust([this.lightData[0].id], this.selectitem).then(res => { // 操作灯
          if (res.data) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          }
        }).catch((res) => {
          console.log(res)
        })
      },
      handleslidechange (event) { // 操作灯光照
        commandLightAdjust([this.lightData[0].id], this.selectitem).then(res => {
          if (res.data) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          }
        }).catch((res) => {
          console.log(res)
        })
      },
      handleUpdateLightInof () { // 更新灯具其他信息
        this.loghtInfoDialog = false
        let lightness = this.selectitem
        commandLightAdjust([this.lightData[0].id], lightness).then(res => {
          if (res.data) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          }
        }).catch((res) => {
          console.log(res)
        })
      },
      currentPage3 () {
        return 1
      },
      handleSizeChange () {
        console.log('处理尺寸变更')
      },
      handleCurrentChange () {
      },
      sceneCurrentChange (val) {
        this.scenePage = val
        this.getSceneList()
      },
      querySearchAsync (queryString, cb) {
        var restaurants = this.restaurants
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(results)
        }, 3000 * Math.random())
      },
      // 排除错误事件
      handleSelectionChange () {
      },
      createStateFilter (queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      getLightGroupList () {
        // 按条件获取分页的灯具分组数据
        this.loading.loadLampGroup = true
        this.lampGroupDialog = true
        listLightGroup(this.lightGroupPage, this.lightGroupPageSize).then(res => {
          this.lightGroupList = res.data
          this.loading.loadLampGroup = false
          this.lightGroupPageTotal = res.total
        }).catch(() => {
        })
      },
      lightGroupCurrentChange (val) { // 灯具分组分页
        this.lightGroupPage = val
        this.getLightGroupList()
      },
      switchTaskCurrentChange (val) {
        this.switchTaskPage = val
        this.getSwitchTaskList()
      },
      getLightList () {
        // 获取项目下全部灯具
        this.lightList = []
        listLighting(this.projectId).then(res => {
          this.lightList = res.data
        }).catch(() => {
        })
      },
      openSwitchTaskAdd () { // 打开任务开关对话框
        this.addTaskSwitchDialog = true
        this.addOrUpdateSwitchTaskFormData = {
          id: '',
          switchName: '',
          time: [new Date(), new Date()],
          isLighton: false,
          isUsebeam: false,
          period: [
            {flag: false, value: 1, label: '平常'},
            {flag: false, value: 2, label: '周末'},
            {flag: false, value: 4, label: '节假日'}
          ],
          lightPercent: 0
        }
      },
      getSwitchTaskList () {
        // 获取任务开关
        const periodGroup = {
          1: '平常',
          2: '周末',
          3: '平常，周末',
          4: '节假日',
          5: '平常，节假日',
          6: '周末，节假日',
          7: '平常，周末，节假日'
        }
        listSwitchTask(this.switchTaskPage, this.switchTaskPageSize).then(res => {
          this.switchTaskList = res.data
          this.switchTaskPageTotal = res.total
          res.data.length && res.data.forEach(d => {
            d.isLighton = d.isLighton ? '开灯' : '关灯'
            d.isUsebeam = d.isUsebeam ? '启用' : '不启用'
            d.startTime = moment(d.startTime).format('hh:mm:ss')
            d.endTime = moment(d.endTime).format('hh:mm:ss')
            d.period = periodGroup[d.period]
          })
          this.taskSwitchDialog = true
        }).catch(() => {
        })
      },
      getSwitchTask (id) { // 获取人物开关
        getSwitchTask(id).then(res => {
          if (res.data) {
            let d = res.data[0]
            let period = [
              {flag: false, value: 1, label: '平常'},
              {flag: false, value: 2, label: '周末'},
              {flag: false, value: 4, label: '节假日'}
            ]
            switch (res.data[0].period) {
              case 1:
                period[0].flag = true
                break
              case 2:
                period[1].flag = true
                break
              case 3:
                period[0].flag = true
                period[1].flag = true
                break
              case 4:
                period[2].flag = true
                break
              case 5:
                period[0].flag = true
                period[2].flag = true
                break
              case 6:
                period[1].flag = true
                period[2].flag = true
                break
              case 7:
                period[0].flag = true
                period[1].flag = true
                period[2].flag = true
            }
            this.addOrUpdateSwitchTaskFormData = {
              id: d.id,
              switchName: d.switchName,
              time: [new Date(d.startTime), new Date(d.endTime)],
              isUsebeam: !!d.isUsebeam,
              isLighton: !!d.isLighton,
              lightPercent: d.lightPercent,
              period: period
            }
            this.addTaskSwitchDialog = true
          }
        })
      },
      addOrUpdateSwitchTask () { // 新增或者修改任务开关
        let period = 0
        this.addOrUpdateSwitchTaskFormData.period.forEach(d => {
          if (d.flag) {
            period += d.value
          }
        })
        if (period === 0) {
          this.$message({
            message: '请选择周期',
            type: 'warning'
          })
          return
        }
        let str = period.toString(2)
        let l = str.length
        let s1 = '00000000' // 用于补齐，满8位
        if (l < 8) {
          var s2 = s1.slice(0, 8 - l) // 截取需要补齐的位数
          str = s2 + str // 在前面进行补齐
        }
        let obj = {
          id: this.addOrUpdateSwitchTaskFormData.id,
          switchName: this.addOrUpdateSwitchTaskFormData.switchName,
          startTime: this.addOrUpdateSwitchTaskFormData.time[0].toString(),
          endTime: this.addOrUpdateSwitchTaskFormData.time[1].toString(),
          isLighton: +this.addOrUpdateSwitchTaskFormData.isLighton,
          isUsebeam: +this.addOrUpdateSwitchTaskFormData.isUsebeam,
          period: parseInt(str, 2),
          lightPercent: this.addOrUpdateSwitchTaskFormData.lightPercent
        }
        addOrUpdateSwitchTask(obj).then(res => {
          if (res.data) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.addTaskSwitchDialog = false
            this.getSwitchTaskList()
          }
        })
      },
      deleteSwitchTask (id) { // 删除任务开关
        let ids = []
        ids.push(id)
        deleteSwitchTask(ids).then(res => {
          if (res.data) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getSwitchTaskList()
          }
        })
      },
      getSceneList () { // 获取场景列表
        // 按搜索条件获取分页的场景模式数据
        listScene(this.scenePage, this.scenePageSize).then(res => {
          this.sceneList = res.data
          this.scenePageTotal = res.total
          this.sceneDialog = true
        }).catch(() => {
        })
      },
      editScene (id) { // 编辑场景
        getScene(id).then(res => {
          this.addScene = res.data[0]
          this.addSceneDialog = true
        })
      },
      deleteScene (id) { // 删除场景
        let ids = []
        ids.push(id)
        deleteScene(ids).then(res => {
          if (res.data) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getSceneList()
          }
        })
      },
      addOrUpdateScene () { // 新增或者修改场景
        let obj = {
          id: this.addScene.id || '',
          sceneName: this.addScene.sceneName,
          sceneDesc: this.addScene.sceneDesc
        }
        let lightingGroups = []
        this.addScene.lightingGroups.length && this.addScene.lightingGroups.forEach(d => {
          if (d.id) {
            lightingGroups.push(d.id)
          }
        })
        let switchTasks = []
        this.addScene.switchTasks.length && this.addScene.switchTasks.forEach(d => {
          if (d.id) {
            switchTasks.push(d.id)
          }
        })
        obj.lightingGroupIds = lightingGroups
        obj.switchTaskIds = switchTasks
        addOrUpdateScene(obj).then(res => {
          if (res.data) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.addSceneDialog = false
            this.getSceneList()
            this.addScene = {
              lightingGroups: [],
              switchTasks: []
            }
          }
        })
      },
      cancelAddScene () { // 取消添加场景
        this.addSceneDialog = false
        this.addScene = {
          lightingGroups: [],
          switchTasks: []
        }
      },
      selectlampConfirm () { // 选择灯具确定
        this.addScene.lightingGroups = this.lightingGroups
        this.selectlampGroupDialog = false
      },
      selectTaskConfirm () {
        this.addScene.switchTasks = this.switchTasks
        this.selectTaskSwitchDialog = false
      },
      selectTaskChange (val) {
        this.switchTasks = val
      },
      selectLampChange (val) {
        this.lightingGroups = val
      },
      selectlampGroup () {
        this.selectlampGroupDialog = true
        listLightGroup().then(res => {
          this.addSceneLightGroup = res.data
        })
      },
      selectTaskSwitch () { // 选择任务开关
        this.selectTaskSwitchDialog = true
        const periodGroup = {
          1: '平常',
          2: '周末',
          3: '平常，周末',
          4: '节假日',
          5: '平常，节假日',
          6: '周末，节假日',
          7: '平常，周末，节假日'
        }
        listSwitchTask().then(res => {
          this.addSceneSwitchTasks = res.data
          res.data.length && res.data.forEach(d => {
            d.isLighton = d.isLighton ? '开灯' : '关灯'
            d.isUsebeam = d.isUsebeam ? '启用' : '不启用'
            d.startTime = moment(d.startTime).format('hh:mm:ss')
            d.endTime = moment(d.endTime).format('hh:mm:ss')
            d.period = periodGroup[d.period]
          })
        }).catch(() => {
        })
      },
      shotCutOpen () { // 场景列表
        listScene().then(res => {
          this.sceneList = res.data
        }).catch(() => {
        })
        this.listSceneShotCut()
        this.shortcutKeyDialog = true
      },
      listSceneShotCut () { // 场景快捷键列表
        listSceneShotCut().then(res => {
          if (res.data) {
            this.shotCutList = res.data
          } else {
            this.$message({
              message: '网络错误',
              type: 'warning'
            })
          }
        })
      },
      deleteSceneShotcut (id) { // 删除场景快捷键
        let ids = []
        ids.push(id)
        deleteSceneShotcut(ids).then(res => {
          if (res.data) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.listSceneShotCut()
          }
        })
      },
      addOrUpdateSceneShotcut (item) { // 新增或修改场景快捷键
        let obj = {}
        if (item.id) {
          obj = {
            id: item.id,
            shotcutName: item.shotcutName,
            nnlightctlSceneId: item.nnlightctlSceneId
          }
        } else {
          obj = this.addShotCutFormData
        }
        addOrUpdateSceneShotcut(obj).then(res => {
          if (res.data) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            !item.id && this.listSceneShotCut()
            this.addShotCutDialog = false
          } else {
            this.$message({
              message: '网络错误',
              type: 'warning'
            })
          }
        })
      },
      editLightInfo (litghtid) {
        this.loghtInfoDialog = true
        // 获取灯具具体信息
        getLighting(litghtid).then(res => {
          if (res.data) {
            this.lightData = res.data // 数据接口正常则使用数据接口数据，不正常显示默认数据
          }
        }).catch(() => {
        })
      },
      satellite () { // 是否显示卫星云图
        if (this.satelliteState) {
          this.lampMap.remove(this.satelliteLayer)
        } else {
          this.lampMap.add(this.satelliteLayer)
        }
        this.satelliteState = !this.satelliteState
      },
      createLightGroup () { // 新增、修改灯具分组
        let obj = {
          cGroupName: this.addLightGroupFormData.cGroupName,
          mem: this.addLightGroupFormData.mem
        }
        if (this.activemode === 'ctrlBoxMode') {
          let lightIds = []
          this.addLightGroupFormData.lightingList.forEach(d => {
            lightIds.push(d.id)
          })
          obj.lightIds = lightIds
          if (this.addLightGroupFormData.id) {
            obj.id = this.addLightGroupFormData.id
            updateLightGroupFromLight(obj).then(res => {
              if (res.data) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.getLightGroupList()
                this.addLightGroupFormData = {lightingList: [], lightingGroupList: []}
                this.addLampGroupDialog = false
              }
            })
          } else {
            createLightGroupByLightIds(obj).then(res => {
              if (res.data) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.getLightGroupList()
                this.addLightGroupFormData = {lightingList: [], lightingGroupList: []}
                this.addLampGroupDialog = false
              }
            })
          }
        } else {
          let lightGroupIds = []
          this.addLightGroupFormData.lightingGroupList.forEach(d => {
            lightGroupIds.push(d.id)
          })
          obj.lightGroupIds = lightGroupIds
          if (this.addLightGroupFormData.id) {
            obj.id = this.addLightGroupFormData.id
            updateLightGroupFromLightGroup(obj).then(res => {
              if (res.data) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.getLightGroupList()
                this.addLightGroupFormData = {lightingList: [], lightingGroupList: []}
                this.addLampGroupDialog = false
              }
            })
          } else {
            createLightGroupByLightGroup(obj).then(res => {
              if (res.data) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.getLightGroupList()
                this.addLightGroupFormData = {lightingList: [], lightingGroupList: []}
                this.addLampGroupDialog = false
              }
            })
          }
        }
      }
    },
    created () {
      this.projectId = this.$router.history.current.query.projectId // 获取当前所在项目ID
    }
  }
</script>

<style lang='scss' scoped>
  .map-wrap {
    position: absolute;
    top: 76px;
    right: 0;
    left: 200px;
    bottom: 0;
  }

  .active {
    background: #5789fa;
    color: white;
  }

  #lamp-map {
    width: 100%;
    height: 100%;
  }

  .search-wrap {
    position: absolute;
    top: 20px;
    left: 20px;
  }

  .lamp-tool {
    position: absolute;
    top: 80px;
    left: 20px;
    width: 60px;
    // border: 1px red solid;
    .tool-li {
      display: flex;
      align-content: center;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      height: 60px;
      width: 60px;
      border-radius: 5px;
      text-align: center;
      box-sizing: border-box;
      color: #333333;
      font-size: 16px;

      span {
        flex: 1;
      }

      &-1 {
        background-color: rgba($color: #39DCBA, $alpha: .6);
        border: 2px #39DCBA solid;
      }

      &-2 {
        background-color: rgba($color: #FF5372, $alpha: .6);
        border: 2px #FF5372 solid;
      }

      &-3 {
        background-color: rgba($color: #00CEFF, $alpha: .6);
        border: 2px #00CEFF solid;
      }

      &-4 {
        background-color: rgba($color: #B19EFF, $alpha: .6);
        border: 2px #B19EFF solid;
      }

      &-5 {
        background-color: rgba($color: #FFCF7C, $alpha: .6);
        border: 2px #FFCF7C solid;
      }
    }
  }

  .located-tool {
    position: absolute;
    top: 20px;
    left: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    width: 40px;
    cursor: pointer;

    .iconfont {
      color: #5789FA;
      font-size: 30px;
    }
  }

  .select-device {
    width: 184px;
    height: 320px;
    background: #ffffff;
  }

  .sys-warnning {
    position: absolute;
    top: 15px;
    right: 150px;
    padding: 10px 15px;
    text-align: center;
    background: #FAE58C;
    box-shadow: 2px 3px 4px 0 rgba($color: #CCCACA, $alpha: .5);
    font-size: 14px;
    cursor: pointer;

    .iconfont {
      position: relative;
      top: -1px;
      color: #ff9b00;
      font-size: 20px;
      margin-right: 10px;
      vertical-align: middle;
    }
  }

  .satellite {
    position: absolute;
    top: 15px;
    right: 30px;
    padding: 13px 15px;
    text-align: center;
    background: #295033;
    color: #ccc;
    box-shadow: 2px 3px 4px 0 rgba($color: #CCCACA, $alpha: .5);
    font-size: 14px;
    cursor: pointer;

    &.off {
      color: #fff;
    }
  }

  .shortcut-key {
    position: absolute;
    top: 15px;
    right: 280px;
    padding: 10px 15px;
    text-align: center;
    background: #ffffff;
    box-shadow: 2px 3px 4px 0 rgba($color: #CCCACA, $alpha: .5);
    font-size: 14px;
    cursor: pointer;

    .iconfont {
      position: relative;
      top: 1px;
      color: #999999;
      font-size: 20px;
      margin-right: 10px;
      vertical-align: middle;
    }
  }

  .shortcut-wrap {
    padding: 0 10px 20px;

    .grid-content {
      padding-left: 25px;
    }

    .select-wrap {
      span {
        margin-right: 5px;
        color: #333333;
      }

      padding-bottom: 10px;
    }
  }

  .system-warning {
    height: 400px;

    .info-classify {
      width: 210px;
      height: 390px;
      float: left;
      border: 1px #dedede solid;
      box-sizing: border-box;
      padding: 20px;
      overflow-y: auto;
    }

    .info-list {
      float: left;
      width: 530px;
      height: 390px;
      border: 1px #dedede solid;
      box-sizing: border-box;
      padding: 15px;
    }

    h3 {
      color: #101010;
      font-size: 14px;
      margin-bottom: 10px;
    }
  }

  .scene-dialog {
    .form-wrap {
      border-bottom: 1px #dedede solid;
    }

    .item-list {
      margin-top: 20px;
      padding: 20px;
      border: 1px #dedede solid;
    }

    .scene-item {
      .title {
        font-weight: bold;
        padding-bottom: 10px;
        font-size: 16px;
        color: #101010;
      }
    }
  }

  .taskswitch-dialog {
    margin-bottom: 120px;
  }

  .lamp-group-dialog {
    height: 580px;

    .el-form-item {
      margin-bottom: 15px;
    }

    .map-mode {
      height: 100%;
      width: 100%;
    }

    .el-tab-pane {
      height: 400px;
    }
  }

  .transfer-wrap {
    .select-wrap {
      float: left;
      width: 490px;
      height: 400px;
      border: 1px solid #dedede;
      box-sizing: border-box;
    }

    .title {
      padding: 10px 20px;
    }

    .controll-wrap {
      padding-top: 150px;
      float: left;
      width: 80px;
      height: 400px;
      text-align: center;

      .controll-btn {
        margin: 20px 0;
      }
    }
  }

  .add-shot-cut {
    padding: 10px 10px;
  }

  .lightinfo-wrap {
    .info {
      color: #FF947D;

      span {
        margin-right: 10px;
        color: #999999;
      }
    }

    .light-wrap {
      height: 290px;
      width: 320px;
      position: relative;
      border: 1px #EBEBEB solid;

      .iconfont {
        position: absolute;
        top: 35px;
        left: 60px;
        font-size: 200px;
        color: #F8E71C;
      }
    }

    .select-btn {
      margin-bottom: 0px;
    }

    .btn-wrap {
      padding-bottom: 15px;
    }
  }
</style>
<style lang="scss">
  .elebox-mark {
    .iconfont {
      color: #5789FA;
      font-size: 36px;
    }
  }

  .light-mark {
    .iconfont {
      color: #ffeb00;
      font-size: 16px;
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, .4);
      border-radius: 50%;

      &.not-work {
        color: #DADAD6;
      }
    }
  }

  .show-lightness {
    margin-top: 20px;
  }
</style>
