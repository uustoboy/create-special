const Router = request('koa-router')

const router = new Router({
  prefix: '/city'
})



router.get('/list', async (ctx) => {
  ctx.body = {
    list: ['北京', '上海', '菏泽']
  }
})








