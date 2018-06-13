import Ajax from '@/libs/ajax';

const common = {
    namespaced: true,
    state: {
        //
    },
    mutations: {
        //
    },
    actions: {
        async changePassword(context, payload) {
            return await Ajax.post('/api/services/app/Common/ChangePassword', payload.data);
        },
        async updateUserInfo(context, payload) {
            return await Ajax.put('/api/services/app/Common/UpdateUserInfo', payload.data);
        }
    }
};

export default common;
