<style lang="less">
    @import '../../../assets/style/common.less';
</style>

<template>
    <div>
        <Card dis-hover>
            <div class="page-body">
                <div class="text-align-right">
                    <i-button type="primary" :disabled="!permissions.create" @click="create"><Icon type="plus"></Icon> 添加积分等级</i-button>
                </div>
                <div class="margin-top-10">
                    <Table :loading="loading" :columns="columns" border :data="list"></Table>
                    <Page  show-sizer class-name="fengpage" :total="totalCount" class="margin-top-10" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="pageSize" :current="currentPage"></Page>
                </div>
            </div>
        </Card>
        <rank-edit v-model="editModalShow" :title="modalTitle" @save-success="getPageData"></rank-edit>
    </div>
</template>

<script>
import rankEdit from './rank-edit.vue';
import appConfig from '@/libs/appConfig.js';
import Util from '@/libs/util.js';

export default {
    name: 'rank',
    components: {
        rankEdit
    },
    data () {
        return {
            editModalShow: false,
            modalTitle: '添加',
            permissions: {
                create: Util.abp.auth.isGranted('Pages.PointManagement.PointRanks.Create'),
                edit: Util.abp.auth.isGranted('Pages.PointManagement.PointRanks.Edit'),
                delete: Util.abp.auth.isGranted('Pages.PointManagement.PointRanks.Delete'),
            },
            avatarUrl: appConfig.remoteServiceBaseUrl + appConfig.remoteServicePointAvatarPath,
            columns: [{
                title: '序号',
                type: 'index',
                width: 65,
                align: 'center'
            },{
                title: '等级头像',
                width: 120,
                render:(h,params)=>{
                    return h('Avatar',{ 
                        props:{
                            src: params.row.avatar?this.avatarUrl + params.row.avatar:'',
                            icon: params.row.avatar?'':'person',
                        },
                    });
                }
            },{
                title: '等级名称',
                key: 'name'
            },{
                title: '积分区间',
                key: 'range'
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
                                    this.$store.commit('pointRank/edit', params.row.id);
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
                                                type:'pointRank/delete',
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
            return this.$store.state.pointRank.list;
        },
        loading() {
            return this.$store.state.pointRank.loading;
        },
        pageSize() {
            return this.$store.state.pointRank.pageSize;
        },
        totalCount() {
            return this.$store.state.pointRank.totalCount;
        },
        currentPage() {
            return this.$store.state.pointRank.currentPage;
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
            this.$store.commit('pointRank/setCurrentPage', page);
            this.getPageData();
        },
        pageSizeChange(pageSize) {
            this.$store.commit('pointRank/setPageSize', pageSize);
            this.getPageData();
        },
        async getPageData() {
            let pageRequest = {};
            pageRequest.maxResultCount = this.pageSize;
            pageRequest.skipCount = (this.currentPage-1)*this.pageSize;
            await this.$store.dispatch({
                type: 'pointRank/getAll',
                data: pageRequest
            });
        }
    }
};
</script>
