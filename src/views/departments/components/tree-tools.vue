<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%" :class="{ toprow : isRoot }">
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
          <el-dropdown>
            <span :class="{ dddd : isRoot }">
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
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
  }
}
</script>
<style scoped>
.toprow {
    border-bottom: 1px solid rgb(183, 179, 179);
    height: 80px;
    font-size: 16px;

}

.dddd{
    font-size: 16px;
}
</style>
