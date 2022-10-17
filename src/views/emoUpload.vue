<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表情包上传
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="content-title">支持拖拽</div>
            <div class="plugins-tips">
                站内使用表情
            </div>
            <el-upload list-type="picture" :data="emoData" action="/leyuna/file/upload"
                       :file-list="files" class="upload-demo" drag
                       multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <template #tip>
                    <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 500kb</div>
                </template>
            </el-upload>
        </div>
    </div>
</template>

<script>
    export default {
        name: "emoUpload",
        data() {
            return {
                emoData: {
                    type: "2"
                },
                files: [],
            }
        },
        methods: {}
    };
</script>

<style scoped>
    .content-title {
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
</style>
