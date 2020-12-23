<template>
    <div class="all">
        <div class="container">
            <h2>黄鑫家政系统后台登录页面</h2>
            <el-form :model="loginForm" :rules="loginFormRule" ref="loginFormRef" label-width="100px" class="mr-15">
                <el-form-item label="登录邮箱" prop="email">
                    <el-input v-model="loginForm.email" placeholder="请输入登录邮箱"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="请输入登录密码"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="warning" @click="resetInfo">重置信息</el-button>
                    <el-button type="primary" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱规则
    const checkEmail = (rules, value, callback) => {
      const regEmail = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.]+([.][0-9a-zA-Z]+){1,2}$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入符合规则的邮箱'))
    }
    return {
      loginForm: {
        email: '990695619@qq.com',
        password: '123456'
      },
      loginFormRule: {
        email: [
          { required: true, message: '请输入登录邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetInfo() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return 0
        const { data: res } = await this.$http.post('admin/login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.message)
        }
        this.$message.success(res.meta.message)
        // 将token 保存到sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/admin/index')
        console.log(res)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.all {
    width: 100%;
    height: 100%;
    background-color: #04141B;
}
.container {
  width: 500px;
  height: 300px;
  background-color: #eee;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  h2 {
      text-align: center;
      margin-bottom: 40px;
  }
  .btns {
      display: flex;
      justify-content: flex-end;
  }
}
</style>
