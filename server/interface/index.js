const Router = require('koa-router');
const path = require('path');
const join = path.join;
const fs = require('fs');
const ejs = require('ejs');
const fse = require('fs-extra');
const { hint, isFile, getPath, getTime, createFolder, createCss, getFileType, createHtml } = require('./util');

const router = new Router()

router.post('/upload', async (ctx,next) => {
    //上传文件
    const file = ctx.request.files.file;
    //截图高度;
    const cuttingImgHeight = Number(ctx.request.body.height);
    //项目名;
    const projectName = ctx.request.body.name;
    //项目路径;
    const projectPath = ctx.request.body.path;
    //图片类型;
    const imgType = ctx.request.body.type;
    //图片压缩值;
    const imgQuality = Number(ctx.request.body.quality);
    //切割数组;
    const cuttingArray = JSON.parse(ctx.request.body.screenshot);
    //图片路径;
    const projectImgLink = ctx.request.body.link;

    //获取文件路径;
    const filePath = path.join(file.path, file.name);
    //生成项目完整路径;
    const createProjectPath = path.join(projectPath, projectName);

    //创建文件夹;
    if (isFile(createProjectPath) ){
        console.log('已创建项目目录！');
        return ;
    }

    await createFolder(join(createProjectPath, "css"), "css");
    await createFolder(join(createProjectPath, "images"), "images");
    await createFolder(join(createProjectPath, "js"), "js");
    await createCss(createProjectPath);
    await createHtml({
        name: projectName,
        path: createProjectPath,
        link: projectImgLink,
        imgArr: cuttingArray,
        cropHeight: cuttingImgHeight
    });


})

module.exports = router;
