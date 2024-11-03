const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const systemConfig = require("./config/system");

require("dotenv").config();

// initialize database
const database = require("./config/database");
database.connect();

// initialize web app by express
const app = express();
const port = process.env.PORT;

app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// set prefixAdmin become a system variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Set up the directory containing the view files (templates) and set pug for template engine
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// show annoucement when finish an event
app.use(cookieParser("keyboard cat"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// set up public things for client can read
app.use(express.static(`${__dirname}/public`));

// routes
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
