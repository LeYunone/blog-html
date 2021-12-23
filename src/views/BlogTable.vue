<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-tag"></i> 文章管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--搜索-->
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="文章名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="success" @click="createDocument"  id="addBtn" icon="el-icon-roundadd">构建索引库</el-button>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center">
                    <template #default="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column prop="title" label="标题">
                    <template #default="scope">{{scope.row.title}}</template>
                </el-table-column>
                <el-table-column sortable prop="clickCount" label="点击量">
                    <template #default="scope">{{ scope.row.clickCount}}</template>
                </el-table-column>
                <el-table-column sortable prop="commentCount" label="评论量">
                    <template #default="scope">{{ scope.row.commentCount}}</template>
                </el-table-column>
                <el-table-column sortable prop="createTime" label="发布时间">
                    <template #default="scope">{{ scope.row.createTime}}</template>
                </el-table-column>
                <el-table-column sortable prop="updateTime" label="编辑时间">
                    <template #default="scope">{{ scope.row.updateTime}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-edit" @click="editBlog(scope.row)">编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
export default {
    name: "blogTable",
    methods:{
        editBlog(row){
            const { href }=this.$router.resolve({path:'/blogEdit',query:{blogId:row.id}});
            window.open(href, '_blank');
        },
        createDocument(){
            axios({
                url:"/leyuna/blog/createDocument",
                method:"POST"
            }).then((res) => {
                if(res.data.status){
                    ElMessage.success('创建成功');
                }else{
                    ElMessage.error(res.data.message);
                }
            })
        }
    },
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
                url: '/leyuna/blog/blogs',
                params: {
                    index: query.pageIndex,
                    size: query.pageSize,
                    conditionName: query.name
                }
            }).then((res) =>{
                tableData.value = res.data.data.records;
                pageTotal.value=res.data.data.total || 50
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

        // 表格编辑时弹窗和保存
        let form = reactive({
            name: "",
            addName:""
        });
        let idx = -1;

        return {
            query,
            tableData,
            pageTotal,
            form,
            handleSearch,
            handlePageChange,
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
