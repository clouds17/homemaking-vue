import Vue from 'vue'
import {
  Button,
  Dialog,
  Form,
  FormItem,
  Input,
  Upload,
  Message,
  Menu,
  MenuItem,
  Submenu,
  Row,
  Col,
  Container,
  Header,
  Aside,
  Main,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Table,
  TableColumn,
  Pagination,
  MessageBox,
  Tooltip,
  Switch,
  Select,
  Option
} from 'element-ui'

Vue.use(Button)
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Row)
Vue.use(Col)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Input)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)

// 将它挂载到原型上，就可以用this.$message调用
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
