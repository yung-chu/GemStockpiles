<style lang="less">
    @import './401.less';
</style>

<template>
    <div class="error401">
        <div class="error401-body-con">
            <Card>
                <div class="error401-body-con-title">4<span><Icon type="locked"></Icon></span>1</div>
                <p class="error401-body-con-message">The page doesn't exist.</p>
                <div class="error401-btn-con">
                    <Button @click="goHome" size="large" style="width: 200px;" type="text">返回首页</Button>
                    <Button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</Button>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'error-401',
    methods: {
        backPage () {
            this.$router.go(-1);
        },
        goHome () {
            this.$router.push({
                name: 'home'
            });
        }
    }
};
</script>
