import Ajax from '@/libs/ajax';
import Util from '@/libs/util.js';

const category={
    namespaced: true,
    state: {
        totalCount: 0,
        currentPage: 1,
        pageSize: 10,
        list: [],
        loading: false,
        editUser: null,
        categoryTree:[],
        cascaderCategory:[],
        selectAttrList:[]
    },
    mutations: {
        setCurrentPage(state, page) {
            state.currentPage = page;
        },
        setPageSize(state, pageSize) {
            state.pageSize = pageSize;
        },
        edit(state, user) {
            state.editUser = user;
        },
        setAttrList(state, list) {
            state.selectAttrList = list;
        }
    },
    actions: {
        async getAll(context, payload) {
            context.state.loading = true;
            let response = await Ajax.get('/api/services/app/Category/GetAll', {params: payload.data});
            context.state.loading = false;
            let page = response.data.result;
            context.state.totalCount = page.totalCount;
            context.state.list = page.items;
        },
        async get(context, payload) {
            let response = await Ajax.get('/api/services/app/Category/Get?Id=' + payload.id);
            return response.data.result;
        },
        async getCategory(context, payload) {
            let response = await Ajax.get('/api/services/app/Category/GetParent');
            return response.data.result;
        },
        async getTreeCategory(context) {
            let response = await Ajax.get('/api/services/app/Category/GetTreeCategory');
            context.state.categoryTree = response.data.result.items;
        },
        async getCascaderCategory(context) {
            let response = await Ajax.get('/api/services/app/Category/GetCascaderCategory');
            // 删除空children节点
            context.state.cascaderCategory = Util.removeNullChildrenNode(response.data.result.items);
        },
        async create(context, payload) {
            return await Ajax.post('/api/services/app/Category/Create', payload.data);
        },
        async update(context, payload) {
            return await Ajax.put('/api/services/app/Category/Update', payload.data);
        },
        async delete(context, payload) {
            return await Ajax.delete('/api/services/app/Category/Delete?Id=' + payload.data.id);
        }
    }
}

export default category;