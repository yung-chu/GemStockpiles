<template>
    <div>
        <Modal :title="title+'属性值'" :value="value" :mask-closable="false" @on-ok="save" @on-visible-change="visibleChange">
            <Form ref="editForm" label-position="top" :rules="rules" :model="editModel">
                <FormItem label="属性值" prop="value">
                    <Input v-model="editModel.value" :maxlength="16"></Input>
                </FormItem>
                <FormItem label="排序" prop="sort">
                    <Input v-model="editModel.sort" :maxlength="5" style="width:200px"></Input>
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
                categoryAttributeId: '',
                value: '',
                sort: ''
            },
            rules: {
                value: [
                    { required: true, message: '属性值不能为空', trigger: 'blur' }
                ],
                sort:[
                    { required: true, type: 'number', message: '排序值不能为空', trigger: 'blur' },
                    { type: 'number', message: '请输入数字', trigger: 'blur', transform(value) {return Number(value);} },
                    { validator: valideSort, trigger: 'blur' }
                ],
            }
        }
    },
    props: {
        title: {
            type: String,
            default: '添加'
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        visibleChange(value) {
            if (!value) {
                this.$refs.editForm.resetFields();
                this.$emit('input', value);
            }
            else {
                if (this.title == '修改') {
                    let response = this.$store.dispatch({
                        type: 'attributeItem/get',
                        id: this.$store.state.attributeItem.editAttributeItemId
                    }).then((response) => {
                        if (response && response.data && response.data.success && response.data.result) {
                            this.editModel = Util.extend(true, {}, response.data.result);
                        }
                        else {
                            this.$Message.error('获取修改数据失败');
                        }
                    }).catch((error) => {
                        setTimeout(() => { this.$emit('input', false); }, 1500);
                    });
                }
                else {
                    //设置当前属性ID
                    this.editModel.categoryAttributeId = this.$store.state.attributeItem.currentAttributeId;
                    //移除ID属性
                    delete this.editModel['id'];
                }
            }
        },
        save() {
            this.$refs.editForm.validate(async (valid) => {
                if (valid) {
                    let storeType = '';
                    if (this.title == '修改') {
                        storeType = 'attributeItem/update';
                    }
                    else {
                        storeType = 'attributeItem/create';
                    }
                    let response = await this.$store.dispatch({
                        type: storeType,
                        data: this.editModel
                    });
                    if (response && response.data && response.data.success) {
                        this.$Message.success(this.title + '成功');
                    }
                    this.$refs.editForm.resetFields();
                    this.$emit('save-success');
                    this.$emit('input', false);
                }
            });
        },
        cancel() {
            this.$refs.editForm.resetFields();
            this.$emit('input', false);
        }
    }
}
</script>

