<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-tag"></i> 导航管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--搜索-->
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="导航名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="success" @click="handleAdd()" id="addBtn" icon="el-icon-roundadd">添加</el-button>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column type="index" prop="id" label="ID" width="55" align="center">
                </el-table-column>
                <el-table-column prop="typeNavName" label="导航名">
                    <template #default="scope">{{scope.row.typeNavName}}</template>
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
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="导航名">
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
                <el-form-item label="导航名">
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
        name: "typetable",
        data() {
            return {
            };
        },
        setup() {
            const query = reactive({
                name: "",
            });
            const tableData = ref([]);
            // 获取表格数据
            const getData = () => {
                axios({
                    method:'get',
                    url: '/leyuna/tagType/getTypeNav',
                    params: {
                        typeNavName: query.name
                    }
                }).then((res) =>{
                    var data = res.data;
                    if(data.status){
                        tableData.value = res.data.data;
                    }else{
                        ElMessage.error(data.message);
                    }
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
                        url:"/leyuna/tagType/deleteTypeNav",
                        method:'POST',
                        params:{
                            typeNavId:tableData.value[index].id
                        }
                    }).then((res) =>{
                        var data = res.data;
                        if(data.status){
                            ElMessage.success("删除成功");
                            getData();
                        }else{
                            ElMessage.error(data.message);
                        }
                    })
                })
            };

            // 表格编辑时弹窗和保存
            const addVisible = ref(false);
            const editVisible = ref(false);
            let form = reactive({
                name: "",
                addName:"",
                typeNav:[],
            });
            let idx = -1;

            const handleAdd = () => {
                addVisible.value = true;
            };
            const saveAdd = () => {
                addVisible.value = false;
                axios({
                    url:'/leyuna/tagType/saveTypeNav',
                    method:'POST',
                    data: {
                        typeNavName:form.addName,
                    }
                }).then((res)=>{
                    var data = res.data;
                    if(data.status){
                        ElMessage.success('添加成功');
                        getData();
                    }else{
                        ElMessage.error(data.message);
                    }
                    idx= -1;
                })
            };

            const handleEdit = (index, row) => {
                idx = index;
                form.name=row.typeNavName;
                editVisible.value = true;
            };
            const saveEdit = () => {
                editVisible.value = false;
                var rowData=tableData.value[idx];
                axios({
                    url:'/leyuna/tagType/saveTypeNav',
                    method:'POST',
                    data: {
                        id:rowData.id,
                        typeNavName:form.name
                    }
                }).then((res)=>{
                    var data = res.data;
                    if(data.status){
                        ElMessage.success(`修改 ${rowData.typeNavName} [分类导航]成功`);
                        tableData.value[idx].typeNavName = form.name;
                    }else{
                        ElMessage.error(data.message);
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
