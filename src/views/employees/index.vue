<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" width="120" sortable type="index" />
          <el-table-column label="姓名" width="180" sortable prop="username" />
          <el-table-column label="工号" width="180" sortable prop="workNumber" />
          <el-table-column label="聘用形式" width="120" sortable prop="formOfEmployment" :formatter="formatEmployment" />
          <el-table-column label="部门" width="180" sortable prop="departmentName" />
          <!-- <el-table-column label="入职时间" width="250" sortable prop="timeOfEntry" /> -->
          <el-table-column label="入职时间" sortable="" align="center" width="250">
            <!-- 作用域插槽 -->
            <template v-slot="{ row }">{{ row.timeOfEntry | formatDate }}</template>
          </el-table-column>
          <el-table-column label="账户状态" width="180" sortable prop="enableState">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === '1'" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable fixed="right" width="380">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
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
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddDemployee from './components/add-employee'
import { formatDate } from '@/filters'
export default {
  components: {
    AddDemployee

  },
  data() {
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      showDialog: false // 新增弹层控制
    }
  },
  created() {
    this.getEmployeeList()
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
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
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
    }
  }

}
</script>

  <style>

  </style>
