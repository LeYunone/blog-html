import {createRouter, createWebHashHistory} from "vue-router";
import Home from "../views/Home.vue";
const routes = [
    {
        path: '/',
        redirect: '/login'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            }, {
                path: "/webdata",
                name: "webdata",
                meta: {
                    title: '网站数据'
                },
                component: () => import ( /* webpackChunkName: "charts" */ "../views/WebData.vue")
            }, {
                path: "/form",
                name: "baseform",
                meta: {
                    title: '表单'
                },
                component: () => import ( /* webpackChunkName: "form" */ "../views/BaseForm.vue")
            },{
                path: "/markdown",
                name: "markdown",
                meta: {
                    title: '发布博客'
                },
                component: () => import ( /* webpackChunkName: "charts" */ "../views/Markdown.vue")
            },{
                path: "/tabs",
                name: "tabs",
                meta: {
                    title: 'tab标签'
                },
                component: () => import ( /* webpackChunkName: "tabs" */ "../views/Tabs.vue")
            }, {
                path: "/donate",
                name: "donate",
                meta: {
                    title: '鼓励作者'
                },
                component: () => import ( /* webpackChunkName: "donate" */ "../views/Donate.vue")
            }, {
                path: "/permission",
                name: "permission",
                meta: {
                    title: '权限管理',
                    permission: true
                },
                component: () => import ( /* webpackChunkName: "permission" */ "../views/Permission.vue")
            }, {
                path: "/i18n",
                name: "i18n",
                meta: {
                    title: '国际化语言'
                },
                component: () => import ( /* webpackChunkName: "i18n" */ "../views/I18n.vue")
            }, {
                path: "/emoUpload",
                name: "emoUpload",
                meta: {
                    title: '表情包上传'
                },
                component: () => import ( /* webpackChunkName: "upload" */ "../views/emoUpload.vue")
            }, {
                path: "/icon",
                name: "icon",
                meta: {
                    title: '自定义图标'
                },
                component: () => import ( /* webpackChunkName: "icon" */ "../views/Icon.vue")
            }, {
                path: '/error',
                name: '404',
                meta: {
                    title: '找不到页面'
                },
                component: () => import (/* webpackChunkName: "404" */ '../views/404.vue')
            }, {
                path: '/error',
                name: '403',
                meta: {
                    title: '没有权限'
                },
                component: () => import (/* webpackChunkName: "403" */ '../views/403.vue')
            }, {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心'
                },
                component: () => import (/* webpackChunkName: "user" */ '../views/User.vue')
            }, {
                path: '/editor',
                name: 'editor',
                meta: {
                    title: '富文本编辑器'
                },
                component: () => import (/* webpackChunkName: "editor" */ '../views/Editor.vue')
            },{
                path: '/tag',
                name: 'tag',
                meta:{
                    title: '标签管理'
                },
                component : () => import("../views/TagTable.vue" )
            },{
                path: '/type',
                name: 'type',
                meta:{
                    title: '分类管理'
                },
                component : () => import("../views/TypeTable.vue")
            },{
                path: '/typeNav',
                name: 'typeNav',
                meta:{
                    title: '分类导航'
                },
                component : () => import("../views/TypeNavTable.vue")
            },{
                path: '/blogTable',
                name: 'blogTable',
                meta:{
                    title: '博客管理'
                },
                component : () => import("../views/BlogTable.vue")
            },{
                path: '/noticeTable',
                name: 'noticeTable',
                meta:{
                    title: '公告管理'
                },
                component : () => import("../views/NoticeTable.vue")
            }
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import ( /* webpackChunkName: "login" */ "../views/Login.vue")
    },{
        path: "/blogEdit",
        name: "blogEdit",
        meta: {
            title: '博客修改页面'
        },
        component: () => import ( /* webpackChunkName: "login" */ "../views/BlogEdit.vue")
    },{
        path: "/noticeEdit",
        name: "noticeEdit",
        meta: {
            title: '公告修改页面'
        },
        component: () => import ( /* webpackChunkName: "login" */ "../views/NoticeEdit.vue")
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});
export default router;