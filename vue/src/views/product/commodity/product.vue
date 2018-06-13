<style lang="less">
@import "../../../assets/style/common.less";
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
                        <i-button type="primary" :disabled="!permissions.create" @click="addProduct">
                            <Icon type="plus"></Icon> 添加商品</i-button>
                    </Row>
                </div>
                <div class="margin-top-10">
                    <Table :loading="loading" :columns="columns" border :data="list"></Table>
                    <Page show-sizer class-name="fengpage" :total="totalCount" class="margin-top-10" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="pageSize" :current="currentPage"></Page>
                </div>
            </div>
        </Card>
        <product-edit v-model="editModalShow" :title="modalTitle" @save-success="getPageData"></product-edit>
    </div>
</template>

<script>
import productEdit from './product-edit.vue';
export default {
    name: 'product',
    components: {
        productEdit
    },
    data() {
        return {
            keyWord: '',
            permissions: {
                create: true,
                edit: true,
                delete: true,
            },
            modalTitle:"添加",
            editModalShow:false,
            columns: [{
                title: '序号',
                width: 60,
                type: 'index'
            }, {
                title: 'ID',
                key: 'id'
            }, {
                title: '商品名称',
                key: 'name'
            }, {
                title: '父类',
                key: 'Name'
            }, {
                title: '子类',
                key: 'Name'
            }, {
                title: '图片',
                key: 'Name'
            }, {
                title: '视频',
                key: 'Name'
            }, {
                title: '名称',
                key: 'Name'
            }, {
                title: '数量',
                key: 'Name'
            }, {
                title: '价格',
                key: 'Name'
            }, {
                title: '证书号',
                key: 'Name'
            }, {
                title: '产品编号',
                key: 'Name'
            }, {
                title: '产品说明',
                key: 'Name'
            }, {
                title: '审核',
                key: 'Name',
                // type: 'selection',

            }, {
                title: '是否推荐',
                key: 'Name'
            }, {
                title: '状态',
                key: 'Name'
            }]
        }
    },
    computed: {
        list() {
            return this.$store.state.product.list;
        },
        loading() {
            return this.$store.state.product.loading;
        },
        pageSize() {
            return this.$store.state.product.pageSize;
        },
        totalCount() {
            return this.$store.state.product.totalCount;
        },
        currentPage() {
            return this.$store.state.product.currentPage;
        }
    },
    methods: {
        addProduct() {
            this.modalTitle="添加";
            this.editModalShow = true;
        },
        edit() {
            this.modalTitle="编辑";
            this.editModalShow = true;
        },
        pageChange(page) {
            this.$store.commit('product/setCurrentPage', page);
            this.getPageData();
        },
        pageSizeChange(pageSize) {
            this.$store.commit('product/setPageSize', pageSize);
            this.getPageData();
        },
        async getPageData() {
            let pageRequest = {};
            pageRequest.maxResultCount = this.pageSize;
            pageRequest.skipCount = (this.currentPage - 1) * this.pageSize;
            pageRequest.keyWord = this.keyWord;
            await this.$store.dispatch({
                type: 'product/getAll',
                data: pageRequest
            });
        }
    }
}
</script>