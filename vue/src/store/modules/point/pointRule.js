import Ajax from '@/libs/ajax';

const pointRule = {
    namespaced: true,
    state: {
        totalCount: 0,
        currentPage: 1,
        pageSize: 10,
        list: [],
        loading: false,
        editRuleId: 0,
        pointActions: []
    },
    mutations: {
        setCurrentPage(state, page) {
            state.currentPage = page;
        },
        setPageSize(state, pageSize) {
            state.pageSize = pageSize;
        },
        edit(state, id) {
            state.editRuleId = id;
        }
    },
    actions: {
        async getAll(context, payload) {
            context.state.loading = true;
            // 初始化积分动作列表
            if(context.state.pointActions.length <= 0) {
                await context.dispatch('getAllPointActions');
            }
            let response = await Ajax.get('/api/services/app/PointRule/GetAll', {params: payload.data});
            context.state.loading = false;
            let page = response.data.result;
            context.state.totalCount = page.totalCount;
            context.state.list = page.items;
        },
        async getAllPointActions(context) {
            let response = await Ajax.get('/api/services/app/PointRule/GetAllPointActions');
            context.state.pointActions = response.data.result.items;
        },
        async get(context, payload) {
            return await Ajax.get('/api/services/app/PointRule/Get?Id=' + payload.id);
        },
        async create(context, payload) {
            return await Ajax.post('/api/services/app/PointRule/Create', payload.data);
        },
        async update(context, payload) {
            return await Ajax.put('/api/services/app/PointRule/Update', payload.data);
        },
        async delete(context, payload) {
            return await Ajax.delete('/api/services/app/PointRule/Delete?Id=' + payload.data.id);
        }
    }
};

export default pointRule;
