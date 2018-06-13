<template>
    <div>
        <Modal
            title="修改密码"
            :value="value"
            :mask-closable="false"
            :width="500"
            @on-ok="save"
            @on-visible-change="visibleChange"
         >
            <Form ref="editPasswordForm" :model="editPasswordModel" :label-width="100" label-position="right" :rules="rules">
                <FormItem label="原密码" prop="oldPassword">
                    <Input type="password" v-model="editPasswordModel.oldPassword" placeholder="请输入现在使用的密码" ></Input>
                </FormItem>
                <FormItem label="新密码" prop="newPassword">
                    <Input type="password" v-model="editPasswordModel.newPassword" placeholder="请输入新密码" ></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="rePassword">
                    <Input type="password" v-model="editPasswordModel.rePassword" placeholder="请再次输入新密码" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" @click="save">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    data () {
        const valideOldPassword = (rule, value, callback) => {
            if (value === this.editPasswordModel.oldPassword) {
                callback(new Error('新密码与原密码一致'));
            } else {
                callback();
            }
        };
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.editPasswordModel.newPassword) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
        return {
            editPasswordModel: {
                id: 0,
                oldPassword: '',
                newPassword: '',
                rePassword: ''
            },
            rules: {
                oldPassword: [
                    { required: true, message: '请输入原密码', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { max: 32, message: '最多输入32个字符', trigger: 'blur' },
                    { validator: valideOldPassword, trigger: 'blur' }
                ],
                rePassword: [ 
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    { validator: valideRePassword, trigger: 'blur' }
                ]
            },
        };
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
    },
    methods: {
        visibleChange(value) {
            if(!value) {
                this.$refs.editPasswordForm.resetFields();
                this.$emit('input', value);
            }
        },
        save() {
            this.$refs.editPasswordForm.validate(async (valid)=>{
                if(valid) {
                    let response = await this.$store.dispatch({
                        type:'common/changePassword',
                        data:this.editPasswordModel
                    });
                    if(response&&response.data&&response.data.success) {
                        this.$Message.success('修改成功');
                    }
                    this.$refs.editPasswordForm.resetFields();
                    this.$emit('save-success');
                    this.$emit('input', false);
                }
            });
        },
        cancel() {
            this.$refs.editPasswordForm.resetFields();
            this.$emit('input', false);
        },
        init() {
            var currentUser = this.$store.getters['session/getCurrentUser'];
            if(currentUser) {
                this.editPasswordModel.id = currentUser.id;
            }
        }
    },
    created() {
        this.init();
    }
}
</script>
