<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button size="small" :disabled="!checkPermission('aa')" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table :data="list">
          <el-table-column label="序号" sortable type="index" />
          <el-table-column label="姓名" sortable prop="username" />
          <el-table-column label="头像" align="center" width="120">
            <template slot-scope="{row}">
              <img
                slot="reference"
                v-imagerror="defaultImg"
                :src="row.staffPhoto "
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="手机号" sortable prop="mobile" />
          <el-table-column label="工号" sortable prop="workNumber" />
          <el-table-column label="聘用形式" sortable prop="formOfEmployment" :formatter="formatEmployment" />
          <el-table-column label="部门" sortable prop="departmentName" />
          <!-- <el-table-column label="入职时间" width="250" sortable prop="timeOfEntry" /> -->
          <el-table-column label="入职时间" sortable="" align="center">
            <!-- 作用域插槽 -->
            <template v-slot="{ row }">{{ row.timeOfEntry | formatDate }}</template>
          </el-table-column>
          <el-table-column label="账户状态" sortable prop="enableState">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === '1'" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 新增弹层 -->
    <AddDemployee :show-dialog.sync="showDialog" />
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 分配权限弹层组件 -->
    <AssignRole ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddDemployee from './components/add-employee'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import AssignRole from './components/assign-role.vue'
export default {
  components: {
    AddDemployee,
    AssignRole

  },
  data() {
    return {
      defaultImg: require('@/assets/common/head.jpeg'), // 直接写路径打包后就会错误
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      showDialog: false, // 新增弹层控制
      showCodeDialog: false, // 点击头像显示二维码弹层
      showRoleDialog: false,
      userId: null

    }
  },
  created() {
    this.getEmployeeList()
    // this.$store.dispatch('user/getUserInfo')
  //   if (this.list.length === 30) {
  //     return  1
  //   } else {
  //     setInterval(async() => {
  //       await delEmployee(this.list[this.list.length - 1].id)
  //       // console.log(this.list[this.list.length - 1].id)
  //       this.getEmployeeList()
  //     }, 1000)
  //   }
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === Number(cellValue))
      return obj ? obj.value : '未知'
    },
    /** 点击删除 */
    async deleteEmployee(id) {
      try {
        await this.$confirm('确定要删除该部门吗', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        await delEmployee(id)
        await this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        this.$message(error)
      }
    },
    /** 点击导出按钮 */
    exportData() {
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }

      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows) // 返回的data就是 要导出的结构
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2'] // 要合并效果
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头
          data,
          filename: '员工资料表',
          multiHeader,
          merges

        })
      })
    },
    formatJson(headers, rows) {
      return rows.map(item => {
        // item是一个对象
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          // 应为headers[key]为字符串这也写就是item.'mobile'所以会报错必须使用[]
          return item[headers[key]]
        })
      })
    },
    showQrCode(url) {
      // url存在的情况下 才弹出层
      if (url) {
        this.showCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    /** 角色按钮 */
    async editRole(id) {
      this.userId = id
      await this.$refs.assignRole.getUserDetailById(id) // 父组件调用子组件方法
      this.showRoleDialog = true
    }
  }

}
</script>

  <style>

  </style>
