<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/admin/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>保姆介绍</el-breadcrumb-item>
            <el-breadcrumb-item>文章介绍</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="5">
                    <el-button type="primary" @click="showAllBaby">添加文章</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 点击添加先显示所有保姆的信息 -->
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
                prop="date"
                label="日期"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="address"
                label="地址">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagesize: 2,
        pagenum: 1
      },
      allBabySitter: []
    }
  },
  created() {

  },
  methods: {
    async showAllBaby() {
      const { data: res } = await this.$http.get(`admin/allBabySitter/${this.getUserInfo.adress}`, {
        params: {
          query: '',
          pagesize: 10000,
          pagenum: 1
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.message)
      }
      this.allBabySitter = res.data
      console.log(res)
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

</style>
