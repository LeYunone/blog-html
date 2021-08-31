<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-tag"></i> 标签管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--搜索-->
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="标签名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="success" @click="handleAdd()" id="addBtn" icon="el-icon-roundadd">添加</el-button>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center">
                    <template #default="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column prop="tagName" label="标签名">
                    <template #default="scope">{{scope.row.tagName}}</template>
                </el-table-column>
                <el-table-column label="使用次数">
                    <template #default="scope">{{ scope.row.useCount}}</template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template #default="scope">
                        <el-tag  :type="
                                scope.row.userStatus === 'hot'
                                    ? 'success' : 'danger'
                            ">{{ scope.row.userStatus }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="date" label="创建时间">
                    <template #default="scope">{{ scope.row.createTime}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="标签名">
                        <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 添加弹出框 -->
        <el-dialog title="添加" v-model="addVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="标签名">
                    <el-input v-model="form.addName"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveAdd">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
export default {
    name: "tagtable",
    setup() {
        const query = reactive({
            name: "",
            pageIndex: 1,
            pageSize: 10,
        });
        const tableData = ref([]);
        const pageTotal = ref(0);
        // 获取表格数据
        const getData = () => {
            axios({
                method:'get',
                url: '/leyuna/tagType/tags',
                params: {
                    pageIndex: query.pageIndex,
                    pageSize: query.pageSize,
                    conditionName: query.name
                }
            }).then((res) =>{
                tableData.value = res.data.listData;
                pageTotal.value=res.data.page.total || 50
            })
        };
        getData();

        // 查询操作
        const handleSearch = () => {
            query.pageIndex = 1;
            getData();
        };
        // 分页导航
        const handlePageChange = (val) => {
            query.pageIndex = val;
            getData();
        };

        // 删除操作
        const handleDelete = (index) => {
            // 二次确认删除
            ElMessageBox.confirm("确定要删除吗？", "提示", {
                type: "warning",
            }).then(() => {
                axios({
                    url:"/leyuna/tagType/deleteTagsAndTypes",
                    method:'GET',
                    params:{
                        tags:tableData.value[index].id
                    }
                }).then((res) =>{
                    console.log(res)
                    if(res.data.code=='200'){
                        ElMessage.success("删除成功");
                    }else{
                        ElMessage.error("刪除失敗");
                    }
                    getData();
                })
            })
            .catch(() => {});
        };

        // 表格编辑时弹窗和保存
        const addVisible = ref(false);
        const editVisible = ref(false);
        let form = reactive({
            name: "",
            addName:""
        });
        let idx = -1;

        const handleAdd = () => {
            addVisible.value = true;
        };
        const saveAdd = () => {
            addVisible.value = false;
            axios({
                url:'/leyuna/tagType/addTagsAndTypes',
                method:'post',
                params: {
                    tags:form.addName
                }
            }).then((res)=>{
                if(res.data.code=='200'){
                    ElMessage.success('添加成功');
                    getData();
                }else{
                    ElMessage.error(res.data.srcData);
                }
                idx= -1;
            })
        };

        const handleEdit = (index, row) => {
            idx = index;
            form.name=row.tagName;
            editVisible.value = true;
        };
        const saveEdit = () => {
            editVisible.value = false;
            var rowData=tableData.value[idx];
            axios({
                url:'/leyuna/tagType/updateTag',
                method:'post',
                params: {
                    id:rowData.id,
                    tagName:form.name
                }
            }).then((res)=>{
                if(res.data.code=='200'){
                    ElMessage.success(`修改 ${rowData.tagName} [标签]成功`);
                    tableData.value[idx].tagName = form.name;
                }else{
                    ElMessage.error(res.data.srcData);
                }
                idx= -1;
            })
        };

        return {
            addVisible,
            handleAdd,
            saveAdd,
            query,
            tableData,
            pageTotal,
            editVisible,
            form,
            handleSearch,
            handlePageChange,
            handleDelete,
            handleEdit,
            saveEdit,
        };
    },
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
#addBtn{
    float: right;
}
</style>
