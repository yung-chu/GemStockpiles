<template>
    <div>
        <Modal :title="title+'属性值'" :value="value" :mask-closable="false" @on-ok="save" @on-visible-change="visibleChange">
            <Form ref="editForm" label-position="top" :rules="rules" :model="editModel">
                <FormItem label="所属属性" prop="attributeId">
                    <Select v-model="editModel.attributeId">
                        <Option v-for="item in allAttrList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="属性值" prop="value">
                    <Input v-model="editModel.value" :maxlength="16"></Input>
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
        return {
            editModel: {
                value: '',
                attributeId: ''
            },
            rules: {
                attributeId:[{ required: true, message: '请选择所属属性', trigger: 'change' }],
                value: [{ required: true, message: '属性值不能为空', trigger: 'blur' }]
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
    computed: {
        allAttrList() {
            return this.$store.state.attrDetail.allAttrList;
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
                        type: 'attrDetail/get',
                        id: this.$store.state.attrDetail.editAttrDetailId
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
                        storeType = 'attrDetail/update';
                    }
                    else {
                        storeType = 'attrDetail/create';
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
    },
    async created() {
        await this.$store.dispatch({
            type: 'attrDetail/getAllAttr'
        });
    }
}
</script>

