// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import iView from 'iview';
import App from './app';
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store/index';
import VueWechatTitle from 'vue-wechat-title';  
import Ajax from '@/libs/ajax';
import Util from '@/libs/util';
import appConfig from '@/libs/appConfig';
import 'iview/dist/styles/iview.css';

Vue.use(iView);
Vue.use(VueWechatTitle);

// 将Ajax挂载到prototype上,在组件中可以直接使用this.$Ajax访问
Vue.prototype.$Ajax = Ajax;
// 增加全局语言国际化函数
Vue.prototype.L = function (value,source,...argus) {
    if(source) {
        return window.abp.localization.localize(value,source,argus);
    }
    else {
        return window.abp.localization.localize(value,appConfig.localization.defaultLocalizationSourceName,argus);
    }
}

Vue.config.productionTip = false;

/* eslint-disable no-new */
Ajax.get('/AbpUserConfiguration/GetAll').then(data=>{
    Util.abp = Util.extend(true, Util.abp, data.data.result);
    new Vue({
        router,
        store,
        render: h => h(App),
        mounted () {
            this.currentPageName = this.$route.name;
            this.$store.dispatch({
                type: 'session/init'
            });
            this.$store.commit('app/setOpenedList');
            this.$store.commit('app/initCachepage');
            this.$store.commit('app/updateMenulist');
        },
        created () {
            let tagsList = [];
            appRouter.map((item) => {
                if (item.children.length <= 1) {
                    tagsList.push(item.children[0]);
                } 
                else {
                    tagsList.push(...item.children);
                }
            });
            this.$store.commit('app/setTagsList', tagsList);
        }
    }).$mount('#app');
});
