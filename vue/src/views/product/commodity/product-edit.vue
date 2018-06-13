<style>
    .attr{
        width: 800px
    }
</style>

<template>
    <div>
        <Modal :title="title+'属性数据'" :value="value" :mask-closable="false" @on-ok="save" @on-visible-change="visibleChange" width="45%">
            <Form ref="editForm" :label-width="80"  :rules="rules" :model="editModel" inline>
                <FormItem label="商品名称" prop="name">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
                <FormItem label="所属分类" prop="name">
              
                    <select></select>
                </FormItem>
                <FormItem label="图片" prop="name">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
                <FormItem label="视频" prop="name">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
                <FormItem label="名称" prop="name">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
                <FormItem label="数量" prop="name">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
                <FormItem label="价格" prop="name">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
                <FormItem label="证书号 " prop="name">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
                <FormItem label="产品编号" prop="name">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
                <FormItem label="产品说明" prop="name">
                    <Input v-model="editModel.name"></Input>
                </FormItem>
                <FormItem label="卖家" prop="name">
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
                name: ''
            },
            rules: {
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
    methods: {
        visibleChange(value) {
            if (!value) {
                this.$refs.editForm.resetFields();
                this.$emit('input', value);
            }
            else {
                if (this.title == '修改') {
                    // let response = this.$store.dispatch({
                    //     type:'attr/get',
                    //     id:this.$store.state.attr.editAttrId
                    // }).then((response) => {
                    //     if(response&&response.data&&response.data.success&&response.data.result) {

                    //         this.editModel = Util.extend(true, {}, response.data.result);
                    //     }
                    //     else {
                    //         this.$Message.error('获取修改数据失败');
                    //     }
                    // }).catch((error) => {
                    //     setTimeout(() => {this.$emit('input', false);}, 1500);
                    // });
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
    }
}
</script>

