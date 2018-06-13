import {otherRouter, appRouter} from '@/router/router';
import Util from '@/libs/util';
import Ajax from '@/libs/ajax';
import appConfig from '@/libs/appConfig';

const app = {
    namespaced: true,
    state: {
        cachePage: [],
        openedSubmenuArr: [], // 要展开的菜单数组
        menuTheme: 'dark', // 主题
        themeColor: '',
        pageOpenedList: [{
            meta: { title: '首页', icon: 'ios-home' },
            path: '',
            name: 'home'
        }],
        currentPageName: '',
        currentPath: [
            {
                meta: { title: '首页', icon: 'ios-home' },
                path: '',
                name: 'home'
            }
        ], // 面包屑数组
        menuList: [],
        routers: [
            otherRouter,
            ...appRouter
        ],
        tagsList: [...otherRouter.children],
        dontCache: [] // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
    },
    mutations: {
        logout(state) {
            localStorage.clear();
            sessionStorage.clear();
        },
        setTagsList (state, list) {
            state.tagsList.push(...list);
        },
        updateMenulist (state) {
            let menuList = [];
            appRouter.forEach((item, index) => {
                if (item.permission !== undefined) {
                    let childrenArr = [];
                    childrenArr = item.children.filter(child => {
                        let childany = child;
                        if (childany.permission !== undefined) {
                            if(Util.abp.auth.hasPermission(childany.permission)){
                                return child;
                            }                            
                        } else {
                            return child;
                        }
                    });
                    if(childrenArr.length>0){
                        item.children=childrenArr;
                        menuList.push(item);
                    }                   
                } else {
                    if (item.children.length === 1) {
                        menuList.push(item);
                    } else {
                        let len = menuList.push(item);
                        let childrenArr = [];
                        childrenArr = item.children.filter(child => {
                            return child;
                        });
                        let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
                        handledItem.children = childrenArr;
                        menuList.splice(len - 1, 1, handledItem);
                    }
                }
            });
            state.menuList = menuList;
        },
        changeMenuTheme (state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme (state, mainTheme) {
            state.themeColor = mainTheme;
        },
        addOpenSubmenu (state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        closePage (state, name) {
            state.cachePage.forEach((item, index) => {
                if (item === name) {
                    state.cachePage.splice(index, 1);
                }
            });
        },
        initCachepage (state) {
            if (localStorage.cachePage) {
                state.cachePage = JSON.parse(localStorage.cachePage);
            }
        },
        removeTag (state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        },
        pageOpenedList (state, get) {
            let openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
            }
            state.pageOpenedList.splice(get.index, 1, openedPage);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearAllTags (state) {
            state.pageOpenedList.splice(1);
            state.cachePage.length = 0;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearOtherTags (state, vm) {
            let currentName = vm.$route.name;
            let currentIndex = 0;
            state.pageOpenedList.forEach((item, index) => {
                if (item.name === currentName) {
                    currentIndex = index;
                }
            });
            if (currentIndex === 0) {
                state.pageOpenedList.splice(1);
            } else {
                state.pageOpenedList.splice(currentIndex + 1);
                state.pageOpenedList.splice(1, currentIndex - 1);
            }
            let newCachepage = state.cachePage.filter(item => {
                return item === currentName;
            });
            state.cachePage = newCachepage;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        setOpenedList (state) {
            state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];
        },
        setCurrentPath (state, pathArr) {
            state.currentPath = pathArr;
        },
        setCurrentPageName (state, name) {
            state.currentPageName = name;
        },
        setAvatorPath (state, path) {
            localStorage.avatorImgPath = path;
        },
        clearOpenedSubmenu (state) {
            state.openedSubmenuArr.length = 0;
        },
        increateTag (state, tagObj) {
            if (!Util.oneOf(tagObj.name, state.dontCache)) {
                state.cachePage.push(tagObj.name);
                localStorage.cachePage = JSON.stringify(state.cachePage);
            }
            state.pageOpenedList.push(tagObj);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        }
    },
    actions: {
        async login(content, payload) {
            let rep = await Ajax.post('/api/TokenAuth/Authenticate', payload.data);
            var tokenExpireDate = payload.data.rememberMe ? (new Date(new Date().getTime() + 1000 * rep.data.result.expireInSeconds)) : undefined;
            localStorage.avatorImgPath = '../../../static/images/user.jpg';
            Util.abp.auth.setToken(rep.data.result.accessToken, tokenExpireDate);
            Util.abp.utils.setCookieValue(appConfig.authorization.encrptedAuthTokenName, rep.data.result.encryptedAccessToken, tokenExpireDate, Util.abp.appPath)
        }
    }
};

export default app;
