<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" >
            <el-breadcrumb-item :to="{ path: '/admin/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-input placeholder="输入订单号搜索" v-model.trim="queryInfo.query" clearable @clear="getOrderList">
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="5">
                    <el-select v-model="queryInfo.state" placeholder="请选择订单" @change="getOrderList">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <hr class="hrs" >
            <!-- 表格 -->
            <el-table
                :data="orderList"
                style="width: 100%"
                border
                stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column
                    prop="_id"
                    label="订单号">
                </el-table-column>
                <el-table-column
                    prop="uid.username"
                    label="用户名"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="bid.username"
                    label="保姆"
                    width="100">
                </el-table-column>
                <el-table-column prop="price" label="价格" width="90"></el-table-column>
                <el-table-column prop="appTime" label="预约时间"></el-table-column>
                <el-table-column label="备注" width="200">
                    <template slot-scope="scope">
                        <span class="line">{{scope.row.description}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="80">
                    <template slot-scope="scope">
                        <el-tag type="primary" v-if="scope.row.state === 0">未完成</el-tag>
                        <el-tag type="success" v-else>完成</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                class="mt-15"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[2, 4, 6, 8]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

    </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagesize: 2,
        pagenum: 1,
        state: ''
      },
      orderList: [],
      total: 0,
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '完成'
        },
        {
          value: '0',
          label: '未完成'
        }
      ]
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get(`admin/orders/${this.getUserInfo.adress}`, {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.message)
      }
      const orderData = res.data
      orderData.forEach(element => {
        element.appTime = element.appTime.split(',').join('至')
      })
      this.orderList = orderData
      this.total = res.total
      console.log('order', res)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    }
  },
  computed: {
    getUserInfo() {
      const userInfo = window.localStorage.getItem('userInfo')
      return JSON.parse(userInfo)
    }
  }
}
</script>
<style lang="less" scoped>

.hrs {
    border: .5px solid #ccc;
    margin: 20px 0;
}
</style>
