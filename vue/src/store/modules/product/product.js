import Ajax from '@/libs/ajax';

const product={
    namespaced: true,
    state: {
        totalCount: 0,
        currentPage: 1,
        pageSize: 10,
        list: [],
        loading: false,
        editUser: null,
        roles: []
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
        }
    },
    actions: {
        async getAll(context, payload) {
            context.state.loading = true;
            let response = await Ajax.get('/api/services/app/Product/GetAll', {params: payload.data});
            context.state.loading = false;
            let page = response.data.result;
            context.state.totalCount = page.totalCount;
            context.state.list = page.items;
        },
        async get(context, payload) {
            let response = await Ajax.get('/api/services/app/Product/Get?Id=' + payload.id);
            return response.data.result;
        },
        async create(context, payload) {
            return await Ajax.post('/api/services/app/Product/Create', payload.data);
        },
        async update(context, payload) {
            return await Ajax.put('/api/services/app/Product/Update', payload.data);
        },
        async delete(context, payload) {
            return await Ajax.delete('/api/services/app/Product/Delete?Id=' + payload.data.id);
        }
    }
}

export default product;