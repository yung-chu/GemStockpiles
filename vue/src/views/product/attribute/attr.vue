<style lang="less">
    @import "../../../assets/style/common.less";
</style>

<template>
    <div>
        <Card>
            <Row>
                <Col span="12">
                    <Card>
                        <div slot="title">
                            属性数据
                            <div class="inline-block-right">
                                <Button type="ghost" icon="plus" size="small" @click="addAttr">添加属性</Button>
                            </div>
                        </div>
                        <div class="margin-top-10">
                            <Table :loading="loading" :columns="columns" border :data="list" @on-row-click="attrData"></Table>
                            <Page show-sizer class-name="fengpage" :total="totalCount" class="margin-top-10" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="pageSize" :current="currentPage"></Page>
                        </div>
                    </Card>
                </Col>
                <Col span="10" offset="1">
                    <Card>
                        <div slot="title">
                            属性值数据
                            <div class="inline-block-right">
                                <Button type="ghost" icon="plus" size="small" @click="addDetailAttr">添加属性值</Button>
                            </div>
                        </div>
                        <div class="page-body">
                            <div>
                            </div>
                            <div class="margin-top-10">
                                <Table :loading="detailLoading" :columns="detailColumns" border :data="detailList"></Table>
                                <Page show-sizer class-name="fengpage" :total="detailTotalCount" class="margin-top-10" @on-change="detailPageChange" @on-page-size-change="detailPageSizeChange" :page-size="detailPageSize" :current="detailCurrentPage"></Page>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Card>
        <attr-edit v-model="editModalShow" :title="modalTitle" @save-success="getPageData"></attr-edit>
        <attr-detail-edit v-model="editDetailModalShow" :title="detailModalTitle" @save-success="getDetailPageData"></attr-detail-edit>
    </div>
</template>

<script>
import attrEdit from './attr-edit.vue';
import attrDetailEdit from './attr-detail-edit.vue';

export default {
    name: 'attr',
    components: {
        attrEdit,
        attrDetailEdit
    },
    data() {
        return {
            editModalShow: false,
            editDetailModalShow: false,
            modalTitle: '添加',
            detailModalTitle: '添加',
            attrs: {
                create: true,
                edit: true,
                delete: true,
            },
            columns: [{
                title: '序号',
                type: 'index',
                width: 65,
                align: 'center'
            },{
                title: '属性名',
                key: 'name'
            }, {
                title: '排序',
                key: 'sort'
            },
            {
                title: '属性类型',
                render: (h, params) => {
                    return h('span', this.switchTypeName(params.row.type))
                }
            },
            {
                title: '所属分类',
                render: (h, params) => {
                    return h('Tooltip', {
                        props: {
                            content: params.row.categoryNamePath.join(' > '),
                            placement: 'right'
                        }
                    }, params.row.categoryName);
                }
            },
            {
                title: '是否必须',
                render: (h, params) => {
                    return h('tag', {
                        props: {
                            color: params.row.required ? 'yellow' : 'default',
                        },
                    }, params.row.required ? '是' : '否');
                }
            },
            {
                title: '操作',
                key: 'Actions',
                width: 160,
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                                icon: 'android-create',
                                disabled: !this.attrs.edit
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.$store.commit('attr/edit', params.row.id);
                                    this.edit();
                                }
                            }
                        }, '编辑'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small',
                                icon: 'android-delete',
                                disabled: this.attrs.delete ? (params.row.isStatic ? true : false) : true
                            },
                            on: {
                                click: async () => {
                                    this.$Modal.confirm({
                                        title: 'Tips',
                                        content: '您确定要删除这条数据吗?',
                                        okText: '确定',
                                        cancelText: '取消',
                                        onOk: async () => {
                                            let response = await this.$store.dispatch({
                                                type: 'attr/delete',
                                                data: params.row
                                            });
                                            if (response && response.data && response.data.success) {
                                                this.$Message.success('删除成功');
                                                await this.$store.dispatch({
                                                    type: 'attr/get',
                                                    data: params.row
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
            }],
            detailColumns: [{
                title: '序号',
                type: 'index',
                width: 65,
                align: 'center'
            },{
                title: '属性值',
                key: "value"
            },
            {
                title: '操作',
                key: 'Actions',
                width: 160,
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                                icon: 'android-create',
                                disabled: !this.attrs.edit
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.$store.commit('attrDetail/edit', params.row.id);
                                    this.editDetail();
                                }
                            }
                        }, '编辑'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small',
                                icon: 'android-delete',
                                disabled: this.attrs.delete ? (params.row.isStatic ? true : false) : true
                            },
                            on: {
                                click: async () => {
                                    this.$Modal.confirm({
                                        title: 'Tips',
                                        content: '您确定要删除这条数据吗?',
                                        okText: '确定',
                                        cancelText: '取消',
                                        onOk: async () => {
                                            let response = await this.$store.dispatch({
                                                type: 'attrDetail/delete',
                                                data: params.row
                                            });
                                            if (response && response.data && response.data.success) {
                                                this.$Message.success('删除成功');
                                                await this.$store.dispatch({
                                                    type: 'attrDetail/get'
                                                });
                                            }
                                            await this.getDetailPageData();
                                        }
                                    });
                                }
                            }
                        }, '删除')
                    ]);
                }
            }]
        }
    },
    computed: {
        list() {
            return this.$store.state.attr.list;
        },
        detailList() {
            return this.$store.state.attrDetail.list;
        },
        loading() {
            return this.$store.state.attr.loading;
        },
        detailLoading() {
            return this.$store.state.attrDetail.loading;
        },
        pageSize() {
            return this.$store.state.attr.pageSize;
        },
        detailPageSize() {
            return this.$store.state.attrDetail.pageSize;
        },
        totalCount() {
            return this.$store.state.attr.totalCount;
        },
        detailTotalCount() {
            return this.$store.state.attrDetail.totalCount;
        },
        currentPage() {
            return this.$store.state.attr.currentPage;
        },
        detailCurrentPage() {
            return this.$store.state.attrDetail.currentPage;
        }
    },
    methods: {
        addAttr() {
            this.editModalShow = true;
            this.modalTitle = '添加';
        },
        addDetailAttr() {
            this.editDetailModalShow = true;
            this.detailModalTitle = "添加";
        },
        edit() {
            this.editModalShow = true;
            this.modalTitle = '修改';
        },
        editDetail() {
            this.editDetailModalShow = true;
            this.detailModalTitle = "修改";
        },
        pageChange(page) {
            this.$store.commit('attr/setCurrentPage', page);
            this.getPageData();
        },
        detailPageChange(page) {
            this.$store.commit('attrDetail/setCurrentPage', page);
            this.getDetailPageData();
        },
        pageSizeChange(pageSize) {
            this.$store.commit('attr/setPageSize', pageSize);
            this.getPageData();
        },
        detailPageSizeChange(pageSize) {
            this.$store.commit('attrDetail/setPageSize', pageSize);
            this.getDetailPageData();
        },
        async getPageData() {
            let pageRequest = {};
            pageRequest.maxResultCount = this.pageSize;
            pageRequest.skipCount = (this.currentPage - 1) * this.pageSize;
            await this.$store.dispatch({
                type: 'attr/getAll',
                data: pageRequest
            });
        },
        async getDetailPageData() {
            let pageRequest = {};
            pageRequest.maxResultCount = this.pageSize;
            pageRequest.skipCount = (this.currentPage - 1) * this.pageSize;
            await this.$store.dispatch({
                type: 'attrDetail/getAll',
                data: pageRequest
            });
        },
        switchTypeName(key) {
            let attrType = this.$store.state.attr.attrTypeEnum;
            let typeKey = parseInt(key);
            let typeName = '未定义';
            // 匹配属性类型
            attrType.forEach(item => {
                if (item.id == typeKey) {
                    typeName = item.name;
                }
            });

            return typeName;
        },
        async attrData(value){
            await this.$store.dispatch({
                type: 'attrDetail/getAttr',
                data: value
            });
        }
    }
}  
</script>