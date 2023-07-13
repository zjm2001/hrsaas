<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%" :class="{ toprow: isRoot }">
    <el-col>
      <!-- 名称应该变成 对应的节点中的name -->
      <span> <i v-if="isRoot" class="el-icon-s-platform" />
        {{ treeNode.name }}
      </span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="operateDepts">
            <span :class="{ dddd: isRoot }">
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    //   定义一个props属性
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  methods: {
    operateDepts(type) {
      if (type === 'add') {
        // 添加子部门的操作
      } else if (type === 'edit') {
        //  编辑部门的操作
      } else {
        //  删除操作
        this.$confirm('确定要删除该部门吗').then(() => {
          // 如果点击了确定就会进入then
          return delDepartments(this.treeNode.id) // 返回promise对象
        }).then(() => {
          //  如果删除成功了  就会进入这里
          this.$emit('delDepts') // 触发自定义事件
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}

</script>
<style scoped>
.toprow {
  border-bottom: 1px solid rgb(183, 179, 179);
  height: 80px;
  font-size: 16px;

}

.dddd {
  font-size: 16px;
}
</style>
