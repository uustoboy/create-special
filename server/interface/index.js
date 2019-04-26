const Router = require('koa-router');
const path = require('path');
const join = path.join;
const fs = require('fs');
const ejs = require('ejs');
const fse = require('fs-extra');
const { hint, isFile, getPath, getTime, createFolder, createCss, getFileType, createHtml } = require('./util');
const router = new Router();
const Jimp = require('jimp');

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
        hint.warning('已创建项目目录！');
        return ctx.body = {
                    code: 1,
                    data:{
                        text: '已创建项目目录！'
                    }
                };
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
        cropHeight: cuttingImgHeight,
        imgType: imgType
    });

    await forCrop({
        file,
        cuttingImgHeight,
        projectName,
        projectPath,
        imgType,
        imgQuality,
        cuttingArray,
        projectImgLink,
        filePath,
        createProjectPath
    });

    ctx.body = {
        code: 1,
        data:{
            text: `创建项目${projectName}完成！`
        }
    };


})

let forCrop = async ( imgObj ) => {

    let iNum = 0;
    let createImgPath = '';
    for (let i = 0; i < imgObj.cuttingArray.length; i++) {
        if ( imgObj.cuttingArray[i].dragBtn ) {
            if( imgObj.cuttingArray[i].dragHeight > imgObj.cuttingImgHeight ){
                let mulriple = Math.ceil(imgObj.cuttingArray[i].dragHeight / imgObj.cuttingImgHeight);
                for (var j = 0; j < mulriple; j++) {
                  iNum = iNum + 1;
                  createImgPath = join(imgObj.createProjectPath,'images',`${imgObj.projectName}-${iNum}.${imgObj.imgType}`);
                  
                  await cropImage({
                        filePath: imgObj.file.path,
                        type : imgObj.imgType,
                        createImgPath : createImgPath,
                        cuttingArray : imgObj.cuttingArray[i],
                        quality : imgObj.imgQuality,
                        mulriple : j,
                        cropHeight : imgObj.cuttingImgHeight,
                        cuttingArrayEnd : (j == (mulriple-1)) ? true : false
                    });
                }
            }else{
                iNum = iNum + 1;
                createImgPath = join(imgObj.createProjectPath,'images',`${imgObj.projectName}-${iNum}.${imgObj.imgType}`);
                await cropImage({
                        filePath: imgObj.file.path,
                        type : imgObj.imgType,
                        createImgPath : createImgPath,
                        cuttingArray : imgObj.cuttingArray[i],
                        quality : imgObj.imgQuality,
                        mulriple : j,
                        cropHeight : imgObj.cuttingImgHeight,
                        cuttingArrayEnd : false
                    });
            }
        } else{
            iNum = iNum + 1;
            createImgPath = join(imgObj.createProjectPath,'images',`${imgObj.projectName}-${iNum}.${imgObj.imgType}`);
            await cropImage({
                        filePath: imgObj.file.path,
                        type : imgObj.imgType,
                        createImgPath : createImgPath,
                        cuttingArray : imgObj.cuttingArray[i],
                        quality : imgObj.imgQuality,
                        cropHeight : imgObj.cuttingImgHeight
                    });
        }
    }

    

}

let cropImage = async ( cropImage ) => {
    await Jimp.read(cropImage.filePath)
          .then(lenna => {
            let path = cropImage.createImgPath;
            let jimpWidth = lenna.bitmap.width;
            let dragBtn = cropImage.cuttingArray.dragBtn;
            let dragTop = cropImage.cuttingArray.dragTop;
            let dragHeight = cropImage.cuttingArray.dragHeight;
            let end = cropImage.cuttingArrayEnd;
            let mulripleNum = cropImage.mulriple;
            let cropHeight = cropImage.cropHeight;
            let quality = cropImage.quality;

            if( dragBtn ){
                if( end ){
                    let endCropHight = Math.abs(
                      dragTop +
                      dragHeight -
                      (mulripleNum * cropHeight + dragTop)
                    );
                    let endCropY = Math.abs(
                      dragTop + dragHeight - endCropHight
                    );
                    lenna
                      .crop(0, endCropY, jimpWidth, endCropHight)
                      .quality(quality)
                      .write(path); // save
                    hint.success(`创建${path}成功！`);
                }else{
                    if( dragHeight > cropHeight ) {
                            lenna
                                .crop(
                                  0,
                                mulripleNum * cropHeight + dragTop,
                                  jimpWidth,
                                  cropHeight
                                )
                                .quality(quality)
                                .write(path); // save
                            hint.success(`创建${path}成功！`);
                        } else {
                          lenna
                            .crop(0, dragTop, jimpWidth, dragHeight)
                            .quality(quality)
                            .write(path); // save
                          hint.success(`创建${path}成功！`);
                        }
                }
            }else{
                //x,y,w,h
                lenna
                    .crop(0, dragTop, jimpWidth, dragHeight)
                    .quality(quality)
                    .write(path); // save
                    
                hint.success(`创建${path}成功！`);
            }
            
          })
          .catch(err => {
            console.error(err);
          });
    
}

module.exports = router;
