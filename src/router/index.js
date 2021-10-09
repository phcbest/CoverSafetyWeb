import Vue from 'vue'
import VueRouter from 'vue-router'
import paterLayout from '@/views/layout/pater-layout'
import logMain from '@/views/log/log-main'
import homeMain from '@/views/home/home-main'
import warnMain from '@/views/warn/warn-main'

Vue.use(VueRouter)

export const routes = [
    {
        path: "",
        hidden: false,
        component: paterLayout,
        redirect: "/home",
        name: "父布局",
        children: [
            {
                hidden: false,
                path: "/home",
                name: "主页",
                icon:"mdi-home",
                component: homeMain
            }, {
                hidden: false,
                path: "/log",
                name: "日志",
                icon:"mdi-math-log",
                component: logMain
            }, {
                hidden: false,
                path: "/warn",
                name: "警告",
                icon:"mdi-account-alert",
                component: warnMain
            }]


    }
]

const router = new VueRouter({
    routes
})

export default router
