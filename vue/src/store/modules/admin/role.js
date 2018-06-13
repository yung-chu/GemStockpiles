import Ajax from '@/libs/ajax';

const role = {
    namespaced: true,
    state: {
        totalCount: 0,
        currentPage: 1,
        pageSize: 10,
        list: [],
        loading: false,
        editRoleId: 0,
        permissions: []
    },
    mutations: {
        setCurrentPage(state, page) {
            state.currentPage = page;
        },
        setPageSize(state, pageSize) {
            state.pageSize = pageSize;
        },
        edit(state, id) {
            state.editRoleId = id;
        },
        setPermissions(state, permissions) {
            state.permissions = permissions;
        }
    },
    actions: {
        async getAll(context, payload) {
            context.state.loading = true;
            let response = await Ajax.get('/api/services/app/Role/GetAll', {params: payload.data});
            context.state.loading = false;
            let page = response.data.result;
            context.state.totalCount = page.totalCount;
            context.state.list = page.items;
        },
        async getTreePermissions(context) {
            let response = await Ajax.get('/api/services/app/Role/GetTreePermissions');
            context.state.permissions = response.data.result.items;
        },
        async get(context, payload) {
            return await Ajax.get('/api/services/app/Role/Get?Id=' + payload.id);
        },
        async getRoleForEdit(context, payload) {
            return await Ajax.get('/api/services/app/Role/GetRoleForEdit?Id=' + payload.id);
        },
        async create(context, payload) {
            return await Ajax.post('/api/services/app/Role/Create', payload.data);
        },
        async update(context, payload) {
            return await Ajax.put('/api/services/app/Role/Update', payload.data);
        },
        async delete(context, payload) {
            return await Ajax.delete('/api/services/app/Role/Delete?Id=' + payload.data.id);
        }
    }
};

export default role;
