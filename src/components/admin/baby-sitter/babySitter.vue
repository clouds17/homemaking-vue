<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/admin/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>保姆管理</el-breadcrumb-item>
            <el-breadcrumb-item>保姆详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getBabySitterList">
                        <el-button slot="append" icon="el-icon-search" @click="getBabySitterList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="5">
                    <el-button type="primary" @click="addDialogVisible=true">添加保姆</el-button>
                </el-col>
            </el-row>
            <hr class="hrs" >
            <!-- 保姆信息列表 -->
            <el-table
                :data="babySitterList"
                style="width: 100%"
                border
                stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column
                    prop="username"
                    label="用户名"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="email"
                    label="邮箱">
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号">
                </el-table-column>
                <el-table-column label="角色" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.role === 1">住家保姆</span>
                        <span v-else-if="scope.row.role === 2">月嫂</span>
                        <span v-else-if="scope.row.role === 3">临时工</span>
                        <span v-else-if="scope.row.role === 4">护工</span>
                        <span v-else>育儿嫂</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="70">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.state === 1">空闲</el-tag>
                        <el-tag type="info" v-else-if="scope.row.state === 2">忙碌</el-tag>
                        <el-tag type="warning" v-else>休息</el-tag>
                    </template>
                </el-table-column>
                <el-table-column width="80" label="价格(天)" prop="price"></el-table-column>
                <el-table-column label="入职时间" >
                    <template slot-scope="scope">
                        <span>{{scope.row.entryTime | dateFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row._id)"></el-button>
                        <el-tooltip class="item" effect="dark" content="添加文章" placement="top">
                            <el-button :disabled="scope.row.isArticle" type="warning" @click="showAddArticle(scope.row)" icon="el-icon-notebook-1" size="mini"></el-button>
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

        <!-- 添加保姆的dialog -->
        <el-dialog
            title="添加保姆"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRule" ref="addFormRef" label-width="100px" >
                <el-form-item label="保姆照片" prop="avator">
                    <el-upload
                        class="avatar-uploader"
                        :action=avatorURL
                        :show-file-list="false"
                        :on-success="addHandleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="保姆名称" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="保姆年龄" prop="age">
                    <el-input v-model="addForm.age" type="number"></el-input>
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
                <el-form-item label="价格" prop="price">
                    <el-input v-model="addForm.price"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select v-model="addForm.role" placeholder="请选择保姆角色">
                        <el-option label="住家保姆" value="1"></el-option>
                        <el-option label="月嫂" value="2"></el-option>
                        <el-option label="临时工" value="3"></el-option>
                        <el-option label="护工" value="4"></el-option>
                        <el-option label="育儿嫂" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="addForm.state" disabled placeholder="请选择保姆状态">
                        <el-option label="空闲" value="1"></el-option>
                        <el-option label="忙碌" value="2"></el-option>
                        <el-option label="休息" value="3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAddDialog">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑保姆的dialog -->
        <el-dialog
            title="编辑保姆信息"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed">
            <el-form :model="editForm" :rules="addFormRule" ref="editFormRef" label-width="100px" >
                <el-form-item label="保姆照片" prop="avator">
                    <el-upload
                        class="avatar-uploader"
                        :action=avatorURL
                        :show-file-list="false"
                        :on-success="editHandleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="保姆名称" prop="username">
                    <el-input v-model="editForm.username"></el-input>
                </el-form-item>
                <el-form-item label="保姆年龄" prop="age">
                    <el-input v-model="editForm.age" type="number"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="editForm.price"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select v-model="editForm.role" placeholder="请选择保姆角色">
                        <el-option label="住家保姆" value="1"></el-option>
                        <el-option label="月嫂" value="2"></el-option>
                        <el-option label="临时工" value="3"></el-option>
                        <el-option label="护工" value="4"></el-option>
                        <el-option label="育儿嫂" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="editForm.state" placeholder="请选择保姆状态">
                        <el-option label="空闲" value="1"></el-option>
                        <el-option label="忙碌" value="2"></el-option>
                        <el-option label="休息" value="3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditDialog">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加文章的dialog -->
        <el-dialog
            title="添加文章"
            :visible.sync="ArticledialogVisible"
            width="50%"
            @close="articleDialogClosed">
            <el-form :model="articleForm" :rules="articleFormRule" ref="articleFormRef" label-width="100px" >
                <el-form-item label="标题" prop="title">
                    <el-input v-model="articleForm.title"></el-input>
                </el-form-item>
                <el-form-item label="保姆id">
                    <el-input v-model="articleForm.bid" disabled></el-input>
                </el-form-item>
                <el-form-item label="工作技能">
                    <el-input v-model="articleForm.workingSkill" placeholder="请空一个字符为间隔"></el-input>
                </el-form-item>
                <el-form-item label="语言技能">
                    <el-input v-model="articleForm.languageSkill" placeholder="请空一个字符为间隔"></el-input>
                </el-form-item>
                <el-form-item label="证书">
                    <el-input v-model="articleForm.certificate" placeholder="请空一个字符为间隔"></el-input>
                </el-form-item>
                <el-form-item label="banner轮播图">
                    <el-upload
                        class="upload-demo"
                        ref="articleUploadRef"
                        :action="avatorURL"
                        :on-preview="articleHandlePreview"
                        :on-remove="articleHandleRemove"
                        :on-success="articleHandleSuccess"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="内容">
                    <quill-editor v-model="articleForm.content" ></quill-editor>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ArticledialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveArticledialog">确 定</el-button>
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
    const checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'))
      }
      setTimeout(() => {
        if (value < 25) {
          callback(new Error('年龄必须大于25岁'))
        } else if (value > 50) {
          callback(new Error('年龄必须小于50岁'))
        } else {
          callback()
        }
      }, 500)
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      babySitterList: [],
      total: 0,
      addDialogVisible: false,
      avatorURL: 'http://localhost:3000/upload/',
      imageUrl: '',
      addForm: {
        username: '',
        email: '',
        password: '',
        mobile: '',
        role: '',
        state: '1',
        price: '',
        age: '',
        avator: ''
      },
      addFormRule: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: ['blur', 'change'] }
        ],
        role: [
          { required: true, message: '请选择保姆角色', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        age: [
          { validator: checkAge, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      // 编辑的dialog
      editDialogVisible: false,
      editForm: {
        username: '',
        age: '',
        email: '',
        mobile: '',
        price: '',
        role: '',
        state: '',
        avator: ''
      },
      editUserId: '',
      // 添加文章
      ArticledialogVisible: false,
      articleForm: {
        title: '',
        bid: '',
        pics: [],
        content: '',
        workingSkill: '',
        languageSkill: '',
        certificate: ''
      },
      articleFormRule: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getBabySitterList()
  },
  methods: {
    // 获取所有保姆的信息
    async getBabySitterList() {
      const { data: res } = await this.$http.get(`admin/allBabySitter/${this.getUserInfo.adress}`, {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.message)
      }
      this.babySitterList = res.data
      this.total = res.total
      console.log('babyList', res)
    },
    // 关闭添加保姆dialog
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.imageUrl = ''
      this.addForm.avator = ''
    },
    // 保存添加保姆的dialog
    async saveAddDialog() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return 0
        const babyData = this.addForm
        if (babyData.avator === '') {
          babyData.avator = 'uploads/default.jpg'
        }
        babyData.entryTime = Date.now()
        babyData.adress = this.getUserInfo.adress
        const { data: res } = await this.$http.post('admin/addBabySitter', babyData)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.message)
        }
        this.$message.success('添加成功')
        this.getBabySitterList()
        this.addDialogVisible = false
        console.log(res)
      })
    },
    // 头像添加成功
    addHandleAvatarSuccess(response) {
      if (response.meta.status !== 200) {
        return this.$message.error(response.meta.message)
      }
      this.imageUrl = response.data.url
      this.addForm.avator = response.data.tmp_path
      console.log('success', response)
    },
    // 头像添加之前
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
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getBabySitterList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getBabySitterList()
    },
    editHandleAvatarSuccess(response) {
      if (response.meta.status !== 200) {
        return this.$message.error(response.meta.message)
      }
      this.imageUrl = response.data.url
      this.editForm.avator = response.data.tmp_path
      console.log('success', response)
    },
    showEditDialog(scope) {
      this.editUserId = scope._id
      this.editForm.username = scope.username
      this.editForm.age = scope.age
      this.editForm.email = scope.email
      this.editForm.mobile = scope.mobile
      this.editForm.price = scope.price
      this.editForm.role = scope.role
      this.editForm.state = scope.state
      this.imageUrl = scope.avator
      this.editDialogVisible = true
      console.log(this.editForm)
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.imageUrl = ''
      this.editForm.avator = ''
    },
    async saveEditDialog() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return 0
        const { data: res } = await this.$http.put(`admin/modifyBabySitter/${this.editUserId}`, this.editForm)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.message)
        }
        this.$message.success('修改成功')
        this.getBabySitterList()
        this.editDialogVisible = false
      })
    },
    async removeById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => console.log(err))
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`admin/deleteBabySitter/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getBabySitterList()
    },
    // 添加文章
    showAddArticle(scope) {
      this.articleForm.bid = scope._id
      this.ArticledialogVisible = true
    },

    articleHandlePreview(file) {
      console.log('previewAr', file)
    },
    articleHandleRemove(file, fileList) {
      const url = file.response.data.tmp_path
      const index = this.articleForm.pics.findIndex(item => {
        return item === url
      })
      this.articleForm.pics.splice(index, 1)
      console.log('removeAr', file, fileList)
    },
    articleHandleSuccess(response) {
      if (response.meta.status !== 200) {
        return this.$message.error('上传失败')
      }
      this.articleForm.pics.push(response.data.tmp_path)
      console.log('successAr', response)
    },
    articleDialogClosed() {
      this.$refs.articleFormRef.resetFields()
      this.articleForm.content = ''
      this.$refs.articleUploadRef.clearFiles()
      this.articleForm.pics = []
    },
    saveArticledialog() {
      this.$refs.articleFormRef.validate(async valid => {
        if (!valid) return 0
        this.articleForm.pics = this.articleForm.pics.join(',')
        const { data: res } = await this.$http.post(`admin/addIntroduce/${this.getUserInfo.adress}`, this.articleForm)
        if (res.meta.status !== 200) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.ArticledialogVisible = false
        this.getBabySitterList()
        console.log('save', res.data)
      })
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
