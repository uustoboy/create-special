'use strict';

const log = console.log;
const path = require('path');
const join = path.join;
const resolve = path.resolve;
const fs = require('fs');
const fse = require('fs-extra');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const ejs = require('ejs');
const handlebars = require('handlebars');
//提示；
let hint = {
    info (info) {
        log(logSymbols.info, chalk.whiteBright(chalk.bgBlue(` ${info} `)));
    },
    success (success) {
        log(logSymbols.success, chalk.whiteBright(chalk.bgGreen(` ${success} `)));
    },
    warning (warn) {
        log(logSymbols.warning, chalk.whiteBright(chalk.bgYellow(` ${warn} `)));
    },
    error (error) {
        log(logSymbols.error, chalk.red(error));
    }
}
module.exports.hint = {
    ...hint
}

//判断文件/文件夹 是否存在;
module.exports.isFile = ( _path ) => fse.pathExistsSync( _path )?true:false;

//返回绝对路径；
module.exports.getPath = ( _path ) => resolve( process.cwd(),_path?_path:'/' );

//返回时间戳;
module.exports.getTime = () =>{
    let fillZero = ( num )=>{ return num > 9 ? num :'0'+num; }
    let date = new Date();
    let year = date.getFullYear();
    let month = fillZero( (date.getMonth()+1) );
    let day = fillZero( date.getDate() );
    let hour = fillZero( date.getHours() );
    let minute = fillZero( date.getMinutes() );
    let second = fillZero( date.getSeconds() );
    let time = `${year}/${month}/${day} ${hour}:${minute}:${second}`;
    return time;
}


//文件类型;
module.exports.getFileType = ( file,type )=>{
    let fileType,
    regType = /\.[^\.]+$/;
    if( regType.exec(file)){
         fileType = regType.exec(file)[0];
    }else{
        fileType = null;
    }
    let fileType2 = fileType?fileType.replace(/^\./,''):null;
    let fileName = fileType ?  file.replace(fileType,''): file;
    let isType = type && type == fileType2  ? true : false;
    let fillFile = null;
    if( type ){
        if( fileType ){
            if( isType ){
                fillFile = file;
            }else{
                fillFile = file.replace( fileType2 ,type);
            }
        }else{
            fillFile = `${file}.${type}`;
        }
    }else{
        fillFile = file;
    }
    let fileComplete =  /[^\/]+$/gi.exec(fillFile)[0];
    let lastPath = fillFile.replace(/[^\/]+$/gi,'');
    return {
        fileName,
        fileType,
        isType,
        fillFile,
        fileComplete,
        lastPath
    };
}



//创建文件夹；
module.exports.createFolder = (cmd, txt) => {
    fse.ensureDir(cmd).then(() => {
        hint.success(`${txt} 文件夹创建!`);
    }).catch((err) => {
        hint.error(err);
    });
}

//创建CSS;
module.exports.createCss = (cmd) => {
    let originalBaseCss = join(__dirname, 'templates/H5.css');
    let createBaseCss = join(cmd, 'css', 'H5.css');
    fse.readFile(originalBaseCss, 'utf8').then(data => {
        fs.writeFile(createBaseCss, data, () => {
            hint.success(`H5.css 文件创建完成!`);
        });
    });
}

//创建HTML;
module.exports.createHtml = (answers, cmd, option) => {

    let templateHtml = join(__dirname, '/templates/','index.html');
    let newHtmlPath = join(answers.path,'index.html');

    fse.readFile(templateHtml, 'utf8').then((data) => {
        let arrImgHtml = [];
        let iNum = 0;
        for (let i = 0; i < answers.imgArr.length;i++){
            if (answers.imgArr[i].dragBtn ){
                if (answers.imgArr[i].dragHeight > answers.cropHeight ){
                    let mulriple = Math.ceil(answers.imgArr[i].dragHeight / answers.cropHeight);
                    for (let j = 0; j < mulriple; j++) {
                        iNum++;
                        arrImgHtml.push(`<img src="${answers.link}/images/${answers.name}-${iNum}.${answers.imgType}"/>`);
                    }
                }else{
                    iNum++;
                    arrImgHtml.push(`<img src="${answers.link}/images/${answers.name}-${iNum}.${answers.imgType}"/>`);
                }
            }else{
                iNum++;
                arrImgHtml.push(`<div class="rel"><img src="${answers.link}/images/${answers.name}-${iNum}.${answers.imgType}"/><a href="#" class="special-href"></a></div>`);
            }

        }
        let cssPath = `<link href="${answers.link}/css/H5.css" rel = "stylesheet" type = "text/css" />`;
        let tpl = {
            cssPath: cssPath,
            arrImgHtml: arrImgHtml
        }
        const result = handlebars.compile(data)(tpl);
        fs.writeFile(newHtmlPath, result, () => {
            hint.success(`html 文件创建完成!`);
        });
    })
};
