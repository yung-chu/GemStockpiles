<style lang="less">
    @import "../../../assets/style/common.less";
</style>

<style scoped>
    .paging {
        float: right;
        margin-top: 10px;
    }
</style>

<template>
    <Row>
        <Col span="8">
            <category-tree></category-tree>
        </Col>
        <Col span="15" offset="1">
            <Card>
                <div slot="title">
                    分类属性数据
                </div>
                <div class="page-body">
                    <Row>
                        <Col span="13">
                            <Card>
                                <div slot="title">
                                    属性数据
                                </div>
                                <div class="margin-top-10">
                                    <Table :columns="columns" border :data="attrList" @on-row-click="attrDetailData"></Table>
                                </div>
                            </Card>
                        </Col>
                        <Col span="10" offset="1">
                            <Card>
                                <div slot="title">
                                    属性值数据
                                </div>
                                <div class="page-body">
                                    <div class="margin-top-10">
                                        <Table :columns="detailColumns" border :data="detailList"></Table>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Card>
        </Col>
    </Row>
</template>

<script>
import categoryTree from './category-tree.vue';

export default {
    components: {
        categoryTree,
    },
    computed:{
        attrList() {
            return this.$store.state.category.selectAttrList;
        },
        detailList() {
            return this.$store.state.attrDetail.list;
        }
    },
    data() {
        return {
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
                title: '属性名称',
                key: "name"
            },
            {
                title: '操作',
                key: 'Actions',
                width: 160,
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small',
                                icon: 'android-delete',
                                disabled: !this.attrs.delete
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
                                                let response = await this.$store.dispatch({
                                                    type: 'attr/getAttrData',
                                                    data: params.row.categoryId
                                                });
                                                this.$store.commit('category/setAttrList', response);
                                            }
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
                                type: 'error',
                                size: 'small',
                                icon: 'android-delete',
                                disabled: !this.attrs.delete
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
                                        }
                                    });
                                }
                            }
                        }, '删除')
                    ]);
                }
            }],
            list: []
        }
    },
    methods: {
        async attrDetailData(value){
            await this.$store.dispatch({
                type: 'attrDetail/getAttr',
                data: value
            });
        }
    }
}
</script>