const Router = require('koa-router');
const path = require('path');
const join = path.join;
const fs = require('fs');
const ejs = require('ejs');
const fse = require('fs-extra');
const { hint, isFile, getPath, getTime, createFolder, createCss, getFileType, createHtml } = require('./util');

const router = new Router()

router.post('/upload', async (ctx,next) => {
 // const file = ctx.request.files.file;
 console.log(ctx.request.body.height)

})

module.exports = router;









