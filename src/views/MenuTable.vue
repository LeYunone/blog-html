<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-tag"></i> 分类管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tree
                    :data="dataSource"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    :expand-on-click-node="false"
            >
                <template #default="{ node, data }">
                        <span class="custom-tree-node">
                          <span>{{ node.label }}</span>
                          <span>
                            <a @click="append(data)"> Append </a>
                            <a style="margin-left: 8px" @click="remove(node, data)"> Delete </a>
                          </span>
                        </span>
                </template>
            </el-tree>
        </div>

        <!-- 添加弹出框 -->
        <el-dialog title="添加" v-model="addVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="菜单名">
                    <el-input v-model="form.menuName"></el-input>
                </el-form-item>
                <el-form-item label="菜单路径">
                    <el-input v-model="form.menuUrl"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addNode">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {reactive, ref} from 'vue'
    import axios from "axios";
    import {ElMessage, ElMessageBox} from 'element-plus'


    interface Tree {
        id: number
        label: string
        children?: Tree[]
    }

    export default {
        data() {
            return {
                form:{
                    menuName: "",
                    menuUrl: ""
                },
                addVisible:false,
                currentNode:ref<Tree[]>(),
                dataSource : ref<Tree[]>()
            }
        },
        mounted:function(){
            this.getTree();
        },
        methods:{
            append(data : Tree){
                this.addVisible = true;
                this.currentNode = data
            },
            remove(node: Node, data: Tree){
                axios({
                    method:'POST',
                    url:'/leyuna/menu/delete',
                    params:{
                        "menuId":data.id
                    }
                }).then((res) =>{
                    var data = res.data;
                    if (data.status) {
                        this.getTree();
                        ElMessage.success("删除成功");
                    } else {
                        ElMessage.error(data.message);
                    }
                })
            },
            addNode(){
                var menuParentId = this.currentNode.id;
                var menuName = this.form.menuName;
                var menuUrl = this.form.menuUrl;
                axios({
                    method:'POST',
                    url:'/leyuna/menu/save',
                    data:{
                        "menuParentId":menuParentId,
                        "menuName":menuName,
                        "menuUrl":menuUrl,
                        "menuPosition":0
                    }
                }).then((res)=>{
                    var data = res.data;
                    if (data.status) {
                        const newChild = {id: data.data, label: menuName, children: []}
                        if (!this.currentNode.children) {
                            this.currentNode.children = []
                        }
                        this.currentNode.children.push(newChild)
                        this.addVisible = false;
                        ElMessage.success("添加成功");
                    } else {
                        ElMessage.error(data.message);
                    }
                })
            },
            getTree(){
                axios({
                    method: 'GET',
                    url: '/leyuna/menu/getMenuTree',
                }).then((res) => {
                    var data = res.data;
                    if (data.status) {
                        this.dataSource = data.data
                        console.log(data.data)
                    } else {
                        ElMessage.error(data.message);
                    }
                })
            }
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

    #addBtn {
        float: right;
    }
</style>
