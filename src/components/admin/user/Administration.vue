<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/admin/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>管理员</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="9">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="5">
                    <el-button type="primary" @click="addDialogVisible=true">添加管理员</el-button>
                </el-col>
            </el-row>
            <hr class="hrs">
            <el-table
                :data="adminList"
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
                <el-table-column label="角色">
                    <template slot-scope="scope">
                        <span v-if="scope.row.role == 1">经理</span>
                        <span v-else-if="scope.row.role == 2">主管</span>
                        <span v-else>组长</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.state" @change="adminChangeState(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="left-start">
                            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="right-start">
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeAdmin(scope.row._id)"></el-button>
                        </el-tooltip>
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

        <!-- 添加管理员的dialog -->
        <el-dialog
            title="添加管理员"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRule" ref="addFormRef" label-width="100px" >
                <el-form-item label="">
                    <el-upload
                        class="avatar-uploader"
                        :action="avatorURL"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
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
                <el-form-item label="职位" prop="role">
                    <el-select v-model="addForm.role" placeholder="请选择职位">
                        <el-option label="经理" value="1"></el-option>
                        <el-option label="主管" value="2"></el-option>
                        <el-option label="组长" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-switch
                        v-model="addForm.state">
                    </el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAddDialog">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑管理员的dialog -->
        <el-dialog
            title="修改管理员信息"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed">
            <el-form :model="editForm" :rules="addFormRule" ref="editFormRef" label-width="100px" >
                <el-form-item label="">
                    <el-upload
                        class="avatar-uploader"
                        :action="avatorURL"
                        :show-file-list="false"
                        :on-success="editHandleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
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
                <el-form-item label="职位" prop="role">
                    <el-select v-model="editForm.role" placeholder="请选择职位">
                        <el-option label="经理" value="1"></el-option>
                        <el-option label="主管" value="2"></el-option>
                        <el-option label="组长" value="3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditDialog">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^1[3456789]\d{9}$/
      if (regMobile.test(value)) {
        callback()
      }
      callback(new Error('请输入符合规则的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      adminList: [],
      total: 0,
      // 添加管理员的dialog
      addDialogVisible: false,
      addForm: {
        username: '',
        email: '',
        password: '',
        mobile: '',
        role: '1',
        state: 0,
        avator: '',
        adress: ''
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
      // 编辑的dialog框
      editDialogVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: '',
        role: '',
        avator: ''
      },
      editUserId: ''
    }
  },
  created() {
    this.getAdminList()
  },
  methods: {
    async getAdminList() {
      const { data: res } = await this.$http.get(`admin/allAdmins/${this.getUserInfo.adress}`, {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.message)
      }
      this.adminList = res.data
      this.total = res.total
      console.log('admin', res.data)
    },
    // 修改管理员状态
    async adminChangeState(scope) {
      const { data: res } = await this.$http.put(`admin/change/${scope._id}/state/${scope.state}`)
      if (res.meta.status !== 200) {
        scope.state = !scope.state
        return this.$message.error(res.meta.message)
      }
      this.$message.success('修改成功')
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getAdminList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getAdminList()
    },
    // 保存添加的dialog
    saveAddDialog() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return 0
        const adminData = this.addForm
        if (adminData.avator === '') {
          adminData.avator = 'uploads/default.jpg'
        }
        adminData.adress = this.getUserInfo.adress
        const { data: res } = await this.$http.post('admin/addAdmin', adminData)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.message)
        }
        this.$message.success('添加成功')
        this.getAdminList()
        this.addDialogVisible = false
        console.log('addAdmin', res.data)
      })
    },
    // 关闭添加
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.imageUrl = ''
      this.addForm.avator = ''
    },
    // 上传成功
    handleAvatarSuccess(response) {
      if (response.meta.status !== 200) {
        return this.$message.error(response.meta.message)
      }
      this.imageUrl = response.data.url
      this.addForm.avator = response.data.tmp_path
      console.log('success', response)
    },
    // 上传之前
    beforeAvatarUpload(file) {
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
    // 编辑的头像上传
    editHandleAvatarSuccess(response) {
      if (response.meta.status !== 200) {
        return this.$message.error(response.meta.message)
      }
      this.imageUrl = response.data.url
      this.editForm.avator = response.data.tmp_path
      console.log('success', response)
    },
    // 显示编辑的dialog框
    showEditDialog(scope) {
      this.editUserId = scope._id
      this.editForm.username = scope.username
      this.editForm.email = scope.email
      this.editForm.mobile = scope.mobile
      this.editForm.role = scope.role.toString()
      this.imageUrl = scope.avator
      this.editDialogVisible = true
    },
    // 关闭编辑的dialog框
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.imageUrl = ''
      this.editForm.avator = ''
      this.editUserId = ''
    },
    // 保存编辑的dialog框
    saveEditDialog() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return 0
        const { data: res } = await this.$http.put(`admin/modifyAdmin/${this.editUserId}`, this.editForm)
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
        this.getAdminList()
        this.editDialogVisible = false
      })
    },
    // 删除管理员
    async removeAdmin(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => console.log(err))
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`admin/deleteAdmin/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.message)
      }
      this.$message.success('删除成功')
      this.getAdminList()
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
