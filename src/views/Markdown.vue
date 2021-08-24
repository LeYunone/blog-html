<template>
    <div>
        <div class="crumbs">
        </div>
        <div class="container">
            <div id="main">
                <v-md-editor v-model="temp.text" height="710px" disabled-menus="[]" @upload-image="handleUploadImage"></v-md-editor>
            </div>
            <el-button class="editor-btn" type="primary" @click="openDia">提交</el-button>
        </div>


        <el-dialog title="选择分类和标签" v-model="dialogFormVisible">
            <el-form :model="temp">

                <el-form-item label="文章标题" :label-width="formLabelWidth">
                    <el-input v-model="temp.title" autocomplete="off" ></el-input>
                </el-form-item>

                <el-form-item label="文章标签" :label-width="formLabelWidth">
                    <el-tag
                            :key="tag"
                            closable
                            v-for="tag in dynamicTags"
                            :disable-transitions="false"
                            @close="handleClose(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                </el-form-item>

                <el-form-item label="文章分类" :label-width="formLabelWidth">
                    <el-cascader
                            v-model="temp.type"
                            :emitPath=false
                            :options="options"
                            :props="{ expandTrigger: 'hover' }"
                            :show-all-levels=false
                            ></el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { ref, reactive } from "vue";
    import { ElMessage, ElMessageBox } from "element-plus";
    import axios from "axios";
    import VueMarkdownEditor, { xss } from '@kangc/v-md-editor';
    export default {
        data() {
            return {
                formLabelWidth:'120px',
                inputVisible: false,
                inputValue: '',
                dynamicTags:[],
                temp:{
                    text: "",
                    title:"",
                    type:[],
                },
            };
        },
        methods: {
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

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

            submit() {
                const html = xss.process(VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(this.temp.text));
                axios({
                    url:"/leyuna/blog/addBlog",
                    method:"post",
                    data:{
                        "blogContent":html,
                        "type":this.temp.type[1],
                        "tags":this.dynamicTags,
                        "title":this.temp.title
                    }
                }).then((res) => {
                    if(res.data.code=='404'){
                        ElMessage.error(res.data.srcData);
                    }else{
                        ElMessage.success('发布成功');
                    }
                    this.$router.replace({
                        path:'/dashboard',
                        name: "dashboard"
                    })
                })
            },
        },


        setup(){
            let dialogFormVisible=ref(false);
            let options=ref([]);
            const openDia = () =>{
                axios({
                    url:"/leyuna/tagType/getTypeInNav",
                }).then((res)=>{
                    options.value=res.data.listData;
                    dialogFormVisible.value=true;
                })
            };
            return {
                options,
                openDia,
                dialogFormVisible,
            }
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
</style>