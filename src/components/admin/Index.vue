<template>
    <div class="index">
        <el-container>
          <el-header>
            <!-- 导航栏 -->
            <el-menu
              class="nav_top"
              mode="horizontal"
              background-color="#545c64"
              text-color="#fff">
              <el-menu-item index="0">
                <img class="nav_logo" src="../../assets/logo.png" alt="" width="60px" height="57px">
              </el-menu-item>
              <el-menu-item index="1" style="fontSize: 25px">黄鑫毕设 — 家政服务系统</el-menu-item>
              <el-submenu index="2">
                <template slot="title" class="set_font">{{'欢迎您： '+userInfo.username}}</template>
                <el-menu-item index="2-1">个人信息</el-menu-item>
                <el-menu-item index="2-2">退出登录</el-menu-item>
              </el-submenu>
              <el-menu-item index="3" class="fontSize fl-right" v-if="userInfo.adress === 363000">漳州店</el-menu-item>
              <el-menu-item index="3" class="fontSize fl-right" v-else-if="userInfo.adress === 361000">厦门店</el-menu-item>
              <el-menu-item index="3" class="fontSize fl-right" v-else >福州店</el-menu-item>
            </el-menu>
          </el-header>
        </el-container>
        <el-container class="content">
          <el-aside :width="isCollapse ? '64px' : '220px'">
            <!-- 侧边栏 -->
            <el-menu
                background-color="#303440"
                text-color="#fff"
                active-text-color="#23A9F2"
                :collapse="isCollapse"
                :collapse-transition="false"
                router
                :default-active="activePath">
                <h4 class="show" @click="button_collapse" v-text="isCollapse ? '显示' : '隐藏侧边栏'"></h4>
                <div class="user_message" v-if="!isCollapse">
                  <img :src="userInfo.avator" alt="">
                </div>
                <el-submenu :index="item1.path" v-for="item1 in menuList" :key="item1.id">
                  <template slot="title">
                    <i :class="item1.icon"></i>
                    <span>{{item1.authName}}</span>
                  </template>
                  <el-menu-item @click="activePathMethod(childrenItem.path)" :index="childrenItem.path" v-for="childrenItem in item1.children" :key="childrenItem.id">
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{childrenItem.authName}}</span>
                  </el-menu-item>
                </el-submenu>
              </el-menu>
          </el-aside>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
    </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      isCollapse: false,
      menuList: [
        {
          id: '1',
          authName: '用户管理',
          path: 'user',
          icon: 'el-icon-s-custom',
          children: [
            {
              id: '1.1',
              authName: '普通用户',
              path: 'consumer',
              children: []
            },
            {
              id: '1.2',
              authName: '管理员',
              path: 'Administration',
              children: []
            }
          ]
        },
        {
          id: '2',
          authName: '保姆管理',
          path: 'baby',
          icon: 'el-icon-user',
          children: [
            {
              id: '2.1',
              authName: '保姆详情',
              path: 'babySitter',
              children: []
            }
          ]
        },
        {
          id: '3',
          authName: '订单管理',
          path: 'orderTitle',
          icon: 'el-icon-shopping-cart-1',
          children: [
            {
              id: '3.1',
              authName: '订单详情',
              path: 'order',
              children: []
            }
          ]
        },
        {
          id: '4',
          authName: '保姆介绍',
          path: 'introduce',
          icon: 'el-icon-postcard',
          children: [
            {
              id: '4.1',
              authName: '文章介绍',
              path: 'article',
              children: []
            },
            {
              id: '4.2',
              authName: '文章评论',
              path: 'comment',
              children: []
            }
          ]
        },
        {
          id: '5',
          authName: '申请管理',
          path: 'applyTitle',
          icon: 'el-icon-chat-dot-square',
          children: [
            {
              id: '5.1',
              authName: '保姆申请',
              path: 'apply',
              children: []
            }
          ]
        }
      ],
      activePath: ''
    }
  },
  created() {
    this.getUserInfo()
    this.activePath = window.sessionStorage.getItem('active')
  },
  methods: {
    async getUserInfo() {
      const { data: res } = await this.$http.get('admin/current')
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.userInfo = res.data
      window.localStorage.setItem('userInfo', JSON.stringify(res.data))
      console.log('userInfo', this.userInfo)
    },
    button_collapse() {
      this.isCollapse = !this.isCollapse
    },
    activePathMethod(path) {
      window.sessionStorage.setItem('active', path)
      this.activePath = path
    }
  }
}
</script>

<style lang="less" scoped>
.nav_logo {
  border-radius: 50%;
}
.fontSize {
  font-size: 18px;
}
.el-header {
  .el-menu {
    .el-submenu {
      float: right;
      margin: 0 10px;
    }
    .fl-right {
      float: right;
    }
  }
}
.el-container,
.el-header,
.el-aside {
  padding: 0;
}
.content {
  height: calc(100% - 60px);
  .el-aside {
    height: 100%;
    background-color: #303440;
    .el-menu {
      border: 0;
    }
  }
}
.user_message {
  background-color: #222;
  height: 140px;
  img {
    margin-top: 10px;
    height: 120px;
    width: 120px;
    border-radius: 50%;
    margin-left: 50%;
    transform: translateX(-50%);
  }
}
.show {
  text-align: center;
  margin: 0;
  background-color: #111;
  color: #fff;
  letter-spacing: 10px;
}
.show:hover {
  cursor: pointer;
}
</style>
