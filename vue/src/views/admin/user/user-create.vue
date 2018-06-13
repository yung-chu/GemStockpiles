<template>
    <div>
        <Modal
            title="添加用户"
            :value="value"
            :mask-closable="false"
            @on-ok="save"
            @on-visible-change="visibleChange"
         >
            <Form ref="userForm" label-position="top" :rules="rules" :model="userModel">
                <Tabs value="detail">
                    <TabPane label="基本信息" name="detail">
                        <FormItem label="用户名" prop="userName">
                            <Input v-model="userModel.userName" :maxlength="32" :minlength="2"></Input>
                        </FormItem>
                        <FormItem label="姓名" prop="name">
                            <Input v-model="userModel.name" :maxlength="32"></Input>
                        </FormItem>
                        <FormItem label="密码" prop="password">
                            <Input v-model="userModel.password" type="password" :maxlength="32"></Input>
                        </FormItem>
                        <FormItem prop="isActive">
                            <Checkbox v-model="userModel.isActive" size="large">是否激活</Checkbox>
                        </FormItem>
                    </TabPane>
                    <TabPane label="角色信息" name="roleNames">
                        <FormItem prop="roleNames">
                            <CheckboxGroup v-model="userModel.roleNames">
                                <Checkbox :label="role.normalizedName" v-for="role in roles" :key="role.id" size="large"><span>{{role.name}}</span></Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                    </TabPane>
                </Tabs>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button @click="save" type="primary">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    data () {
        return {
            userModel: {
                userName: '',
                name: '',
                password: '',
                isActive: true,
                roleNames: []
            },
            rules: {
                userName:[{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                name:[{ required: true, message: '姓名不能为空', trigger: 'blur' }],
                password:[{ required: true, message: '密码不能为空', trigger: 'blur' }]
            }
        };
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
    },
    computed: {
        roles() {
            return this.$store.state.user.roles;
        }
    },
    methods: {
        visibleChange(value) {
            if(!value) {
                this.$refs.userForm.resetFields();
                this.$emit('input', value);
            }
        },
        save() {
            this.$refs.userForm.validate(async (valid)=>{
                if(valid) {
                    if(!this.userModel.roleNames) {
                        this.userModel.roleNames = [];
                    }
                    let response = await this.$store.dispatch({
                        type:'user/create',
                        data:this.userModel
                    });
                    if(response&&response.data&&response.data.success) {
                        this.$Message.success('添加成功');
                    }
                    this.$refs.userForm.resetFields();
                    this.$emit('save-success');
                    this.$emit('input', false);
                }
            });
        },
        cancel() {
            this.$refs.userForm.resetFields();
            this.$emit('input', false);
        }
    }
}
</script>
