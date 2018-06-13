<template>
    <div>
        <Modal
            :title="title+'积分等级'"
            :value="value"
            :mask-closable="false"
            @on-ok="save"
            @on-visible-change="visibleChange"
         >
            <Form ref="editForm" label-position="top" :rules="rules" :model="editModel">
                <FormItem label="等级头像" prop="avatar">
                    <div class="demo-upload-list" v-for="item in uploadList">
                        <template v-if="item.status === 'finished'">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                            </div>
                        </template>
                        <template v-else>
                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                    </div>
                    <Upload
                        ref="upload"
                        :show-upload-list="false"
                        :default-file-list="defaultList"
                        :on-success="handleSuccess"
                        :format="['jpg','jpeg','png']"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        type="drag"
                        :action="uploadActionUrl"
                        :data="dataParam"
                        :headers="headerParam"
                        style="display: inline-block;width:58px;">
                        <div style="width: 58px;height:58px;line-height: 58px;">
                            <Icon type="camera" size="20"></Icon>
                        </div>
                    </Upload>
                    <Modal title="图片预览" class-name="zindex-top" v-model="visible">
                        <img :src="avatarViewUrl" style="width: 100%">
                    </Modal>
                </FormItem>
                <FormItem label="等级名称" prop="name">
                    <Input v-model="editModel.name" :maxlength="16"></Input>
                </FormItem>
                <FormItem label="最小积分" prop="minPoint">
                    <Input v-model="editModel.minPoint" :maxlength="8" number></Input>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="editModel.remark" type="textarea" :rows="2"></Input>
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
import appConfig from '@/libs/appConfig.js';
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
                avatar: '',
                name: '',
                minPoint: '',
                remark: ''
            },
            rules: {
                name:[{ required: true, message: '等级名称不能为空', trigger: 'blur' }],
                minPoint:[
                    { required: true, type: 'number', message: '最小积分不能为空', trigger: 'blur' },
                    { validator: valideMinPoint, trigger: 'blur' }
                ]
            },
            uploadActionUrl: appConfig.remoteServiceBaseUrl + '/api/services/app/Common/UploadFile',
            baseUrl: appConfig.remoteServiceBaseUrl,
            avatarBaseUrl: appConfig.remoteServiceBaseUrl + appConfig.remoteServicePointAvatarPath,
            defaultList: [],
            avatarViewUrl: '',
            visible: false,
            uploadList: [],
            dataParam: {
                UploadType: 10,
                FileType: 10   
            },
            headerParam: {
                Authorization: "Bearer " + window.abp.auth.getToken()
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
    methods: {
        visibleChange(value) {
            if(!value) {
                this.$refs.editForm.resetFields();
                this.$emit('input', value);
                // 清空默认头像
                this.defaultList = [];
                this.$nextTick(() => {this.uploadList = this.$refs.upload.fileList;});   
            }
            else {
                if(this.title == '修改') {
                    let response = this.$store.dispatch({
                        type:'pointRank/get',
                        id:this.$store.state.pointRank.editRankId
                    }).then((response) => {
                        if(response&&response.data&&response.data.success&&response.data.result) {
                            this.editModel = Util.extend(true, {}, response.data.result);
                            if(this.editModel.avatar != '') {
                                this.defaultList = [
                                    {
                                        'name': this.editModel.avatar,
                                        'url': this.avatarBaseUrl + '/' + this.editModel.avatar
                                    }
                                ];
                            }
                            else {
                                this.defaultList = [];
                            }
                            this.$nextTick(() => {this.uploadList = this.$refs.upload.fileList;});   
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
                        storeType = 'pointRank/update';        
                    }
                    else {
                        storeType = 'pointRank/create';        
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
        },
        handleView (src) {
            this.avatarViewUrl = src;
            this.visible = true;
        },
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess (response, file) {
            if(response&&response&&response.success) {
                file.name = response.result.fileName;
                file.url = this.baseUrl + '/' + response.result.filePath;
                this.editModel.avatar = file.name;
            }
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件[' + file.name + ']格式错误, 请选择jpg、jpeg或png格式的文件.'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '文件大小超过限制',
                desc: '文件[' + file.name + ']太大了, 不能超过2M.'
            });
        },
        handleBeforeUpload () {
            // 删除数组所有元素
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(0, fileList.length);

            const check = this.uploadList.length < 1;
            if (!check) {
                this.$Notice.warning({
                    title: '只能上传一张图片.'
                });
            }
            return check;
        }
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
    }
}
</script>

<style>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .zindex-top{
        z-index: 999999;
    }
</style>
