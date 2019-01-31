<template>
  <div class='map-wrap'>
    <!--地图容器-->
    <div id="project-map"></div>
    <!--查询项目-->
    <div class='search-wrap'>
      <el-select v-model="selectProject" filterable placeholder="请输入内容" clearable @clear="loadProjectList">
        <el-option
          v-for="item in projects"
          :key="item.id"
          :label="item.projectName"
          :value="item.projectName">
        </el-option>
      </el-select>
      <el-button type='primary' icon='el-icon-search' @click="setCurrentProject"></el-button>
    </div>
  </div>
</template>

<script>
  import {listProject} from '@/api/GisService/project'

  export default {
    name: 'GisIndex',
    data () {
      return {
        zoom: 14,
        markers: [],
        center: [108.59996, 32.197646],
        projects: [],
        selectProject: '',
        projectMap: null
      }
    },
    methods: {
      loadProjectList () { // 获取所有项目列表
        let marks = []
        listProject(this.selectProject).then(res => {
          let projectList = res.data
          this.projectMap.setCenter([res.data[0].longitude, res.data[0].latitude])
          projectList.forEach(element => {
            let gps = [element.longitude, element.latitude]
            AMap.convertFrom(gps, 'gps', (status, result) => { // 坐标转换
              if (result.info === 'ok') {
                let markData = new AMap.Marker({
                  position: new AMap.LngLat(result.locations[0].lng, result.locations[0].lat),
                  content: `<i class="iconfont">&#xe638;</i>`,
                  label: {content: element.projectName, offset: (10, 30)}
                })
                markData.on('click', () => { // 添加坐标点点击事件
                  this.$router.push({path: '/gisservice/lamp', query: {projectId: element.id}})
                })
                marks.push(markData)
                this.projectMap.add(marks)
              }
            })
          })
          this.projects = projectList
          //  this.markers = marks
        })
      },
      setCurrentProject () { // 选择当前项目
        if (this.selectProject) {
          this.loadProjectList()
        } else {
          this.$message({
            message: '请选择一个项目',
            type: 'warning'
          })
        }
      }
    },
    mounted () {
      this.projectMap = new AMap.Map('project-map', {
        resizeEnable: true, // 自适应大小
        zoom: 12, // 初始视窗
        center: [116.397428, 39.90923]
      })
      this.loadProjectList()
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

  #project-map {
    width: 100%;
    height: 100%;
  }

  .search-wrap {
    position: absolute;
    top: 20px;
    left: 20px;
  }
</style>
<style lang="scss">
  .project-mark {
    position: relative;
    width: 40px;
    height: 40px;

    .iconfont {
      color: #5789FA;
      font-size: 38px;
    }

    .project-name {
      position: absolute;
      display: inline-block;
      padding: 4px 10px;
      top: -25px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      background: #15A4FA;
      border-radius: 5px;
      color: #ffffff;
    }
  }
</style>
