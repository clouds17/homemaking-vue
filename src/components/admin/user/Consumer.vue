<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/admin/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>普通用户</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="5">
                    <el-button type="primary" @click="showAddDialog" >添加用户</el-button>
                </el-col>
            </el-row>
            <hr class="hrs" >
            <el-table
                :data="userList"
                style="width: 100%"
                border
                stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column
                    prop="username"
                    label="用户名">
                </el-table-column>
                <el-table-column
                    prop="email"
                    label="邮箱">
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号">
                </el-table-column>
                <el-table-column
                    label="注册时间">
                    <template slot-scope="scope">
                        {{ scope.row.registerDate | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <el-button icon="el-icon-edit" type="primary" size="mini" @click="showEditDialog(scope.row)"></el-button>
                        <el-button icon="el-icon-delete" type="danger" size="mini" @click="removeUser(scope.row._id)"></el-button>
                        <el-tooltip class="item" effect="dark" content="历史订单" placement="top">
                            <el-button icon="el-icon-document" type="warning" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="mt-15"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户Dialog -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRule" ref="addFormRef" label-width="100px" >
                <el-form-item label="头像" prop="avator">
                    <el-upload
                        class="avatar-uploader"
                        :action="avatorURL"
                        :show-file-list="false"
                        :on-success="addAvatorHandleSuccess"
                        :before-upload="addAvatorBeforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAddDialog">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑用户Dialog -->
        <el-dialog
            title="编辑用户"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed">
            <el-form :model="editForm" :rules="addFormRule" ref="editFormRef" label-width="100px" >
                <el-form-item label="头像" prop="avator">
                    <el-upload
                        class="avatar-uploader"
                        :action="avatorURL"
                        :show-file-list="false"
                        :on-success="editAvatorHandleSuccess"
                        :before-upload="addAvatorBeforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditDialog">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 历史订单 -->
        <el-dialog
          title="历史订单"
          :visible.sync="historyDialogVisible"
          width="50%"
          @close="historyDialogClosed">
          <span>这是一段信息</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="historyDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveHis">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    // 自定义手机验证规则
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^1[3456789]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入符合规则的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      userList: [],
      addDialogVisible: false,
      addForm: {
        username: '',
        email: '',
        password: '',
        mobile: '',
        avator: '',
        adress: '',
        registerDate: ''
      },
      addFormRule: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: ['blur', 'change'] }
        ]
      },
      avatorURL: 'http://localhost:3000/upload/',
      imageUrl: '',
      // 编辑用户的dialog
      editDialogVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: '',
        avator: ''
      },
      editUserId: ''
    }
  },
  created() {
    this.getUserList()
    console.log(Date.now())
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get(`admin/allUser/${this.getUserInfo.adress}`, {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.message)
      }
      this.total = res.total
      this.userList = res.data
      console.log('userList', res)
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    // 头像上传之前
    addAvatorBeforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt3M = file.size / 1024 / 1024 < 3
      if (!isJPG) {
        return this.$message.error('上传头像图片只能是 JPG 格式或者 PNG 格式!')
      }
      if (!isLt3M) {
        return this.$message.error('上传头像图片大小不能超过 3MB!')
      }
      return isJPG && isLt3M
    },
    // 头像上传成功
    addAvatorHandleSuccess(response) {
      if (response.meta.status !== 200) {
        return this.$message.error(response.meta.message)
      }
      this.imageUrl = response.data.url
      this.addForm.avator = response.data.tmp_path
      console.log('success', response)
    },
    // 添加dialog框关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.imageUrl = ''
      this.addForm.avator = ''
    },
    // 添加dialog框保存
    saveAddDialog() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return 0
        const userData = this.addForm
        if (userData.avator === '') {
          userData.avator = 'uploads/default.jpg'
        }
        userData.adress = this.getUserInfo.adress
        userData.registerDate = Date.now()
        const { data: res } = await this.$http.post('home/register', userData)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        console.log('添加', res.data)
        this.$message.success('添加成功')
        this.getUserList()
        this.addDialogVisible = false
      })
    },
    // 分页改变每页条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 分页改变页数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    editAvatorHandleSuccess(response) {
      if (response.meta.status !== 200) {
        return this.$message.error(response.meta.message)
      }
      this.imageUrl = response.data.url
      this.editForm.avator = response.data.tmp_path
      console.log('success', response)
    },
    // 显示编辑框dialog
    showEditDialog(scope) {
      this.editUserId = scope._id
      this.imageUrl = scope.avator
      this.editForm.email = scope.email
      this.editForm.mobile = scope.mobile
      this.editForm.username = scope.username
      this.editDialogVisible = true
      console.log('编辑', scope)
    },
    // 编辑框dialog关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.imageUrl = ''
      this.editUserId = ''
      this.editForm.avator = ''
    },
    // 编辑框dialog保存
    saveEditDialog() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return 0
        const { data: res } = await this.$http.put(`admin/modifyUser/${this.editUserId}`, this.editForm)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.message)
        }
        this.$message.success('修改成功')
        this.getUserList()
        this.editDialogVisible = false
      })
    },
    async removeUser(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => console.log(err))
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`admin/deleteUser/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      console.log('删除', res)
      this.$message.success('删除成功')
      this.getUserList()
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
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
