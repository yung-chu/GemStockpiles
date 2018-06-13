<template>
    <div>
        <Card>
            <div slot="title">
                分类数据
                <div class="inline-block-right">
                    <Button type="ghost" icon="plus" size="small" @click="creat_category"></Button>
                    <Button type="ghost" icon="compose" size="small" @click="edit_category"></Button>
                </div>
            </div>
            <div class="margin-top:20">
                <Tree :data="getTreeCategory" @on-select-change="getTreeData"></Tree>
            </div>
        </Card>
        <category-edit v-model="editModalShow" @save-success="getTreeCategoryData"></category-edit>
    </div>
</template>

<script>
import categoryEdit from './category-edit.vue';

export default {
    components: {
        categoryEdit
    },
    data() {
        return {
            editModalShow: false
        }
    },
    computed: {
        getTreeCategory() {
            return this.$store.state.category.categoryTree;
        }
    },
    methods: {
        creat_category() {
            this.editModalShow = true;
            this.modalTitle = '添加';
        },
        edit_category() {
            //判断是否选择了分类, 修改选中项

            this.editModalShow = true;
            this.modalTitle = '修改';
        },
        async getTreeData(value) {
            let response = await this.$store.dispatch({
                type: 'attr/getAttrData',
                data: value[0].value
            });
            this.$store.state.attrDetail.list=[];
            
            this.$store.commit('category/setAttrList', response);
            //this.$emit('attrData', response);
        },
        async getTreeCategoryData() {
            //更新Tree
            await this.$store.dispatch({
               type: 'category/getTreeCategory'
            });
            //更新Cascader
            await this.$store.dispatch({
                type: 'category/getCascader'
            });
        }
    },
    async created() {
        await this.$store.dispatch({
            type: 'category/getTreeCategory'
        });
    }
}
</script>