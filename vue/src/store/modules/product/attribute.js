import Ajax from '@/libs/ajax';

const attribute = {
    namespaced: true,
    state: {
        totalCount: 0,
        currentPage: 1,
        pageSize: 10,
        list: [],
        loading: false,
        editAttributeId: 0,
        attributeTypes: []
    },
    mutations: {
        setCurrentPage(state, page) {
            state.currentPage = page;
        },
        setPageSize(state, pageSize) {
            state.pageSize = pageSize;
        },
        edit(state, id) {
            state.editAttributeId = id;
        }
    },
    actions: {
        async getAll(context, payload) {
            context.state.loading = true;
            if(context.state.attributeTypes.length <= 0) {
                await context.dispatch('getAllAttributeTypes');
            }
            let response = await Ajax.get('/api/services/app/CategoryAttribute/GetAll', {params: payload.data});
            context.state.loading = false;
            let page = response.data.result;
            context.state.totalCount = page.totalCount;
            context.state.list = page.items;
        },
        async getAllAttributeTypes(context) {
            let response = await Ajax.get('/api/services/app/CategoryAttribute/GetAllAttributeTypes');
            context.state.attributeTypes = response.data.result.items;
        },
        async get(context, payload) {
            return await Ajax.get('/api/services/app/CategoryAttribute/Get?Id=' + payload.id);
        },
        async getAttributeForEdit(context, payload) {
            return await Ajax.get('/api/services/app/CategoryAttribute/GetAttributeForEdit?Id=' + payload.id);
        },
        async create(context, payload) {
            return await Ajax.post('/api/services/app/CategoryAttribute/Create', payload.data);
        },
        async update(context, payload) {
            return await Ajax.put('/api/services/app/CategoryAttribute/Update', payload.data);
        },
        async delete(context, payload) {
            return await Ajax.delete('/api/services/app/CategoryAttribute/Delete?Id=' + payload.data.id);
        },
        async getAttrData(context, payload) {
            let response = await Ajax.get('/api/services/app/CategoryAttribute/GetAttr?Id=' + payload.data);
            return response.data.result.items;
        }
    }
}

export default attribute;