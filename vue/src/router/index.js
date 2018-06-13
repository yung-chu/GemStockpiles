import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import store from '../store/index';
import {routers,appRouter,otherRouter} from './router';
import Util from '../libs/util';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: routers
};

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    if (!Util.abp.session.userId && to.name !== 'login') {
        next({
            name: 'login'
        });
    } 
    else if (!!Util.abp.session.userId && to.name === 'login') {
        next({
            name: 'home'
        });
    } 
    else {
        const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
        if (curRouterObj && curRouterObj.permission) {
            if (window.abp.auth.hasPermission(curRouterObj.permission)) {
                Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next);
            } 
            else {
                next({
                    replace: true,
                    name: 'error-403'
                });
            }
        } 
        else {
            Util.toDefaultPage([...routers], to.name, router, next);
        }
    }
});

router.afterEach((to) => {
    Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});