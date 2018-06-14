<style>
    .attr{
        width: 800px
    }
</style>

<template>
    <div>
        <Modal :title="title+'属性数据'" :value="value" :mask-closable="false" @on-ok="save" @on-visible-change="visibleChange" width="35%">
            <Form ref="editForm" :label-width="80"  :rules="rules" :model="editModel" inline>
                <FormItem label="商品名称" prop="name">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
                <FormItem label="数量" prop="name">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
                <FormItem label="所属分类" prop="name">
                    <Cascader :value="selectValue" :data="cascaderCategory" @on-change="cascaderCategoryChange" change-on-select filterable></Cascader>
                </FormItem>
                <FormItem label="价格" prop="name">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
                <FormItem label="证书号 " prop="name">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
                <FormItem label="卖家" prop="name">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
                <FormItem label="产品编号" prop="name">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
                <FormItem label="图片" prop="name" width="55%">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
                <FormItem label="视频" prop="name"  width="55%">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
                <FormItem label="产品说明" prop="name">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
            </Form>
 
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button @click="save" type="primary">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import Util from '@/libs/util.js';
export default {
    data() {
        const valideSort = (rule, value, callback) => {
            var regex = /^([1-9]\d*?)$/;
            if (!regex.test(value)) {
                callback(new Error('请输入大于0的整数'));
            } else {
                callback();
            }
        };
        return {
            editModel: {
                categoryId:'',
                name: ''
            },
            rules: {
                categoryId:[
                    { required: true, message: '请选择所属分类', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '属性名称不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    props: {
        title: {
            type: String,
            default: "添加"
        },
        value: {
            type: Boolean,
            default: false
        },
    },
    computed: {
        cascaderCategory() {
            return this.$store.state.category.cascaderCategory;
        }
    },
    methods: {
        cascaderCategoryChange(data) {
            if (data.length > 0) {
                this.editModel.categoryId = data[data.length - 1]
            }
            else {
                this.editModel.categoryId = '';
            }
        },
        visibleChange(value) {
            if (!value) {
                this.$refs.editForm.resetFields();
                this.$emit('input', value);
            }
            else {
                if (this.title == '修改') {
                    //
                }
                else {
                    //移除ID属性
                    delete this.editModel['id'];
                }
            }
        },
        save() {
        },
        cancel() {
            this.$refs.editForm.resetFields();
            this.$emit('input', false);
        }
    },
    async created() {
        await this.$store.dispatch({
            type:'category/getCascaderCategory'
        });
    }
}
</script>

