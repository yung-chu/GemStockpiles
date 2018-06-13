<template>
    <div>
        <Modal
            :title="title+'积分方案'"
            :value="value"
            :mask-closable="false"
            @on-ok="save"
            @on-visible-change="visibleChange"
         >
            <Form ref="editForm" label-position="top" :rules="rules" :model="editModel">
                <FormItem label="方案名称" prop="name">
                    <Select v-model="editModel.name" style="width:200px">
                        <Option v-for="item in pointActions" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select> 
                </FormItem>
                <FormItem label="积分奖励" prop="point">
                    <Input v-model="editModel.point" :maxlength="5" number></Input>
                </FormItem>
                <FormItem prop="isActivity">
                    <Checkbox v-model="editModel.isActivity" size="large">活动兑奖</Checkbox>
                </FormItem>
                <FormItem prop="isCommodity">
                    <Checkbox v-model="editModel.isCommodity" size="large">兑换商品</Checkbox>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="editModel.remark" type="textarea"></Input>
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
    data () {
        const valideMinPoint = (rule, value, callback) => {
            var regex = /^([1-9]\d*?)$/;
            if (!regex.test(value)) {
                callback(new Error('请输入大于0的整数'));
            } else {
                callback();
            }
        };
        return {
            editModel: {
                name: '',
                point: '',
                isActivity: true,
                isCommodity: true,
                remark: ''
            },
            rules: {
                name:[
                    { required: true, type: 'number', message: '请选择积分方案', trigger: 'change' }
                ],
                point:[
                    { required: true, type: 'number', message: '积分奖励不能为空', trigger: 'blur' },
                    { validator: valideMinPoint, trigger: 'blur' }
                ]
            }
        };
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
        pointActions() {
            return this.$store.state.pointRule.pointActions;
        }
    },
    methods: {
        visibleChange(value) {
            if(!value) {
                this.$refs.editForm.resetFields();
                this.$emit('input', value);
            }
            else {
                if(this.title == '修改') {
                    let response = this.$store.dispatch({
                        type:'pointRule/get',
                        id:this.$store.state.pointRule.editRuleId
                    }).then((response) => {
                        if(response&&response.data&&response.data.success&&response.data.result) {
                            this.editModel = Util.extend(true, {}, response.data.result);
                        }
                        else {
                            this.$Message.error('获取修改数据失败');
                        }
                    }).catch((error) => {
                        setTimeout(() => {this.$emit('input', false);}, 1500);
                    });
                }
                else {
                    //移除ID属性
                    delete this.editModel['id'];
                }
            }
        },
        save() {
            this.$refs.editForm.validate(async (valid)=>{
                if(valid) {
                    let storeType = '';
                    if(this.title == '修改') {
                        storeType = 'pointRule/update';        
                    }
                    else {
                        storeType = 'pointRule/create';        
                    }
                    let response = await this.$store.dispatch({
                        type:storeType,
                        data:this.editModel
                    });
                    if(response&&response.data&&response.data.success) {
                        this.$Message.success(this.title+'成功');
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
