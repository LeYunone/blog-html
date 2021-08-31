<template>
    <div>
        <div class="crumbs">
        </div>
        <div class="container">
            <div id="main">
                <v-md-editor v-model="temp.text" :include-level="[1,2,3,4]" height="710px" disabled-menus="[]" @upload-image="handleUploadImage"></v-md-editor>
            </div>
            <el-button class="editor-btn" type="primary" @click="openDia">提交文章</el-button>
            <el-button class="editor-btn" type="primary" @click="addNotice=true">发布网站公告</el-button>
        </div>

        <el-dialog title="添加" v-model="addNotice">
            <el-form :model="temp">
                <el-form-item label="文章标题" :label-width="formLabelWidth">
                    <el-input v-model="temp.title" autocomplete="off" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addNotice = false">取 消</el-button>
                <el-button type="primary" @click="submitNotice">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加" v-model="dialogFormVisible">
            <el-form :model="temp">

                <el-form-item label="文章标题" :label-width="formLabelWidth">
                    <el-input v-model="temp.title" autocomplete="off" ></el-input>
                </el-form-item>
                <el-form-item label="前言" :label-width="formLabelWidth">
                    <el-input :rows="6" type="textarea" v-model="temp.remarks" autocomplete="off" ></el-input>
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
                    remarks:""
                },
                addNotice:false,
            };
        },
        methods: {
            preText (pretext) {
                return pretext.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
            },
            submitNotice(){
                axios({
                    url:"/leyuna/blog/addWebNotice",
                    method : "POST",
                    data:{
                        title:this.temp.title,
                        content:this.temp.text,
                        type:0,
                    }
                }).then((res)=>{
                    if(res.data.code=='200'){
                        ElMessage.success('发布成功');
                    }else{
                        ElMessage.error(res.data.srcData);
                    }
                    this.$router.replace({
                        path:'/dashboard',
                        name: "dashboard"
                    })
                })
            },
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
                    if(res.data.code=='200'){
                        insertImage({
                            url:
                                'https://leyuna.xyz/img/'+res.data.srcData,
                            desc: files[0].name,
                            width: 'auto',
                            height: 'auto',
                        });
                    }else{
                        ElMessage.error(res.data.srcData);
                    }
                    // 此处只做示例
                })
            },

            submit() {
                // const html = xss.process(VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(this.temp.text));
                axios({
                    url:"/leyuna/blog/addBlog",
                    method:"post",
                    data:{
                        "blogContent":this.temp.text,
                        "type":this.temp.type[1],
                        "tags":this.dynamicTags,
                        "title":this.temp.title,
                        "remarks":this.preText(this.temp.remarks),
                    }
                }).then((res) => {
                    if(res.data.code=='200'){
                        ElMessage.success('发布成功');
                    }else{
                        ElMessage.error(res.data.srcData);
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