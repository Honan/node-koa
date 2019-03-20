const Koa = require("koa");
const app = new Koa();
const static = require("koa-static");
const session = require("koa-session");
const Pug = require("koa-pug");
const fs = require("fs");
const pug = new Pug({
  viewPath: "./views",
  pretty: false,
  basedir: "./views",
  noCache: true,
  app: app
});

const config = require("./config");

app.use(static("./public"));

const router = require("./routes");

app
  .use(session(config.session, app))
  .use(router.routes())
  .use(router.allowedMethods());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server start on port: ", port);
});
