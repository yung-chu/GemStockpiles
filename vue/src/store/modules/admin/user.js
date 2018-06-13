import Ajax from '@/libs/ajax';

const user = {
    namespaced: true,
    state: {
        totalCount: 0,
        currentPage: 1,
        pageSize: 10,
        list: [],
        loading: false,
        editUserId: 0,
        roles: []
    },
    mutations: {
        setCurrentPage(state, page) {
            state.currentPage = page;
        },
        setPageSize(state, pageSize) {
            state.pageSize = pageSize;
        },
        edit(state, id) {
            state.editUserId = id;
        }
    },
    actions: {
        async getAll(context, payload) {
            context.state.loading = true;
            let response = await Ajax.get('/api/services/app/User/GetAll', {params: payload.data});
            context.state.loading = false;
            let page = response.data.result;
            context.state.totalCount = page.totalCount;
            context.state.list = page.items;
        },
        async getRoles(context) {
            let response = await Ajax.get('/api/services/app/User/GetRoles');
            context.state.roles = response.data.result.items;
        },
        async get(context, payload) {
            return await Ajax.get('/api/services/app/User/Get?Id=' + payload.id);
        },
        async create(context, payload) {
            return await Ajax.post('/api/services/app/User/Create', payload.data);
        },
        async update(context, payload) {
            return await Ajax.put('/api/services/app/User/Update', payload.data);
        },
        async delete(context, payload) {
            return await Ajax.delete('/api/services/app/User/Delete?Id=' + payload.data.id);
        },
        async changeLanguage(context, payload) {
            return await Ajax.post('/api/services/app/User/ChangeLanguage', payload.data);
        }
    }
};

export default user;
