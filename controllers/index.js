const db = require('../models/db');
const psw = require('../libs/password');
const path = require('path');
const fs = require('fs');
const util = require('util');
const rename = util.promisify(fs.rename);

const indexGet = async (ctx, next) => {
  const products = db.productsDB().getState().products || [];
  const skills = db.skillsDB().getState().skills || [];

  ctx.render("pages/index", {
    products,
    skills
  });
};

const indexPost = async (ctx, next) => {
  const time = new Date().toUTCString().replace(/:/g, '-');
  db.emailDB().set(time, ctx.request.body).write();
  const products = db.productsDB().getState().products || [];
  const skills = db.skillsDB().getState().skills || [];

  ctx.render("pages/index", {
    products,
    skills,
    msgsemail: 'Данные успешно отправлены'
  });
};

const loginGet = async (ctx, next) => {
  ctx.render("pages/login");
};

const loginPost = async (ctx, next) => {
  const { email, password } = ctx.request.body;
  const user = db.adminDB().getState().user;
 
  if (user.email === email && psw.validPassword(password)) {
    ctx.session.isAuth = true;
    ctx.render("pages/admin", {
      msgslogin: 'Вход успешно выполнен'
    });
  } else {
    ctx.render("pages/login", {
      msgslogin: 'Неправильный email или пароль'
    });
  }
};

const adminGet = async (ctx, next) => {
  if(ctx.session.isAuth)
    ctx.render("pages/admin");
  else
    ctx.render("pages/login");
};

const skillsPost = async (ctx, next) => {

  const { age, concerts, cities, years } = ctx.request.body;

  const skills = [
    {
      "number": age,
      "text": "Возраст начала занятий на скрипке"
    },
    {
      "number": concerts,
      "text": "Концертов отыграл"
    },
    {
      "number": cities,
      "text": "Максимальное число городов в туре"
    },
    {
      "number": years,
      "text": "Лет на сцене в качестве скрипача"
    }
  ]

  db.skillsDB().set('skills', skills).write();
  ctx.render("pages/admin");
};

const uploadPost = async (ctx, next) => {
  const { name: title, price} = ctx.request.body;
  const { name, size, path: filePath } = ctx.request.files.photo;

  let fileName = path.join(process.cwd(), 'public/assets/img/products', name);
  const fName = path.join('./assets/img/products/', name);
  const errUpload = await rename(filePath, fileName);

  if (errUpload) {
    console.log('error');
    ctx.render("pages/admin", {
      msgfile: 'Ошибка'
    });
  }

  db.productsDB().get('products')
    .push({
      src: fName,
      name: title,
      price
    })
    .write();

  ctx.render("pages/admin", {
    msgfile: 'Данные успешно добавлены'
  });
};

module.exports = {
  indexGet,
  indexPost,
  loginGet,
  loginPost,
  adminGet,
  skillsPost,
  uploadPost
}