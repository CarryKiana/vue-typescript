<template>
    <div class="user-edit">
        <div class="edit-nav">
            <router-link to="/user" tag="a">账号列表</router-link> >{{queryId? '编辑':'新增'}}账号
        </div>
        <div class="eidt-form">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="账号类型" prop="userType">
                    <el-radio-group v-model="ruleForm.userType" @change="onradio" :disabled="!!queryId">
                        <el-radio v-for="item in typeSelect" :key="item.id" :label="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="关联广告主" prop="advertiserId" v-if="ruleForm.userType == 5">
                    <el-select v-model="ruleForm.advertiserId" placeholder="请选择关联广告主" :disabled="!!queryId">
                        <el-option v-for="item in adList" :key="item.id" :label="item.advertiserName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <div class="analog-required">
                    <el-form-item label="账号名" prop="loginName">
                        <el-input v-model.trim="ruleForm.loginName" :disabled="!!queryId"></el-input>
                    </el-form-item>
                </div>
                <div :class="this.queryId ? '' : 'analog-required'">
                    <el-form-item label="登录密码" prop="newPassword">
                        <el-input type="password" v-model.trim="ruleForm.newPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model.trim="ruleForm.checkPass"></el-input>
                    </el-form-item>
                </div>
                <!-- <div class="analog-required"> -->
                <el-form-item label="数据权限" prop="planIdArray" v-if="ruleForm.userType == 3">
                    <div class="form-tree">
                        <div class="form-tree__search">
                            <input class="input" v-model.trim="filterText" placeholder="请输入计划ID或计划关键词" type="text" />
                            <span class="search" @click="onFilter(filterText)">搜索</span>
                        </div>
                        <div class="from-tree__content">
                            <el-tree
                                :default-checked-keys="ruleForm.planIdArray"
                                class="filter-tree"
                                show-checkbox
                                node-key="id"
                                :data="data2"
                                :props="defaultProps"
                                default-expand-all
                                :filter-node-method="filterNode"
                                ref="tree2">
                            </el-tree>
                        </div>

                    </div>
                </el-form-item>
                <!-- </div> -->
                <div class="form-btn">
                    <button :disabled="saveloading" @click="submitForm('ruleForm')">保存</button>
                    <button class="cancel" @click="$router.push({path: '/user'})">取消</button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

var validateName = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入账号名'))
    } else {
        if (!/^1[3|4|5|7|8][0-9]{9}$/.test(value)) {
            callback(new Error('账号必须为手机号码'))
        } else {
            callback()
        }
    }
}
var validatePass = (rule, value, callback) => {
    if (this.queryId && value === '') {
        callback()
    } else {
        if (value === '') {
            callback(new Error('请输入密码'))
        } else {
            if (this.ruleForm.checkPass !== '') {
            } else if (!/(?=.*[a-z])(?=.*\d)(?=.*[#@!~%^&*])[a-z\d#@!~%^&*]{8,16}/i.test(value)) {
                callback(new Error("请设置8-16位包含字母、数字及特殊字符(如：#@!~%^&*)的密码"));
            }
            callback()
        }
    }
}
var validatePass2 = (rule, value, callback) => {
    if (this.queryId && this.ruleForm.newPassword == '') {
        callback()
    } else {
        if (value === '') {
            callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.newPassword) {
            callback(new Error('两次输入密码不一致!'))
        } else {
            callback()
        }
    }
}
var validateAd = (rule, value, callback) => {
    // if (this.ruleForm.userType == 5 && !this.queryId) {
    //     if (value == '') {
    //         callback(new Error('请选择广告主'))
    //     } else {
    //         callback()
    //     }
    // } else {
    //     callback()
    // }
    callback()
}
var validatePlan = (rule, value, callback) => {
    // if (this.ruleForm.userType == 3) {
    //     if (this.getCheckedKeys().length > 0) {
    //         callback()
    //     } else {
    //         callback(new Error('请选择数据权限'))
    //     }
    // } else {
    //     callback()
    // }
    callback()
}
interface RuleForm {
    loginName: string,
        userType: string,
        advertiserId: string | number,
        newPassword: string,
        checkPass: string,
        planIdArray: string
}

@Component
export default class UserEdit extends Vue {
    queryId = ''
    filterText = ''
    typeSelect = [
        {
            label: '系统管理人员',
            value: '1'
        },{
            label: '投放管理人员',
            value: '2'
        },
        {
            label: '投放运营人员',
            value: '3'
        },
        // {
        //     label: '广告代理商',
        //     value: '4'
        // },
        {
            label: '广告主',
            value: '5'
        }
    ]
    ruleForm: RuleForm = {
        loginName: '',
        userType: '',
        advertiserId: '',
        newPassword: '',
        checkPass: '',
        planIdArray: ''
    }
    rules = {
        loginName: [
            { validator: validateName, trigger: 'blur' }
        ],
        newPassword: [
            { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
            { validator: validatePass2, trigger: 'blur' }
        ],
        userType: [
            { required: true, message: '请选择账号类型', trigger: 'change' }
        ],
        advertiserId: [
            { validator: validateAd, trigger: 'change' }
        ],
        planIdArray: [
            { validator: validatePlan, trigger: 'change' }
        ]
    }
    data2 = []
    defaultProps = {
        children: 'children',
        label: 'label'
    }
    adList = []
    saveloading = false
    @Getter('user') user
    @Watch('filterText')
    filterTextCallback(val: string, oldVal: string) {
        this.onFilter(val)
    }
    data() {
        return {
            queryId : (this.$route.query && this.$route.query.id) || null
        }
    }
    created () {
        this.getAdList()
        this.getPlanList()
        this.queryId && this.getUserById()
    }
    onradio(val){
        this.ruleForm.advertiserId = ''
    }
    submitForm(formName) {
        this.$refs[formName]['validate']((valid) => {
            if (valid) {
            //alert('submit!');
            this.queryId ? this.edit() : this.add()
            } else {
            console.log('error submit!!');
            return false;
            }
        });
    }
    filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
    }
    onFilter(val) {
        this.$refs.tree2['filter'](val);
    }
    getCheckedKeys() {
    // console.log(this.$refs.tree2.getCheckedKeys());
        return this.$refs.tree2['getCheckedKeys']()
    }
    getPlanList () {
        this.$api.user.planList().then(res => {
            if (res.ret == 0) {
            this.data2 = res.data.map(item=> {
                return {
                    label: item.advertiserName,
                    children: item.planList.map(item => {
                        return {
                            id: item.planId,
                            label: item.planName
                        }
                    })
                }
            })
            } else {
                this.$gidMessage(res.msg);
            }
        });
    }
    getAdList () {
        this.$api.user.getAdList({onlyAuditPass: true, userId: this.user.userId}).then(res => {
            if (res.ret == 0) {
                this.adList = res.data
            } else {
                this.$gidMessage(res.msg || '出现错误请重试');
            }
        });
    }
    add () {
        this.saveloading = true
        this.$api.user.add({
            ...this.serializePlanIdArray(),
            operationUserId: this.user.userId
        }).then(res => {
            if (res.ret == 0) {
            this.$gidMessage('新建账号成功', true);
            this.$router.push({path: '/user'})
            } else {
            this.$gidMessage(res.msg);
            }
            this.saveloading = false
        });
    }
    edit () {
        this.saveloading = true
        this.$api.user.edit({
            ...this.serializePlanIdArray(),
            operationUserId: this.user.userId
        }).then(res => {
            if (res.ret == 0) {
            this.$gidMessage('修改成功', true)
            this.$router.push({path: '/user'})
            } else {
            this.$gidMessage(res.msg || '出现错误请重试');
            }
            this.saveloading = false
        })
    }
    getUserById () {
        this.$api.user.getUserById({
            id: this.queryId
        }).then(res => {
            if (res.ret == 0) {
            this.ruleForm = res.data
            this.ruleForm.advertiserId = Number(this.ruleForm.advertiserId)
            //this.$refs.tree2.setCheckedKeys(this.ruleForm.planIdArray)
            } else {
            this.$gidMessage(res.msg || '出现错误请重试');
            }
        })
    }
    // 处理数据权限
    serializePlanIdArray () {
        let tmp = {...this.ruleForm}
        if (+tmp.userType === 2) {
            tmp.planIdArray = this.getAllplanId(this.data2).join()
        } else if(+tmp.userType === 3) {
            tmp.planIdArray = this.getCheckedKeys().filter(item => {
                return item !== undefined
            }).join()
        }
        return tmp
    }
    getAllplanId(data) {
        let tmpArr = []
        for(let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].children.length; j++) {
            tmpArr.push(data[i].children[j].id)
            }
        }
        return tmpArr
    }
}
</script>

<style lang="scss" scoped>
.user-edit {
    padding: 20px;
    background: #fff;
}
.edit-nav {
    background: $navbg;
    height: 50px;
    font-size: 16px;
    color: $baseFontColor;
    letter-spacing: 0.27px;
    line-height: 50px;
    a {
        padding-left: 20px;
        color: $baseRed;
    }
}
.eidt-form {
    padding: 40px 146px 0;
    .analog-required {
        /deep/ .el-form-item .el-form-item__label:before {
            content: '*';
            color: #f56c6c;
            margin-right: 4px;
        }
    }
    .form-tree {
        min-height: 320px;
        width: 650px;
        border: 1px solid $grey;
        padding: 0 20px;
        &__search {
            position: relative;
            height: 59px;
            line-height: 59px;
            border-bottom: 1px solid $grey;
            .input {
                outline: none;
                width: 260px;
                height: 32px;
                padding: 0 60px 0 10px;
                background: #FFFFFF;
                border: 1px solid $grey;
            }
            .search {
                position: absolute;
                left: 280px;
                color: #0058E6;
                letter-spacing: 0.17px;
                cursor: pointer;
            }
        }

    }
    .form-btn {
        border-top: 1px solid $grey;
        margin-top: 40px;
        padding-top: 26px;
        text-align: center;
        button {
            background: #3A78FF;
            border-radius: 5px;
            width: 120px;
            height: 36px;
            color: #fff;
            text-align: center;
            line-height: 36px;
            border: 0;
            cursor: pointer;
            outline: none;
            &.cancel {
                background: #BDCCD9;
            }
            &:hover {
                opacity: 0.7;
            }
        }

        button + button {
            margin-left: 15px;
        }
    }
    /deep/ .el-select {
        height: 32px;
        line-height: 30px;
    }
    /deep/ .el-input__inner {
        height: 30px;
        width: 300px;
        border-radius: 0;

    }
}
</style>
