<template>
    <div>
        <Modal
            title="编辑角色"
            :value="value"
            :mask-closable="false"
            @on-ok="save"
            @on-visible-change="visibleChange"
         >
            <Form ref="roleForm" label-position="top" :rules="rules" :model="roleModel">
                <Tabs value="detail">
                    <TabPane label="基本信息" name="detail">
                        <FormItem label="名称" prop="name">
                            <Input v-model="roleModel.name" :maxlength="32" :minlength="2"></Input>
                        </FormItem>
                        <FormItem label="显示名称" prop="displayName">
                            <Input v-model="roleModel.displayName" :maxlength="32" :minlength="2"></Input>
                        </FormItem>
                        <FormItem label="描述" prop="description">
                            <Input v-model="roleModel.description" :maxlength="1024"></Input>
                        </FormItem>
                    </TabPane>
                    <TabPane label="权限信息" name="permission">
                        <FormItem prop="permissions">
                            <Tree :data="permissions" show-checkbox ref="tree"></Tree>
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
import jQuery from 'jquery';
import Util from '@/libs/util.js';

export default {
    data () {
        return {
            roleModel: {
                name: '',
                displayName: '',
                description: '',
                isStatic: false,
                permissions: []
            },
            rules: {
                name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                displayName: [{ required: true, message: '显示名称不能为空', trigger: 'blur' }]
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
        permissions() {
            return this.$store.state.role.permissions;
        }
    },
    methods: {
        visibleChange(value) {
            if(!value) {
                this.$refs.roleForm.resetFields();
                this.$emit('input', value);
                var treeData = Util.resetPermissionTree(this.permissions);
                this.$store.commit('role/setPermissions', treeData);
            }
            else {
                let response = this.$store.dispatch({
                    type:'role/getRoleForEdit',
                    id:this.$store.state.role.editRoleId
                }).then((response) => {
                    if(response&&response.data&&response.data.success&&response.data.result) {
                        this.roleModel = Util.extend(true, {}, response.data.result);
                        if(this.roleModel.permissions.length > 0) {
                            var treeData = Util.checkedPermissionTree(this.permissions, this.roleModel.permissions);
                            this.$store.commit('role/setPermissions', treeData);
                        }
                    }
                    else {
                        this.$Message.error('获取编辑数据失败');
                    }
                }).catch((error) => {
                    setTimeout(() => {this.$emit('input', false);}, 1500);
                });
            }
        },
        save() {
            this.$refs.roleForm.validate(async (valid)=>{
                if(valid) {
                    // 获取选中的节点
                    var permissionArray = [];
                    var checkData = this.$refs.tree.flatState.filter(obj => obj.node.checked || obj.node.indeterminate).map(obj => obj.node)
                    checkData.forEach(element => {
                        if(jQuery.inArray(element.name, permissionArray) < 0) {
                            permissionArray.push(element.name);    
                        }
                    });
                    if(permissionArray.length <= 0) {
                        this.$Message.error('请勾选角色的权限信息');
                        return false;
                    }
                    this.roleModel.permissions = permissionArray;
                    
                    let response = await this.$store.dispatch({
                        type:'role/update',
                        data:this.roleModel
                    });
                    if(response&&response.data&&response.data.success) {
                        this.$Message.success('修改成功');
                        await this.$store.dispatch({
                            type:'user/getRoles'
                        });
                    }
                    this.$refs.roleForm.resetFields();
                    this.$emit('save-success');
                    this.$emit('input', false);
                }
            });
        },
        cancel() {
            this.$refs.roleForm.resetFields();
            this.$emit('input', false);
        }
    },
    created() {
        this.roleModel.permissions = [];
    }
}
</script>
