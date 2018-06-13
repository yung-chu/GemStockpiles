import Util from '@/libs/util';
import Ajax from '@/libs/ajax';

const session = {
    namespaced: true,
    state: {
        application: null,
        user: null,
        tenant: null
    },
    getters:{
        getCurrentUser: state => {
            if(!state.user) {
                state.user = JSON.parse(localStorage.currentUser)
            }
            return state.user;
        }
    },
    mutations: {
        //
    },
    actions: {
        async init(content) {
            let response = await Ajax.get('/api/services/app/Session/GetCurrentLoginInformations', {
                headers:{
                    'Abp.TenantId': Util.abp.multiTenancy.getTenantIdCookie()
                }}
            );
            content.state.application = response.data.result.application;
            content.state.user = response.data.result.user;
            content.state.tenant = response.data.result.tenant;
            //前端持久化数据
            localStorage.currentUser = JSON.stringify(response.data.result.user);
        }
    }
};

export default session;
