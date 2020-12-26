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
                    <el-input placeholder="输入保姆id查询" v-model="queryInfo.query" clearable @clear="getArticleList">
                        <el-button slot="append" icon="el-icon-search" @click="getArticleList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </el-card>
        <!-- 点击添加先显示所有保姆的信息 -->
        <el-table
            :data="articleList"
            style="width: 100%"
            border
            stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
                label="标题">
                <template slot-scope="scope">
                  <span class="line">{{scope.row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="保姆ID">
                <template slot-scope="scope">
                  <span>{{scope.row.bid._id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="保姆名"
                width="80">
                <template slot-scope="scope">
                  <span>{{scope.row.bid.username}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="内容"
                width="300">
                <template slot-scope="scope">
                  <span class="line">{{scope.row.content}}</span>
                </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="查看内容" placement="top-start">
                    <el-button type="success" size="mini" icon="el-icon-view" @click="showLookDialog(scope.row)"></el-button>
                  </el-tooltip>
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row)"></el-button>
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

        <!-- 查看内容的dialog -->
        <el-dialog
          title="查看内容"
          :visible.sync="lookDialogVisible"
          width="50%">
          <div class="lookContainer">
            <img class="fl" :src="'http://localhost:3000'+lookDialogData.bid.avator" alt="" width="180" height="200">
            <h3  v-text="lookDialogData.title" class="ml-15"></h3>
              <ul class="top_info">
                <li><span>姓名 : </span><span v-text="lookDialogData.bid.username"></span></li>
                <li><span>年龄 : </span><span v-text="lookDialogData.bid.age"></span></li>
                <li><span>工作年限 : </span><span>{{lookDialogData.bid.entryTime | dateFormat | getNianXian}}</span></li>
                <li>
                  <span>职位: </span>
                  <span v-if="lookDialogData.bid.role === 1">住家保姆</span>
                  <span v-else-if="lookDialogData.bid.role === 2">月嫂</span>
                  <span v-else-if="lookDialogData.bid.role === 3">临时工</span>
                  <span v-else-if="lookDialogData.bid.role === 4">护工</span>
                  <span v-else>育儿嫂</span>
                </li>
                <li>
                  <span>价格 : </span>
                  <span v-text="lookDialogData.bid.price + '元'"></span>
                </li>
              </ul>
            <hr>
            <p class="look_content" v-text="lookDialogData.content"></p>
            <hr>
            <br/>
            <el-row>
              <el-col :span="5">
                <el-tag>工作技能</el-tag>
              </el-col>
              <el-col :span="19" >
                <el-tag class="mr-15" type="warning" v-for="(item, index) in lookDialogData.workingSkill" :key="index">{{item}}</el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-tag>语言技能</el-tag>
              </el-col>
              <el-col :span="19" >
                <el-tag class="mr-15" type="warning" v-for="(item, index) in lookDialogData.languageSkill" :key="index">{{item}}</el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-tag>证 书 </el-tag>
              </el-col>
              <el-col :span="19" >
                <el-tag class="mr-15" type="warning" v-for="(item, index) in lookDialogData.certificate" :key="index">{{item}}</el-tag>
              </el-col>
            </el-row>
            <ul class="bottom_info mt-15">
              <li><span>邮箱 : </span><span v-text="lookDialogData.bid.email"></span></li>
              <li><span>手机号 : </span><span v-text="lookDialogData.bid.mobile"></span></li>
              <li><span>赞 : </span> <span v-text="lookDialogData.like"></span></li>
            </ul>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="lookDialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 编辑的dialog -->
        <el-dialog
          title="编辑文章"
          :visible.sync="editDialogVisible"
          width="50%"
          @close="editDialogClosed">
          <el-form :model="editForm" :rules="editFormRule" ref="editFormRef" label-width="100px" >
                <el-form-item label="标题" prop="title">
                    <el-input v-model="editForm.title"></el-input>
                </el-form-item>
                <el-form-item label="工作技能">
                    <el-input v-model="editForm.workingSkill" placeholder="请空一个字符为间隔"></el-input>
                </el-form-item>
                <el-form-item label="语言技能">
                    <el-input v-model="editForm.languageSkill" placeholder="请空一个字符为间隔"></el-input>
                </el-form-item>
                <el-form-item label="证书">
                    <el-input v-model="editForm.certificate" placeholder="请空一个字符为间隔"></el-input>
                </el-form-item>
                <el-form-item label="banner轮播图">
                    <el-upload
                        class="upload-demo"
                        ref="articleUploadRef"
                        :action="avatorURL"
                        :on-preview="articleHandlePreview"
                        :on-remove="articleHandleRemove"
                        :on-success="articleHandleSuccess"
                        :file-list="fileList"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="内容">
                    <quill-editor v-model="editForm.content" ></quill-editor>
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
    return {
      queryInfo: {
        query: '',
        pagesize: 2,
        pagenum: 1
      },
      articleList: [],
      total: 0,
      lookDialogVisible: false,
      lookDialogData: {
        bid: {
          age: 0,
          avator: '',
          email: '',
          entryTime: '',
          mobile: 0,
          price: 0,
          role: 0
        },
        content: '',
        pics: [],
        title: '',
        link: 0,
        workingSkill: [],
        languageSkill: [],
        certificate: []
      },
      // 编辑的dialog
      avatorURL: 'http://localhost:3000/upload/',
      fileList: [],
      editDialogVisible: false,
      editForm: {
        title: '',
        workingSkill: '',
        languageSkill: '',
        certificate: '',
        pics: [],
        content: ''
      },
      editFormRule: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      editIntroduceId: ''
    }
  },
  created() {
    this.getArticleList()
  },
  methods: {
    async getArticleList() {
      const { data: res } = await this.$http.get(`admin/allIntroduce/${this.getUserInfo.adress}`, {
        params: this.queryInfo
      })
      res.data.forEach(element => {
        element.pics = element.pics.split(',')
        element.workingSkill = element.workingSkill.split(' ')
        element.languageSkill = element.languageSkill.split(' ')
        element.certificate = element.certificate.split(' ')
      })
      this.articleList = res.data
      this.total = res.total
      console.log(res.data)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getArticleList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getArticleList()
    },
    showLookDialog(scope) {
      this.lookDialogVisible = true
      this.lookDialogData = scope
      console.log(this.lookDialogData)
    },
    // 删除
    async removeById(scope) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => console.log(err))
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`admin/deleteIntroduce/${scope._id}/${scope.bid._id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.message)
      }
      this.$message.success('删除成功')
      this.getArticleList()
    },
    // 关闭编辑的dialog
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.fileList = []
      this.editIntroduceId = ''
    },
    // 显示编辑的dialog
    showEditDialog(scope) {
      this.editIntroduceId = scope._id
      this.editForm.title = scope.title
      this.editForm.bid = scope.bid
      this.editForm.content = scope.content
      this.editForm.pics = scope.pics
      this.editForm.workingSkill = scope.workingSkill.join(' ')
      this.editForm.languageSkill = scope.languageSkill.join(' ')
      this.editForm.certificate = scope.certificate.join(' ')
      this.editForm.pics.forEach((item, index) => {
        this.fileList.push({
          name: 'name' + index,
          url: item
        })
      })
      this.editDialogVisible = true
      console.log('ahow', scope)
      console.log(this.fileList)
    },
    articleHandlePreview(file) {
      console.log('previewAr', file)
    },
    articleHandleRemove(file, fileList) {
      let url
      if (file.response) {
        url = file.response.data.tmp_path
      } else {
        url = file.url
      }
      const index = this.editForm.pics.findIndex(item => {
        return url.indexOf(item) !== -1
      })
      this.editForm.pics.splice(index, 1)
      console.log('removeAr', file, fileList)
    },
    articleHandleSuccess(response) {
      if (response.meta.status !== 200) {
        return this.$message.error('上传失败')
      }
      this.editForm.pics.push(response.data.tmp_path)
      console.log('successAr', response)
    },
    // 保存编辑的dialog框
    saveEditDialog() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return 0
        const picItem = []
        this.editForm.pics.forEach(item => {
          picItem.push(item.replace(/http:\/\/127.0.0.1:3000/, ''))
        })
        this.editForm.pics = picItem.join(',')
        const { data: res } = await this.$http.put(`admin/modifyIntroduce/${this.editIntroduceId}`, this.editForm)
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
        this.getArticleList()
        this.editDialogVisible = false
        console.log('modify', res.data)
      })
    }
  },
  computed: {
    getUserInfo() {
      const userInfo = window.localStorage.getItem('userInfo')
      return JSON.parse(userInfo)
    }
  },
  filters: {
    getNianXian(val) {
      const arr = val.split('-')
      const now = new Date()
      const yy = now.getFullYear()
      return yy - arr[0] + 1 + '年'
    }
  }
}
</script>

<style lang="less" scoped>
.lookContainer {
  overflow: hidden;
  img {
    margin: 0 20px 20px 0;
  }
  h3 {
    text-align: center;
    margin-top: 0;
  }
  ul {
    list-style: none;
    overflow: hidden;
    li {
      float: left;
      margin-right: 30px;
      margin-bottom: 15px;
    }
  }
  .look_content {
    text-indent: 2em;
  }
  .bottom_info {
    margin-top: 20px;
    li {
      float: right;
    }
  }
}
.el-row {
  margin: 15px 0;
}
</style>
