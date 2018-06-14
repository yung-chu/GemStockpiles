import Ajax from '@/libs/ajax';

const attributeItem = {
    namespaced: true,
    state: {
        list: [],
        loading: false,
        currentAttributeId: 0,
        editAttributeItemId: 0
    },
    mutations: {
        edit(state, id) {
            state.editAttributeItemId = id;
        },
        clearList(state) {
            state.list = [];
        }
    },
    actions: {
        async get(context, payload) {
            return await Ajax.get('/api/services/app/CategoryAttributeItem/Get?Id=' + payload.id);
        },
        async create(context, payload) {
            return await Ajax.post('/api/services/app/CategoryAttributeItem/Create', payload.data);
        },
        async update(context, payload) {
            return await Ajax.put('/api/services/app/CategoryAttributeItem/Update', payload.data);
        },
        async delete(context, payload) {
            return await Ajax.delete('/api/services/app/CategoryAttributeItem/Delete?Id=' + payload.data.id);
        },
        async getCategoryAttributeItems(context, payload) {
            //记录当前查询的属性ID
            context.state.currentAttributeId = payload.data.id;
            
            context.state.loading = true;
            let response = await Ajax.get('/api/services/app/CategoryAttributeItem/GetCategoryAttributeItems?AttributeId=' + payload.data.id);
            context.state.loading = false;
            context.state.list = response.data.result.items;
        }
    }
}

export default attributeItem;