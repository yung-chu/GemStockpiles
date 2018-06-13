<style lang="less">
    @import '../../../assets/style/common.less';
</style>

<template>
    <div>
        <Card dis-hover>
            <div class="page-body">
                <div class="text-align-right">
                    <i-button type="primary" :disabled="!permissions.create" @click="create"><Icon type="plus"></Icon> 添加积分方案</i-button>
                </div>
                <div class="margin-top-10">
                    <Table :loading="loading" :columns="columns" border :data="list"></Table>
                    <Page  show-sizer class-name="fengpage" :total="totalCount" class="margin-top-10" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="pageSize" :current="currentPage"></Page>
                </div>
            </div>
        </Card>
        <rule-edit v-model="editModalShow" :title="modalTitle" @save-success="getPageData"></rule-edit>
    </div>
</template>

<script>
import ruleEdit from './rule-edit.vue';
import Util from '@/libs/util.js';

export default {
    name: 'rule',
    components: {
        ruleEdit
    },
    data () {
        return {
            editModalShow: false,
            modalTitle: '添加',
            permissions: {
                create: Util.abp.auth.isGranted('Pages.PointManagement.PointRules.Create'),
                edit: Util.abp.auth.isGranted('Pages.PointManagement.PointRules.Edit'),
                delete: Util.abp.auth.isGranted('Pages.PointManagement.PointRules.Delete'),
            },
            columns: [{
                title: '序号',
                type: 'index',
                width: 65,
                align: 'center'
            },{
                title: '方案名称',
                render:(h,params)=>{
                    return h('span', this.switchActionName(params.row.name))
                }
            },{
                title: '积分奖励',
                key: 'point'
            },{
                title: '活动兑奖',
                render:(h,params)=>{
                    return h('tag',{ 
                        props:{
                            color:params.row.isActivity?'yellow':'default',
                        },
                    }, params.row.isActivity?'是':'否');
                }
            },{
                title: '兑换商品',
                render:(h,params)=>{
                    return h('tag',{ 
                        props:{
                            color:params.row.isCommodity?'yellow':'default',
                        },
                    }, params.row.isCommodity?'是':'否');
                }
            },{
                title: '备注',
                key: 'remark'
            },{
                title: '操作',
                key: 'Actions',
                width: 160,
                render:(h,params)=>{
                    return h('div',[
                        h('Button',{
                            props:{
                                type:'primary',
                                size:'small',
                                icon:'android-create',
                                disabled:!this.permissions.edit
                            },
                            style:{
                                marginRight:'5px'
                            },
                            on:{
                                click:()=>{
                                    this.$store.commit('pointRule/edit', params.row.id);
                                    this.edit();
                                }
                            }
                        }, '编辑'),
                        h('Button',{
                            props:{
                                type:'error',
                                size:'small',
                                icon:'android-delete',
                                disabled:!this.permissions.delete
                            },
                            on:{
                                click:async ()=>{
                                    this.$Modal.confirm({
                                        title:'Tips',
                                        content:'您确定要删除这条数据吗?',
                                        okText:'确定',
                                        cancelText:'取消',
                                        onOk:async()=>{
                                            let response = await this.$store.dispatch({
                                                type:'pointRule/delete',
                                                data:params.row
                                            });
                                            if(response&&response.data&&response.data.success) {
                                                this.$Message.success('删除成功');
                                            }
                                            await this.getPageData();
                                        }
                                    });
                                }
                            }
                        }, '删除')
                    ]);
                }
            }]
        };
    },
    computed: {
        list() {
            return this.$store.state.pointRule.list;
        },
        loading() {
            return this.$store.state.pointRule.loading;
        },
        pageSize() {
            return this.$store.state.pointRule.pageSize;
        },
        totalCount() {
            return this.$store.state.pointRule.totalCount;
        },
        currentPage() {
            return this.$store.state.pointRule.currentPage;
        }
    },
    methods: {
        create () {
            this.editModalShow = true;
            this.modalTitle = '添加';
        },
        edit () {
            this.editModalShow = true;
            this.modalTitle = '修改';
        },
        pageChange(page) {
            this.$store.commit('pointRule/setCurrentPage', page);
            this.getPageData();
        },
        pageSizeChange(pageSize) {
            this.$store.commit('pointRule/setPageSize', pageSize);
            this.getPageData();
        },
        async getPageData() {
            let pageRequest = {};
            pageRequest.maxResultCount = this.pageSize;
            pageRequest.skipCount = (this.currentPage-1)*this.pageSize;
            await this.$store.dispatch({
                type: 'pointRule/getAll',
                data: pageRequest
            });
        },
        switchActionName(key) {
            let pointActions = this.$store.state.pointRule.pointActions;
            let actionKey = parseInt(key);
            let actionName = '未定义';
            // 匹配积分动作
            pointActions.forEach(item => {
                if(item.id == actionKey) {
                    actionName = item.name;
                }
            });

            return actionName;
        }
    }
};
</script>
