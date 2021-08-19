<template>
    <div>
        <div class="crumbs">
        </div>
        <div class="container">
            <div id="main">
                <v-md-editor v-model="text" height="710px" disabled-menus="[]" @upload-image="handleUploadImage"></v-md-editor>
            </div>
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                text: ':grinning:',
            };
        },
        methods: {
            handleUploadImage(event, insertImage, files) {
                // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
                console.log(files);
                // 此处只做示例
                insertImage({
                    url:
                        'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1269952892,3525182336&fm=26&gp=0.jpg',
                    desc: '七龙珠',
                    // width: 'auto',
                    // height: 'auto',
                });
            },
        },
        setup(){
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
</style>