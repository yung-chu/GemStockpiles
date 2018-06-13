import jQuery from 'jquery';

let util = {

};

util.abp = window.abp;

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    return item.meta.title;
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'main') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'main') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home') {
        currentPathArr = [
            {
                meta: { title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home')), icon: 'ios-home' },
                path: '/main/home',
                name: 'home'
            }
        ];
    } else if ((name.indexOf('index') >= 0 || isOtherRouter) && name !== 'home') {
        currentPathArr = [
            {
                meta: { title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home')), icon: 'ios-home' },
                path: '/main/home',
                name: 'home'
            },
            {
                meta: { title: title },
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    meta: { title: '首页', icon: 'ios-home' },
                    path: '/main/home',
                    name: 'home'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    meta: { title: '首页', icon: 'ios-home' },
                    path: '/main/home',
                    name: 'home'
                },
                {
                    meta: { title: currentPathObj.meta.title },
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [
                {
                    meta: { title: '首页', icon: 'ios-home' },
                    path: '/main/home',
                    name: 'home'
                },
                {
                    meta: { title: currentPathObj.meta.title },
                    path: '',
                    name: currentPathObj.name
                },
                {
                    meta: { title: childObj.meta.title },
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }
    vm.$store.commit('app/setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('app/pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('app/increateTag', tag);
        }
    }
    vm.$store.commit('app/setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.extend = function(...args) {
    let options, name, src, srcType, copy, copyType, copyIsArray, clone,
    target = args[0] || {},
    i = 1,
    length = args.length,
    deep = false;
    if (typeof target === 'boolean') {
        deep = target;
        target = args[i] || {};
        i++;
    }
    if (typeof target !== 'object' && typeof target !== 'function') {
        target = {};
    }
    if (i === length) {
        target = this;
        i--;
    }
    for (; i < length; i++) {
        if ((options = args[i]) !== null) {
            for (name in options) {
                src = target[name];
                copy = options[name];
                if (target === copy) {
                    continue;
                }
                srcType = Array.isArray(src) ? 'array': typeof src;
                if (deep && copy && ((copyIsArray = Array.isArray(copy)) || typeof copy === 'object')) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && srcType === 'array' ? src : [];
                    } else {
                        clone = src && srcType === 'object' ? src: {};
                    }
                    target[name] = this.extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
}

// 重置权限树
util.resetPermissionTree = function(permissions) {
    let resData = [];

    permissions.forEach((item) => {
        let children;
        if(item.children && item.children.length > 0) {
            children = this.resetPermissionTree(item.children); 
        }
        let model = {
            title: item.title,
            name: item.name,
            level: item.level,
            checked: false,
            expand: item.level > 2 ? false : true,
            children: (children == undefined || children == null || children.Count <= 0 ? null : children)
        };
        
        resData.push(model);
    });

    return resData;
}

// 编辑默认选中
util.checkedPermissionTree = function(permissions, checkedNodes) {
    let resData = [];

    permissions.forEach((item) => {
        let children, checkState;
        if(item.children && item.children.length > 0) {
            children = this.checkedPermissionTree(item.children, checkedNodes); 
        }
        // 最末级别判断
        if(children == undefined || children == null || children.Count <= 0) {
            if(jQuery.inArray(item.name, checkedNodes) >= 0) {
                checkState = true
            }
            else {
                checkState = false;
            }    
        }
        else {
            checkState = false;
        }

        let model = {
            title: item.title,
            name: item.name,
            level: item.level,
            checked: checkState,
            expand: item.level > 2 ? false : true,
            children: (children == undefined || children == null || children.Count <= 0 ? null : children)
        };
        
        resData.push(model);
    });

    return resData;
}

// 删除children空节点
util.removeNullChildrenNode = function(JsonObj) {
    JsonObj.forEach((item) => {
        if(!item.children) {
            delete item['children'];
        }
        else {
            this.removeNullChildrenNode(item.children); 
        }
    });

    return JsonObj;
}

export default util;
