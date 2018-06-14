<style lang="less">
    @import "../../../assets/style/common.less";
</style>

<template>
    <div>
        <Card>
            <Row>
                <Col span="14">
                    <Card>
                        <div slot="title">
                            属性数据
                            <div class="inline-block-right">
                                <Button type="primary" icon="plus" size="small" :disabled="!permissions.create" @click="addAttr">添加属性</Button>
                            </div>
                        </div>
                        <div class="margin-top-10">
                            <Table :loading="loading" :columns="columns" border :data="list" @on-row-click="categoryAttributeItemData"></Table>
                            <Page show-sizer class-name="fengpage" :total="totalCount" class="margin-top-10" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="pageSize" :current="currentPage"></Page>
                        </div>
                    </Card>
                </Col>
                <Col span="9" offset="1">
                    <Card>
                        <div slot="title">
                            属性值数据
                        </div>
                        <div class="page-body">
                            <div>
                            </div>
                            <div class="margin-top-10">
                                <Table :loading="detailLoading" :columns="detailColumns" border :data="detailList"></Table>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Card>
        <attribute-edit v-model="editModalShow" :title="modalTitle" @save-success="getPageData"></attribute-edit>
        <attribute-item-edit v-model="editAttributeItemModalShow" :title="attributeItemModalTitle" @save-success="getAttributeItemData"></attribute-item-edit>
    </div>
</template>

<script>
import attributeEdit from './attribute-edit.vue';
import attributeItemEdit from './attribute-item-edit.vue';
import Util from '@/libs/util.js';

export default {
    name: 'attr',
    components: {
        attributeEdit,
        attributeItemEdit
    },
    data() {
        return {
            editModalShow: false,
            editAttributeItemModalShow: false,
            modalTitle: '添加',
            attributeItemModalTitle: '添加',
            permissions: {
                create: Util.abp.auth.isGranted('Pages.ProductManagement.CategoryAttributes.Create'),
                edit: Util.abp.auth.isGranted('Pages.ProductManagement.CategoryAttributes.Edit'),
                delete: Util.abp.auth.isGranted('Pages.ProductManagement.CategoryAttributes.Delete'),
            },
            columns: [{
                title: '序号',
                type: 'index',
                width: 65,
                align: 'center'
            },{
                title: '属性名',
                key: 'name'
            },{
                title: '排序',
                key: 'sort'
            },{
                title: '属性类型',
                render: (h, params) => {
                    return h('span', this.switchTypeName(params.row.type))
                }
            },{
                title: '所属分类',
                render: (h, params) => {
                    return h('Tooltip', {
                        props: {
                            content: params.row.categoryNamePath.join(' > '),
                            placement: 'right'
                        }
                    }, params.row.categoryName);
                }
            },{
                title: '是否必须',
                render: (h, params) => {
                    return h('tag', {
                        props: {
                            color: params.row.required ? 'yellow' : 'default',
                        },
                    }, params.row.required ? '是' : '否');
                }
            },{
                title: '操作',
                key: 'Actions',
                width: 250,
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                                icon: 'android-create',
                                disabled: !this.permissions.edit
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.$store.commit('attribute/edit', params.row.id);
                                    this.edit();
                                }
                            }
                        }, '编辑'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small',
                                icon: 'android-delete',
                                disabled: !this.permissions.delete
                            },
                            style: {
                                marginRight: '5px'
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
                                                type: 'attribute/delete',
                                                data: params.row
                                            });
                                            if (response && response.data && response.data.success) {
                                                this.$Message.success('删除成功');
                                                this.$store.commit('attributeItem/clearList');
                                            }
                                            await this.getPageData();
                                        }
                                    });
                                }
                            }
                        }, '删除'),
                        h('Button', {
                            props: {
                                //type: 'ghost',
                                size: 'small',
                                icon: 'android-add',
                                disabled: !this.permissions.create
                            },
                            on: {
                                click: () => {
                                    this.addAttributeItem();
                                }
                            }
                        }, '添加属性值'),
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
            },{
                title: '排序',
                key: 'sort'
            },{
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
                                disabled: !this.permissions.edit
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.$store.commit('attributeItem/edit', params.row.id);
                                    this.editAttributeItem();
                                }
                            }
                        }, '编辑'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small',
                                icon: 'android-delete',
                                disabled: !this.permissions.delete
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
                                                type: 'attributeItem/delete',
                                                data: params.row
                                            });
                                            if (response && response.data && response.data.success) {
                                                this.$Message.success('删除成功');
                                                await this.getAttributeItemData();
                                            }
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
            return this.$store.state.attribute.list;
        },
        detailList() {
            return this.$store.state.attributeItem.list;
        },
        loading() {
            return this.$store.state.attribute.loading;
        },
        detailLoading() {
            return this.$store.state.attributeItem.loading;
        },
        pageSize() {
            return this.$store.state.attribute.pageSize;
        },
        totalCount() {
            return this.$store.state.attribute.totalCount;
        },
        currentPage() {
            return this.$store.state.attribute.currentPage;
        }
    },
    methods: {
        addAttr() {
            this.editModalShow = true;
            this.modalTitle = '添加';
        },
        addAttributeItem() {
            this.editAttributeItemModalShow = true;
            this.attributeItemModalTitle = "添加";
        },
        edit() {
            this.editModalShow = true;
            this.modalTitle = '修改';
        },
        editAttributeItem() {
            this.editAttributeItemModalShow = true;
            this.attributeItemModalTitle = "修改";
        },
        pageChange(page) {
            this.$store.commit('attribute/setCurrentPage', page);
            this.getPageData();
        },
        pageSizeChange(pageSize) {
            this.$store.commit('attribute/setPageSize', pageSize);
            this.getPageData();
        },
        async getPageData() {
            let pageRequest = {};
            pageRequest.maxResultCount = this.pageSize;
            pageRequest.skipCount = (this.currentPage - 1) * this.pageSize;
            await this.$store.dispatch({
                type: 'attribute/getAll',
                data: pageRequest
            });
        },
        switchTypeName(key) {
            let attrType = this.$store.state.attribute.attributeTypes;
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
        async categoryAttributeItemData(value) {
            await this.$store.dispatch({
                type: 'attributeItem/getCategoryAttributeItems',
                data: value
            });
        },
        async getAttributeItemData() {
            //查询参数
            let param = {id: this.$store.state.attributeItem.currentAttributeId};
            await this.$store.dispatch({
                type: 'attributeItem/getCategoryAttributeItems',
                data: param
            });
        }
    }
}  
</script>