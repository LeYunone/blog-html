<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>markdown编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="plugins-tips">
                mavonEditor：基于Vue的markdown编辑器。
                访问地址：<a href="https://github.com/hinesboy/mavonEditor" target="_blank">mavonEditor</a>
            </div>
            <div id="main">
                <mavon-editor v-model="value"/>
            </div>
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
        </div>
    </div>
</template>

<script>
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
</style>