<style lang="less">
    @import '../../../assets/style/common.less';
</style>

<template>
    <div>
        <Card dis-hover>
            <div class="page-body">
                <div>
                    <Row class="inline-block">
                        <Input type="text" v-model="keyWord" icon="search" placeholder="关键字" style="width: 200px" @keyup.enter.native="getPageData" />
                        <i-button type="primary" icon="ios-search" @click="getPageData">搜索</i-button>
                    </Row>
                    <Row class="inline-block-right">
                        <i-button type="primary" :disabled="!permissions.create" @click="create"><Icon type="plus"></Icon> 添加用户</i-button>
                    </Row>
                </div>
                <div class="margin-top-10">
                    <Table :loading="loading" :columns="columns" border :data="list"></Table>
                    <Page  show-sizer class-name="fengpage" :total="totalCount" class="margin-top-10" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="pageSize" :current="currentPage"></Page>
                </div>
            </div>
        </Card>
        <user-create v-model="createModalShow" @save-success="getPageData"></user-create>
        <user-edit v-model="editModalShow" @save-success="getPageData"></user-edit>
    </div>
</template>

<script>
import userCreate from './user-create.vue';
import userEdit from './user-edit.vue';
import Util from '@/libs/util.js';

export default {
    name: 'user',
    components: {
        userCreate,
        userEdit
    },
    data () {
        return {
            keyWord: '',
            createModalShow: false,
            editModalShow: false,
            permissions: {
                create: Util.abp.auth.isGranted('Pages.SystemManagement.Users.Create'),
                edit: Util.abp.auth.isGranted('Pages.SystemManagement.Users.Edit'),
                delete: Util.abp.auth.isGranted('Pages.SystemManagement.Users.Delete'),
            },
            columns: [{
                title: '序号',
                type: 'index',
                width: 65,
                align: 'center'
            },{
                title: '用户名',
                key: 'userName'
            },{
                title: '姓名',
                key: 'name'
            },{
                title: '角色',
                render:(h,params)=>{
                    return h('span',params.row.roleNames.join());
                }
            },{
                title: '激活',
                render:(h,params)=>{
                    return h('tag',{ 
                        props:{
                            color:params.row.isActive?'default':'yellow',
                        },
                    }, params.row.isActive?'是':'否');
                }
            },{
                title: '创建时间',
                key:'creationTime',
                render:(h,params)=>{
                    return h('span',new Date(params.row.creationTime).toLocaleDateString());
                }
            },{
                title: '上次登录时间',
                render:(h,params)=>{
                    return params.row.lastLoginTime?h('span',new Date(params.row.lastLoginTime).toLocaleString()):'';
                }
            },{
                title:'操作',
                key:'Actions',
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
                                    this.$store.commit('user/edit',params.row.id);
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
                                                type:'user/delete',
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
            return this.$store.state.user.list;
        },
        loading() {
            return this.$store.state.user.loading;
        },
        pageSize() {
            return this.$store.state.user.pageSize;
        },
        totalCount() {
            return this.$store.state.user.totalCount;
        },
        currentPage() {
            return this.$store.state.user.currentPage;
        }
    },
    methods: {
        create () {
            this.createModalShow = true;
        },
        edit () {
            this.editModalShow = true;
        },
        pageChange(page) {
            this.$store.commit('user/setCurrentPage', page);
            this.getPageData();
        },
        pageSizeChange(pageSize) {
            this.$store.commit('user/setPageSize', pageSize);
            this.getPageData();
        },
        async getPageData() {
            let pageRequest = {};
            pageRequest.maxResultCount = this.pageSize;
            pageRequest.skipCount = (this.currentPage-1)*this.pageSize;
            pageRequest.keyWord = this.keyWord;
            await this.$store.dispatch({
                type: 'user/getAll',
                data: pageRequest
            });
        }
    },
    async created() {
        await this.$store.dispatch({
            type:'user/getRoles'
        });
    }
};
</script>
