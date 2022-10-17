<template>
    <div>
        <div class="crumbs">
        </div>
        <div class="container">
            <div id="main">
                <v-md-editor v-model="temp.text"
                             :include-level="[1,2,3,4]"
                             left-toolbar="undo redo clear |
                             h bold italic strikethrough quote |
                             ul ol table hr |
                             link image code emoji emoToolbar |"
                             :toolbar="toolbar"
                             height="710px"
                             disabled-menus="[]"
                             @upload-image="handleUploadImage"></v-md-editor>
            </div>
            <el-button class="editor-btn" type="primary" @click="addArticle=true">提交文章</el-button>
            <el-button class="editor-btn" type="primary" @click="addNotice=true">发布网站公告</el-button>
            <el-button class="editor-btn" type="primary" @click="addAnime=true">ANIME</el-button>
        </div>

        <el-dialog title="添加" v-model="addNotice">
            <el-form :model="temp">
                <el-form-item label="文章标题" :label-width="formLabelWidth">
                    <el-input v-model="temp.title" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addNotice = false">取 消</el-button>
                <el-button type="primary" @click="submit(2)">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog
                title="emo"
                v-model="emoDia"
                width="36%"
                center>
            <el-image v-for="item in emoImg"
                      style="width: 60px; height: 60px;margin: 9px"
                      :src="item.fileUrl"
                      @click="markEmoImg(item.fileUrl)"
                      fit="contain"></el-image>
        </el-dialog>

        <el-dialog title="添加" v-model="addAnime">
            <el-form :model="temp">
                <v-md-editor v-model="temp.foreword"
                             :include-level="[1,2,3,4]"
                             left-toolbar="undo redo clear |
                             h bold italic strikethrough quote |
                             ul ol table hr |
                             link image code emoji emoToolbar |"
                             :toolbar="toolbar"
                             height="400px"
                             disabled-menus="[]"
                             @upload-image="handleUploadImage"/>
                <el-form-item label="文章标题" :label-width="formLabelWidth">
                    <el-input v-model="temp.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="第三方链接" :label-width="formLabelWidth">
                    <el-input v-model="temp.link" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="addAnime = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加" v-model="addArticle">
            <el-form :model="temp">
                <el-form-item label="文章标题" :label-width="formLabelWidth">
                    <el-input v-model="temp.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="前言" :label-width="formLabelWidth">
                    <v-md-editor v-model="temp.foreword"
                                 :include-level="[1,2,3,4]"
                                 left-toolbar="undo redo clear |
                             h bold italic strikethrough quote |
                             ul ol table hr |
                             link image code emoji emoToolbar |"
                                 :toolbar="toolbar"
                                 height="400px"
                                 disabled-menus="[]"
                                 @upload-image="handleUploadImage"></v-md-editor>
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
                <el-form-item>
                    <el-select class="main-select-tree" ref="selectTree" v-model="value" style="width: 560px;">
                        <el-option v-for="item in formatData(menuTree)" :key="item.value" :label="item.label"
                                   :value="item.value" style="display: none;"/>
                        <el-tree class="main-select-el-tree" ref="selecteltree"
                                 :data="menuTree"
                                 node-key="id"
                                 highlight-current
                                 :props="defaultProps"
                                 @node-click="handleNodeClick"
                                 :current-node-key="value"
                                 :expand-on-click-node="expandOnClickNode"
                                 default-expand-all/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="addArticle">
                <el-button @click="addArticle = false">取 消</el-button>
                <el-button type="primary" @click="submit(1)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {ref, reactive} from "vue";
    import {ElMessage, ElMessageBox} from "element-plus";
    import axios from "axios";

    export default {
        data() {
            let self = this
            return {
                menuTree: "",
                addAnime: false,
                emoDia: false,
                toolbar: {
                    emoToolbar: {
                        icon: 'el-icon-chat-line-round',
                        title: '表情包',
                        action() {
                            self.getEmoList();
                        },
                    },
                },
                emoImg: [],
                formLabelWidth: '120px',
                inputVisible: false,
                inputValue: '',
                dynamicTags: [],
                temp: {
                    text: "",
                    title: "",
                    type: [],
                    foreword: "",
                    link: "",
                    cover: ""
                },
                addNotice: false,
                addArticle: false,
                value: "",
                expandOnClickNode: true,
                options: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            };
        },
        mounted: function () {
            this.getTree();
            this.thisBlog();
        },
        methods: {
            // 四级菜单
            formatData(data) {
                let options = [];
                data.forEach((item, key) => {
                    options.push({label: item.label, value: item.id});
                    if (item.children) {
                        item.children.forEach((items, keys) => {
                            options.push({label: items.label, value: items.id});
                            if (items.children) {
                                items.children.forEach((itemss, keyss) => {
                                    options.push({label: itemss.label, value: itemss.id});
                                    if (itemss.children) {
                                        itemss.children.forEach((itemsss, keysss) => {
                                            options.push({label: itemsss.label, value: itemsss.id});
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
                return options;
            },
            handleNodeClick(node) {
                this.value = node.id;
                this.$refs.selectTree.blur();
            },
            //添加表情包到mark中
            markEmoImg(emo) {
                document.execCommand('insertText', false, "![emo](" + emo + "){{{width=\"100\" height=\"100\"}}}")
                this.emoDia = false;
            },
            //获得服务器表情包
            getEmoList() {
                axios({
                    url: "/leyuna/file/list",
                    method: "GET",
                    params:{
                        "fileType":2
                    }
                }).then((res) => {
                    var data = res.data;
                    if (data.status) {
                        this.emoImg = data.data;
                    } else {
                        ElMessage.error(data.message);
                    }
                    console.log(this.emoImg)
                })
                this.emoDia = true;
            },
            preText(pretext) {
                return pretext.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
            },
            submit(type) {
                const blogId = this.$route.query.blogId;
                axios({
                    url: "/leyuna/blog/saveBlog",
                    method: "POST",
                    data: {
                        "id":blogId,
                        "blogContent": this.temp.text,
                        "tags": this.dynamicTags,
                        "title": this.temp.title,
                        "menuId":this.value,
                        "foreword": this.temp.foreword,
                        blogType: type
                    }
                }).then((res) => {
                    var data = res.data;
                    if (data.status) {
                        ElMessage.success('发布成功');
                    } else {
                        ElMessage.error(data.message);
                    }
                    this.$router.replace({
                        path: '/dashboard',
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
                let formData = new FormData();
                formData.append('file', files[0]);
                formData.append("type", "1");
                // console.log(file.name+"==="+file.size);
                axios({
                    url: "/leyuna/file/upload",
                    method: "POST",
                    data: formData
                }).then((res) => {
                    var data = res.data;
                    if (data.status) {
                        insertImage({
                            url: data.data.url,
                            desc: files[0].name,
                            width: 'auto',
                            height: 'auto',
                        });
                    } else {
                        ElMessage.error(data.message);
                    }
                })
            },
            getTree() {
                axios({
                    method: 'GET',
                    url: '/leyuna/menu/getMenuTree',
                }).then((res) => {
                    var data = res.data;
                    if (data.status) {
                        this.menuTree = data.data
                        console.log(this.menuTree)
                    } else {
                        ElMessage.error(data.message);
                    }
                })
            },
            thisBlog() {
                const blogId = this.$route.query.blogId;
                if(blogId){
                    axios({
                        url: "/leyuna/blog/blog/" + blogId,
                        method: "GET",
                    }).then((res) => {
                        var data = res.data;
                        if(data.status){
                            this.temp.title = data.data.title;
                            this.temp.text = data.data.blogContent;
                            this.temp.foreword = data.data.foreword;
                            this.value = data.data.menuId
                        }
                    })
                }
            },
        },
    }
</script>
<style>
    .editor-btn {
        margin-top: 20px;
    }

    .main-select-el-tree .el-tree-node .is-current > .el-tree-node__content {
        font-weight: bold;
        color: #409eff;
    }

    .main-select-el-tree .el-tree-node.is-current > .el-tree-node__content {
        font-weight: bold;
        color: #409eff;
    }

    .blog_cover_upload .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 100px;
        height: 100px;
    }

    .blog_cover_upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 100px;
        height: 100px;
    }
</style>
