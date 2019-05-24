import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/payDemo', component: () => import('@/views/login/payDemo'), hidden: true },
  {
    path: '/goods',
    component: Layout,
    name: 'goods',
    redirect: '/goods/index/goodsList',
    children: [
      {
        path: 'index',
        redirect: '/goods/index/goodsList',
        name: 'goodsIndex',
        meta: {title: '商品和品牌', icon: 'icon-NV-goods', belong: 'goods/index'},
        component: () => import('@/views/goods/index'),
        children: [
          {
            path: 'goodsList',
            name: 'goodsList',
            component: () => import('@/views/goods/goods/index'),
            meta: {belong: 'goods/index'}
          },
          {
            path: 'brandList',
            name: 'brandList',
            component: () => import('@/views/goods/brand/index'),
            meta: {belong: 'goods/index'}
          }
        ]
      }
    ]
  },
  {
    path: '/goodsDetail',
    name: 'goodsDetail',
    hidden: true,
    component: Layout,
    children: [
      {
        path: '',
        name: 'goodsDetailIndex',
        meta: {belong: 'goods/index'},
        component: () => import('@/views/goods/goods/detail')
      }
    ]
  },
  {
    path: '/goodsEdit',
    name: 'goodsEdit',
    hidden: true,
    component: Layout,
    children: [
      {
        path: '',
        name: 'goodsEditIndex',
        meta: {belong: 'goods/index'},
        component: () => import('@/views/goods/goods/edit')
      }
    ]
  },
  {
    path: '/brandDetail',
    name: 'brandDetail',
    hidden: true,
    component: Layout,
    children: [
      {
        path: '',
        name: 'brandDetailIndex',
        meta: { belong: 'goods/index' },
        component: () => import('@/views/goods/brand/detail'),
        children: [
          {
            path: 'goodsList',
            name: 'goodsList',
            component: () => import('@/views/goods/goods/index'),
            meta: { belong: 'goods/index' }
          }
        ]
      }
    ]
  },
  {
    path: '/userDetail',
    name: 'userDetail',
    hidden: true,
    component: Layout,
    children: [
      {
        path: '',
        name: 'userDetailIndex',
        meta: {belong: 'user/index'},
        component: () => import('@/views/user/customer/detail')
      }
    ]
  },
  {
    path: '/activity',
    redirect: '/activity/index',
    component: Layout,
    name: 'activity',
    children: [
      {
        path: 'index',
        name: 'activityIndex',
        meta: { title: '活动管理', icon: 'icon-NV-activity', belong: 'activity/index' },
        component: () => import('@/views/activity/index')
      },
      {
        path: 'edit',
        name: 'activityEdit',
        meta: { title: '新建活动', icon: 'example', belong: 'activity/index' },
        component: () => import('@/views/activity/edit')
      },
      {
        path: 'detail',
        name: 'activityDetail',
        meta: { title: '活动详情', icon: 'example', belong: 'activity/index' },
        component: () => import('@/views/activity/detail')
      }
    ]
  },
  {
    path: '/order',
    redirect: '/order/index',
    component: Layout,
    name: 'order',
    children: [
      {
        path: 'index',
        name: 'orderIndex',
        redirect: '/order/index/salesList',
        meta: { title: '订单管理', icon: 'icon-NV-order', belong: 'order/index' },
        component: () => import('@/views/order/index'),
        children: [
          {
            path: 'salesList',
            name: 'salesList',
            component: () => import('@/views/order/sales/index'),
            meta: { belong: 'order/index' }
          },
          {
            path: 'afterSalesList',
            name: 'afterSalesList',
            component: () => import('@/views/order/afterSales/index'),
            meta: { belong: 'order/index' }
          }
        ]
      },
      {
        path: '/afterSalesDetail',
        name: 'afterSalesDetail',
        meta: { belong: 'order/index' },
        hidden: true,
        component: () => import('@/views/order/afterSales/detail')
      },
      {
        path: '/salesDetail',
        name: 'salesDetail',
        meta: { belong: 'order/index' },
        hidden: true,
        component: () => import('@/views/order/sales/detail')
      },
    ]
  },
  {
    path: '/market',
    redirect: '/market/index',
    component: Layout,
    name: 'market',
    children: [
      {
        path: 'index',
        name: 'marketIndex',
        meta: { title: '营销管理', icon: 'icon-NV-sale', belong: 'market/index' },
        component: () => import('@/views/market/index')
      },
      {
        path: 'edit',
        name: 'marketEdit',
        meta: { title: '新建营销消息', icon: 'example', belong: 'market/index' },
        component: () => import('@/views/market/edit')
      },
      {
        path: 'detail',
        name: 'marketDetail',
        meta: { title: '营销消息详情', icon: 'example', belong: 'market/index' },
        component: () => import('@/views/market/detail')
      }
    ]
  },
  {
    path: '/user',
    redirect: '/user/index/customer',
    component: Layout,
    name: 'user',
    children: [
      {
        path: 'index',
        name: 'userIndex',
        redirect: '/user/index/customer',
        meta: {title: '用户管理', icon: 'icon-NV-user', belong: 'user/index'},
        component: () => import('@/views/user/index'),
        children: [
          {
            path: 'customer',
            name: 'customer',
            component: () => import('@/views/user/customer/index'),
            meta: {belong: 'user/index'}
          },
          {
            path: 'grade',
            name: 'grade',
            component: () => import('@/views/user/grade/index'),
            meta: {belong: 'user/index'}
          },
          {
            path: 'inviteCode',
            name: 'inviteCode',
            component: () => import('@/views/user/inviteCode/index'),
            meta: {belong: 'user/index'}
          }
        ]
      }
    ]
  },
  {
    path: '/pay',
    redirect: '/pay/index',
    component: Layout,
    name: 'pay',
    children: [
      {
        path: 'index',
        name: 'payIndex',
        meta: { title: '支付流水', icon: 'icon-NV-bill', belong: 'pay/index' },
        component: () => import('@/views/pay/index')
      }
    ]
  },
  {
    path: '/business',
    redirect: '/business/index',
    component: Layout,
    name: 'business',
    children: [
      {
        path: 'index',
        name: 'businessIndex',
        meta: { title: '业务报表', icon: 'icon-NV-report', belong: 'business/index' },
        component: () => import('@/views/business/index')
      }
    ]
  },
  {
    path: '/businessDetail',
    name: 'businessDetail',
    hidden: true,
    component: Layout,
    children: [
      {
        path: '',
        name: 'businessDetail',
        meta: {belong: 'business/index'},
        component: () => import('@/views/business/detail')
      }
    ]
  },
  {
    path: '/setting',
    redirect: '/setting/adminAccount',
    component: Layout,
    name: 'setting',
    children: [
      {
        path: 'index',
        name: 'settingIndex',
        redirect: '/setting/index/adminAccount',
        meta: { title: '基础设置', icon: 'icon-NV-setting', belong: 'setting/index' },
        component: () => import('@/views/setting/index'),
        children: [
          {
            path: 'adminAccount',
            name: 'adminAccountIndex',
            component: () => import('@/views/setting/adminAccount/index'),
            meta: { belong: 'setting/index' }
          },
          {
            path: 'freightTemplate',
            name: 'freightTemplateIndex',
            component: () => import('@/views/setting/freightTemplate/index'),
            meta: { belong: 'setting/index' }
          },
          {
            path: 'returnAddress',
            name: 'returnAddressIndex',
            component: () => import('@/views/setting/returnAddress/index'),
            meta: { belong: 'setting/index' }
          },
          {
            path: 'userGuide',
            name: 'userGuideIndex',
            component: () => import('@/views/setting/userGuide/index'),
            meta: { belong: 'setting/index' }
          }
        ]
      }
    ]
  }
  // { path: '/404', component: () => import('@/views/404'), hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree', roles: ['admin'] }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]
