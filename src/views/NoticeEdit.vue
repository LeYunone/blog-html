<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 公告
                </el-breadcrumb-item>
                <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-main">
            <div class="blogCss">
                <v-md-editor :include-level="[1,2,3,4]" v-model="content" height="710px" disabled-menus="[]"
                             @upload-image="handleUploadImage"></v-md-editor>
            </div>
            <el-button @click="editVisible = true" plain> - 保存 -</el-button>
        </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
        <el-form label-width="70px">
            <el-form-item label="标题:">
                <el-input v-model="title"></el-input>
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
    import {ref, reactive} from "vue";
    import {ElMessage, ElMessageBox} from "element-plus";
    import axios from "axios";

    export default {
        data() {
            return {
                title: "",
                content: "",
                editVisible: false
            };
        },
        mounted: function () {
            this.thisNotice();//需要触发的函数
        },
        methods: {
            handleUploadImage(event, insertImage, files) {
                // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
                let file = files[0];
                console.log(files[0])
                let formData = new FormData();
                formData.append('file', files[0]);
                formData.append("type","1");
                axios({
                    url: "/leyuna/server/updownimg",
                    method: "POST",
                    data: formData
                }).then((res) => {
                    var data = res.data;
                    if (data.status) {
                        insertImage({
                            url: data.data,
                            desc: files[0].name,
                            width: 'auto',
                            height: 'auto',
                        });
                    } else {
                        ElMessage.error(data.message);
                    }
                })
            },
            saveEdit() {
                const noticeId = this.$route.query.noticeId;
                axios({
                    url: "/leyuna/blog/edit",
                    method: "POST",
                    data: {
                        "title": this.title,
                        "blogContent": this.content,
                        "id": noticeId,
                        "blogType": 2
                    }
                }).then((res) => {
                    var data = res.data;
                    if (data.status) {
                        ElMessage.success('发布成功');
                    } else {
                        ElMessage.error(data.message);
                    }
                    window.close();
                })
            },
            thisNotice() {
                const noticeId = this.$route.query.noticeId;
                axios({
                    url: "/leyuna/blog/blog/" + noticeId,
                    method: "GET",
                }).then((res) => {
                    var data = res.data;
                    this.title = data.data.title;
                    this.content = data.data.blogContent;
                })
            },
        },
        setup() {
            return {}
        },
    };
</script>

<style scoped>
    .blogCss {
        color: red;
    }

    .el-main {
        padding: 30px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin: 10px;
    }
</style>
