<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 缺少treeNode -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <tree-tools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" />
        </el-tree>
      </el-card>
    </div>
    <AddDept :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept' // 引入新增部门组件
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index.js'

export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      showDialog: false, // 显示窗体
      node: null
    }
  },
  created() {
    this.getDepartments() // 调用自身的方法
  },
  methods: {
    /** 获取树形数据并格式化 */
    async getDepartments() {
      try {
        const result = await getDepartments()
        // console.log(result.depts)
        // this.list = result.depts
        this.company = { name: 'GGboy科技有限公司', manager: '负责人', id: '' } // id便是undefined，但是通过undefined进行等值判断是寻找不到对应的根节点的，所以要给空
        this.departs = tranListToTreeData(result.depts, '')
      } catch (error) {
        this.$message.error('获取数据错误')
      }
    },
    /** 子组件点击新增的自定义事件函数 */
    addDepts(node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
    }
  }
}
</script>

<style scoped lang="scss">
.app-container {
  .tree-card {
  padding: 30px  120px;
  font-size:15px;
}

}
</style>
