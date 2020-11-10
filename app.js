const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      version: "1.0.0",
      title: "Gebeya Ecommerce API",
      description: "Ecommerce API Information",
    },
    // host: "localhost:5000",
    basePath: "/",
    schemes: ["http", "https"],

    components: {
      securitySchemes: {
        bearerAuth: {
          name: "Authorization",
          in: "header",
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // ['.routes/*.js']
  apis: ["app.js", "./routes/*.js"],
};

const config = require("./config/database");
const User = require("./models/User");
require("./passport")(passport);

const { jwtSecret, jwtExpire } = require("./config/keys");

// Routes
const itemsRoute = require("./routes/itemsRoute");
const cartsRoute = require("./routes/cartsRoute");

mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;

// check connection
db.once("open", () => {
  console.log(`Connected to ${db.name}`);
});

db.on("error", (err) => {
  console.log(err);
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use passport session
app.use(passport.initialize());
app.use(passport.session());

// Authentication Middleware
const authenticationMiddleware = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user, message) => {
    if (error || !user) {
      if (!message) {
        message = { message: "No User Found with this token" };
      } else if (Object.keys(message).length <= 0) {
        message = { message: "No Auth token Provided" };
      }
      console.log(error);
      res.status(401).send(message);
    } else if (user) {
      req.user = user;
      next();
    }
  })(req, res, next);
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, { explorer: false })
);

// Routes
/**
 * @swagger
 * /api/:
 *  get:
 *    description: Use to request the homepage
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.get("/api/", (req, res) => {
  res.status(200).send({
    message: "Homepage",
  });
});

// Routes
/**
 * @swagger
 * /api/login:
 *  post:
 *    description: Used to login and generate token
 *    consumes:
 *       - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *    definitions:
 *       inBody:
 *         type: object
 */
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        errorMessage: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        errorMessage: "Invalide Credentials",
      });
    }

    //payload
    const payload = {
      user: {
        _id: user._id,
      },
    };

    await jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: jwtExpire },
      (err, token) => {
        if (err) console.log("jwt err", err);

        res.status(200).json({
          token,
        });
      }
    );
  } catch (err) {
    console.log("SignInController Error", err);
    res.status(500).json({
      errorMessage: "Server error",
    });
  }
});

// Routes
/**
 * @swagger
 * /api/register:
 *  post:
 *    description: Used to register User
 *    consumes:
 *       - application/json
 *    produces:
 *       - application/json
 *    parameters:
 *      - in: body
 *        name: user
 *        required: true
 *        description: user objects {fullname,email,username,password}
 *        schema:
 *          type: object
 *          required:
 *            - fullName:
 *                type: string
 *              email:
 *                type: string
 *              username:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.post("/api/register", (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (!fullName || !email || !username || !password) {
    res.status(400).json({ message: "Please Provide Valid Parameters" });
  }

  let newUser = new User({
    fullName,
    email,
    username,
    password,
  });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
      }

      newUser.password = hash;
      newUser.save((err) => {
        if (err) {
          console.log(err);
          return;
        } else {
          res.status(200).send({
            message: "registered successfuly",
          });
        }
      });
    });
  });
});

app.use("/api/", authenticationMiddleware, itemsRoute);
app.use("/api/", authenticationMiddleware, cartsRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("server listening at port " + port));
