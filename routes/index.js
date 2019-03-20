const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body');
const controllers = require('../controllers');

router.get('/', controllers.indexGet);
router.post('/', koaBody(), controllers.indexPost);

router.get('/login', controllers.loginGet);
router.post('/login', koaBody(), controllers.loginPost);

router.get('/admin', controllers.adminGet);
router.post('/admin/skills', koaBody(), controllers.skillsPost);
router.post('/admin/upload', koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + '/public/assets/img/products',
    },
  }), controllers.uploadPost);


module.exports = router;