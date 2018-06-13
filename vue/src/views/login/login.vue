<style lang="less">
    @import 'login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="loginModel" :rules="rules">
                        <FormItem prop="userNameOrEmailAddress">
                            <Input v-model="loginModel.userNameOrEmailAddress" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="loginModel.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            loginModel: {
                userNameOrEmailAddress: '',
                password: '',
                rememberMe: false
            },
            rules: {
                userNameOrEmailAddress: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
                password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
            }
        };
    },
    methods: {
        async handleSubmit() {
            (this.$refs.loginForm).validate(async (valid)=>{
                if(valid) {
                    this.$Message.loading({
                        content: '正在登录...',
                        duration: 0
                    });
                    await this.$store.dispatch({
                        type: 'app/login',
                        data: this.loginModel
                    });
                    sessionStorage.setItem('rememberMe', this.loginModel.rememberMe?'1':'0');
                    location.reload();
                }
            });      
        }
    },
    created() {
        // 清空持久化的数据
        this.$store.commit('app/logout');
    }
};
</script>
