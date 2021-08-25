<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 博客
                </el-breadcrumb-item>
                <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-main">
            <div class="plugins-tips">
                {{remarks}}
            </div>
            <div class="blogCss">
                <v-md-editor :include-level="[1,2,3,4]" v-model="blogContent" height="710px" disabled-menus="[]" @upload-image="handleUploadImage"></v-md-editor>
            </div>
            <div class="plugins-tips">
                {{remarks}}
            </div>
            <el-button style="float:right;" @click="editVisible = true" plain> - 保存 - </el-button>
        </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
        <el-form label-width="70px">
            <el-form-item label="标题">
                <el-input v-model="title"></el-input>
            </el-form-item>
            <el-form-item label="前言/备注/tip">
                <el-input v-model="remarks"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
        </template>
    </el-dialog>


</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
export default {
    data() {
        return {
            title:"",
            blogContent:"",
            remarks:"",
            editVisible:false
        };
    },
    mounted:function(){
        this.thisBlog();//需要触发的函数
    },
    methods: {
        saveEdit(){
            const blogId = this.$route.query.blogId;
            axios({
                url:"/leyuna/blog/edit",
                method: "POST",
                data:{
                    "title":this.title,
                    "blogContent":this.blogContent,
                    "remarks":this.remarks
                }
            }).then((res) =>{

            })
        },
        thisBlog(){
            const blogId = this.$route.query.blogId;
            axios({
                url:"/leyuna/blog/blog/"+blogId,
                method:"GET",
            }).then((res) =>{
                this.title=res.data.objData.title;
                this.blogContent=res.data.objData.blogContent;
                this.remarks=res.data.objData.remarks;
            })
        },
    },
    setup(){
        return {
        }
    },
};
</script>

<style scoped>
    .blogCss{
        color:red;
    }
    .el-main{
        padding: 30px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin: 10px;
    }
</style>
