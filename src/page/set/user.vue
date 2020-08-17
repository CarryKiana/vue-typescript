<template>
    <div class="user-index">
        <div class="user-nav">
            <span class="user-nav__title">账号管理</span>
            <button @click="$router.push('user-edit')" class="user-nav__add fr-mg10">新建账号</button>
        </div>

        <div class="user-content">
            <div class="list-select-down pd15">
                <el-select v-model="query.userType" placeholder="选择账号类型" clearable @change="queryChange">
                    <el-option v-for="item in typeSelect" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="query.loginFlag" placeholder="选择账号状态" clearable @change="queryChange">
                    <el-option v-for="item in statusSelect" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <div class="search-box">

                    <el-input placeholder="请输入账号名称/ID" v-model="query.loginName" @keyup.enter.native="queryChange" clearable>
                    </el-input>
                    <i class="btn-clearall"></i>
                    <i class="icon-search" @click="queryChange"></i>
                </div>
            </div>
            <div class="content-wrap">
                <div class="gcloud-table">
                    <el-table :data="tableData.list" stripe>
                        <el-table-column prop="loginName" label="账号" min-width="100">
                        </el-table-column>
                        <el-table-column prop="userType" label="账号类型" min-width="100">
                            <template slot-scope="scope">{{ scope.row.userType | userTypeFilter }}</template>
                        </el-table-column>
                        <el-table-column prop="createDate" label="开通时间">
                        </el-table-column>
                        <el-table-column prop="loginFlag" label="账号状态" width="112">
                            <template slot-scope="scope">{{ scope.row.loginFlag == 1 ? '启用' : '暂停' }}</template>
                        </el-table-column>
                        <el-table-column label="操作" width="240">
                            <template slot-scope="scope">
                                <span class="handle" @click="$router.push({path: 'user-edit', query: {id: scope.row.id}})">修改</span>
                                <span class="handle-red" @click="del(scope.row.id, scope.row.loginName)">删除</span>
                                <i class="handle-line"></i>
                                <span class="handle-red" @click="onStatus(scope.row.id, scope.row.loginFlag == 0 ? 1 : 0, scope.row.loginName)">{{ scope.row.loginFlag == 1 ? '暂停使用' : '启动' }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="page-line" v-if="tableData.count">
                    <el-pagination class="page-box" :current-page="tableData.pageNo" background :page-size="tableData.pageSize" prev-text="上一页" @current-change="handleCurrentChange" next-text="下一页" layout="prev, pager, next,slot,jumper" :total="tableData.count">
                        <span class="page-info">共{{Math.ceil(tableData.count/10)}}页共{{tableData.count}}条信息</span>
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import user from '@/api/user';
@Component({
    filters: {
        userTypeFilter(val) {
            let tmp = {
                '1': '系统管理人员',
                '2': '投放管理人员',
                '3': '投放运营人员',
                '4': '广告代理商(暂时不上)',
                '5': '广告主'
            }
            return tmp[val]
        }
    }
})
export default class AIndex extends Vue {
    tableData = {
     list: []
    }
    query = {
        loginFlag: '',
        loginName: '',
        userType: '',
        pageNo: 1,
        pageSize: 10
    }
    // 下拉-账号类型
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
    }]
    // 下拉 - 账号状态
    statusSelect = [
    {
        label: '启用',
        value: 1
    },
    {
        label: '暂停',
        value: 0
    }]
    @Getter('user') user
    created(){
        this.getList()
    }
    // 搜索参数改变
    queryChange () {
        this.query.pageNo = 1;
        this.getList();
    }
    // 分页
    handleCurrentChange (val) {
        this.query.pageNo = val
        this.getList()
    }
    // 表格数据
    getList () {
        this.$api.user.getUserList(this.query).then(res => {
            if (res.ret == 0) {
                this.tableData = res.data
            } else {
                this.$gidMessage(res.msg);
            }
        });
    }
    del (id, name) {
        this.$confirm(`<p class="confirm-title">请确认是否删除</p><p>"${name}"账号?</p>`, '', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            cancelButtonText: '取消',
            cancelButtonClass: 'cancel-btn',
            confirmButtonClass: 'confirm-btn',
            customClass: 'confirm-self',
            center: true
            }).then(() => {
                this.$api.user.delete({
                    id,
                    operationUserId: this.user.userId
                }).then(res => {
                    if (res.ret == 0) {
                        this.$gidMessage(res.msg)
                        this.getList()
                    } else {
                        this.$gidMessage(res.msg);
                    }
                });
            }).catch(() => {
        });
    }
    onStatus(id, status, name) {
        this.$api.user.updateLoginFlag({
                id,
                loginFlag: status,
                operationUserId: this.user.userId
            }).then(res => {
            if (res.ret == 0) {
                this.$gidMessage(`修改成功,${name}账号${status == 1 ? '启用' : '暂停'}`)
                this.getList()
            } else {
                this.$gidMessage(res.msg);
            }
        });
    }
}
</script>

<style lang="scss">

.user-nav {
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    background: #FFFFFF;
    border-radius: 4px;
    &__title {
        font-weight: Bold;
        font-size: $titleFontSize;
        color: $titleFontColor;
    }
    &__add {
        width: 130px;
        height: 30px;
        text-align: center;
        background: none;
        border: 1px solid $baseRed;
        font-size: $baseFontSize;
        color: $baseRed;
        outline: none;
        cursor: pointer;
        &:hover {
            color: rgba(224, 81, 85, 0.7);
            border-color: rgba(224, 81, 85, 0.7);
        }
    }
}
.user-content {
    margin-top: 15px;
    padding: 0 20px 20px;
    background: #FFFFFF;
    border-radius: 4px;

}

.pd15 {
    padding: 15px 0;
}
.fr-mg10 {
    margin-top: 10px;
    float: right;
}
</style>

