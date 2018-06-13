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
                        <i-button type="primary" :disabled="!permissions.create" @click="create"><Icon type="plus"></Icon> 添加角色</i-button>
                    </Row>
                </div>
                <div class="margin-top-10">
                    <Table :loading="loading" :columns="columns" border :data="list"></Table>
                    <Page  show-sizer class-name="fengpage" :total="totalCount" class="margin-top-10" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="pageSize" :current="currentPage"></Page>
                </div>
            </div>
        </Card>
        <role-create v-model="createModalShow"  @save-success="getPageData"></role-create>
        <role-edit v-model="editModalShow" @save-success="getPageData"></role-edit>
    </div>
</template>

<script>
import roleCreate from './role-create.vue';
import roleEdit from './role-edit.vue';
import Util from '@/libs/util.js';

export default {
    name: 'role',
    components: {
        roleCreate,
        roleEdit
    },
    data () {
        return {
            keyWord: '',
            createModalShow: false,
            editModalShow: false,
            permissions: {
                create: Util.abp.auth.isGranted('Pages.SystemManagement.Roles.Create'),
                edit: Util.abp.auth.isGranted('Pages.SystemManagement.Roles.Edit'),
                delete: Util.abp.auth.isGranted('Pages.SystemManagement.Roles.Delete'),
            },
            columns: [{
                title: '序号',
                type: 'index',
                width: 65,
                align: 'center'
            },{
                title: '角色名称',
                key: 'name'
            },{
                title: '显示名称',
                key: 'displayName'
            },{
                title: '描述',
                key: 'description'
            },{
                title: '是否静态(预构建)',
                render: (h,params)=>{
                    return h('tag',{ 
                        props:{
                            color:params.row.isStatic?'blue':'default',
                        },
                    }, params.row.isStatic?'是':'否');
                }
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
                                    this.$store.commit('role/edit', params.row.id);
                                    this.edit();
                                }
                            }
                        }, '编辑'),
                        h('Button',{
                            props:{
                                type:'error',
                                size:'small',
                                icon:'android-delete',
                                disabled:this.permissions.delete?(params.row.isStatic?true:false):true
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
                                                type:'role/delete',
                                                data:params.row
                                            });
                                            if(response&&response.data&&response.data.success) {
                                                this.$Message.success('删除成功');
                                                await this.$store.dispatch({
                                                    type:'user/getRoles'
                                                });
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
            return this.$store.state.role.list;
        },
        loading() {
            return this.$store.state.role.loading;
        },
        pageSize() {
            return this.$store.state.role.pageSize;
        },
        totalCount() {
            return this.$store.state.role.totalCount;
        },
        currentPage() {
            return this.$store.state.role.currentPage;
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
            this.$store.commit('role/setCurrentPage', page);
            this.getPageData();
        },
        pageSizeChange(pageSize) {
            this.$store.commit('role/setPageSize', pageSize);
            this.getPageData();
        },
        async getPageData() {
            let pageRequest = {};
            pageRequest.maxResultCount = this.pageSize;
            pageRequest.skipCount = (this.currentPage-1)*this.pageSize;
            pageRequest.keyWord = this.keyWord;
            await this.$store.dispatch({
                type: 'role/getAll',
                data: pageRequest
            });
        }
    },
    async created() {
        await this.$store.dispatch({
            type:'role/getTreePermissions'
        });
    }
};
</script>
