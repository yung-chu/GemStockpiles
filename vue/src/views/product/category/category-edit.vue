<template>
    <div>
        <Modal title="添加分类" :value="value" :mask-closable="false" @on-ok="save" @on-visible-change="visibleChange">
            <Form ref="categoryForm" label-position="top" :rules="rules" :model="categoryModel">
                <FormItem label="分类" prop="parentId">
                    <Cascader v-model="categoryModel.parentId" :data="getCascader" filterable change-on-select></Cascader>
                </FormItem>
                <FormItem label="分类名" prop="name">
                    <Input v-model="categoryModel.name" :maxlength="20" :minlength="1"></Input>
                </FormItem>
                <FormItem label="排序" prop="sort">
                    <Input v-model="categoryModel.sort" :maxlength="5" :minlength="1" number></Input>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="categoryModel.remark" :maxlength="255"></Input>
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
            categoryModel: {
                parentId: [],
                name: '',
                sort: '',
                remark: ''
            },
            rules: {
                name: [
                    { required: true, message: '分类名不能为空', trigger: 'blur' }
                ],
                sort: [
                    { required: true, type: 'number', message: '排序值不能为空', trigger: 'blur' },
                    { validator: valideSort, trigger: 'blur' }
                ]
            }
        };
    },
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        getCascader() {
            return this.$store.state.category.categoryCascader;
        }
    },
    methods: {
        visibleChange(value) {
            if (!value) {
                this.$refs.categoryForm.resetFields();
                this.$emit('input', value);
            }
        },
        cancel() {
            this.$refs.categoryForm.resetFields();
            this.$emit('input', false);
        },
        save() {
            this.$refs.categoryForm.validate(async (valid) => {
                if (valid) {
                    //为数组时重置parentId的值
                    if(Object.prototype.toString.call(this.categoryModel.parentId)=='[object Array]') {
                        if (this.categoryModel.parentId.length > 0) {
                            this.categoryModel.parentId = this.categoryModel.parentId[this.categoryModel.parentId.length - 1]
                        }
                        else {
                            this.categoryModel.parentId = '';
                        }
                    }
                    let response = await this.$store.dispatch({
                        type: 'category/create',
                        data: this.categoryModel
                    });
                    if (response && response.data && response.data.success) {
                        this.$Message.success('添加成功');
                    }
                    this.$refs.categoryForm.resetFields();
                    this.$emit('save-success');
                    this.$emit('input', false);
                }
            });
        }
    },
    async created() {
        await this.$store.dispatch({
            type: 'category/getCascader'
        });
    }
};
</script>