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
            <div v-html="remarks" class="plugins-tips">
            </div>
            <div class="blogCss">
                <v-md-editor :include-level="[1,2,3,4]" v-model="blogContent" height="710px" disabled-menus="[]" @upload-image="handleUploadImage"></v-md-editor>
            </div>
            <div v-html="remarks" class="plugins-tips">

            </div>
            <el-button @click="editVisible = true" plain> - 保存 - </el-button>
        </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
        <el-form label-width="70px">
            <el-form-item label="标题:">
                <el-input v-model="title"></el-input>
            </el-form-item>
            <el-form-item label="前言:">
                <el-input :rows="6" type="textarea" v-model="remarks"></el-input>
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
        handleUploadImage(event, insertImage, files) {
            // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
            let file=files[0];
            console.log(files[0])
            let formData = new FormData();
            formData.append('file',files[0]);
            // console.log(file.name+"==="+file.size);
            axios({
                url:"/leyuna/server/updownimg",
                method:"POST",
                data:formData
            }).then((res) => {
                var data = res.data;
                if(data.status){
                    insertImage({
                        url: 'https://www.leyuna.xyz/image/'+data.data,
                        desc: files[0].name,
                        width: 'auto',
                        height: 'auto',
                    });
                }else{
                    ElMessage.error(data.message);
                }
                // 此处只做示例
            })
        },
        preText (pretext) {
            return pretext.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
        },
        saveEdit(){
            const blogId = this.$route.query.blogId;
            axios({
                url:"/leyuna/blog/edit",
                method: "POST",
                data:{
                    "title":this.title,
                    "blogContent":this.blogContent,
                    "remarks":this.preText(this.remarks),
                    "id":blogId,
                    blogType:1
                }
            }).then((res) =>{
                if(res.data.status){
                    ElMessage.success('发布成功');
                }else{
                    ElMessage.error(res.data.message);
                }
                this.$router.push({path:'blogIndex/blog',query:{blogId:blogId}});
            })
        },
        thisBlog(){
            const blogId = this.$route.query.blogId;
            axios({
                url:"/leyuna/blog/blog/"+blogId,
                method:"GET",
            }).then((res) =>{
                this.title=res.data.data.title;
                this.blogContent=res.data.data.blogContent;
                this.remarks=res.data.data.remarks;
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
