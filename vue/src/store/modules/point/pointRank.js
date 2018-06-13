import Ajax from '@/libs/ajax';

const pointRank = {
    namespaced: true,
    state: {
        totalCount: 0,
        currentPage: 1,
        pageSize: 10,
        list: [],
        loading: false,
        editRankId: 0
    },
    mutations: {
        setCurrentPage(state, page) {
            state.currentPage = page;
        },
        setPageSize(state, pageSize) {
            state.pageSize = pageSize;
        },
        edit(state, id) {
            state.editRankId = id;
        }
    },
    actions: {
        async getAll(context, payload) {
            context.state.loading = true;
            let response = await Ajax.get('/api/services/app/PointRank/GetAll', {params: payload.data});
            context.state.loading = false;
            let page = response.data.result;
            context.state.totalCount = page.totalCount;
            // 积分区间计算
            if(page.items.length > 0) {
                page.items.forEach((item, index, array) => {
                    if(array[index+1]) {
                        let maxPoint = parseInt(array[index+1].minPoint);
                        maxPoint = maxPoint - 1;
                        if(item.minPoint != maxPoint) {
                            item.range = item.minPoint + ' ~ ' + maxPoint;
                        }
                        else {
                            item.range = item.minPoint;
                        }
                    }
                    else {
                        item.range = '>= ' + item.minPoint;
                    }
                });
            }
            context.state.list = page.items;
        },
        async get(context, payload) {
            return await Ajax.get('/api/services/app/PointRank/Get?Id=' + payload.id);
        },
        async create(context, payload) {
            return await Ajax.post('/api/services/app/PointRank/Create', payload.data);
        },
        async update(context, payload) {
            return await Ajax.put('/api/services/app/PointRank/Update', payload.data);
        },
        async delete(context, payload) {
            return await Ajax.delete('/api/services/app/PointRank/Delete?Id=' + payload.data.id);
        }
    }
};

export default pointRank;
