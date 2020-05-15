import Vue from 'vue'
import {
        Button, Form, Input, FormItem,
        Container, Header, Main, Aside,
        Menu, Submenu, MenuItem, RadioGroup,
        RadioButton, Breadcrumb, BreadcrumbItem,
        Card, Row, Col, Table, TableColumn, Switch,
        Pagination, Tooltip, Dialog, Message, MessageBox,
        Select, Option, Tag, Tree, Cascader
        } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Cascader)
// 消息提示
Vue.prototype.$message = Message
// 消息弹框
Vue.prototype.$confirm = MessageBox
