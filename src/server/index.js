import bodyParser from "body-parser"
import cookieSession from "cookie-session"
import express from "express"
import helmet from "helmet"
import dataRouter from "./handlers/data-router"
import authCheck from "./handlers/auth-check"
import { readFileSync } from 'fs';
import http from 'http'
import https from 'https'
require('dotenv').load()

const server = express()

let options = {}
let host = process.env.HOST || 'localhost'
let serverPort = 3000

if (process.env.NODE_ENV === "production") {
  serverPort = 443
  options = {
    key: readFileSync(process.env.SSL_KEY),
    cert: readFileSync(process.env.SSL_CERT),
  };
}

// add in some security measures
server.use(helmet())

// add cookie session
server.use(cookieSession({
  name: "trackhub",
  keys: ["trackhub", "genome", "browser"],
  cookie: {
    secure: true,
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days; 24hrs/day, 60min/hour, 60sec/min, 1000ms/sec
  }
}))

// path for static resources
server.use("/assets", express.static("dist/assets"))

//support parsing of application/json type post data
server.use(bodyParser.json())

// make sure there is some authentication
const sendUserToLogin = function (req, res, next) {
  import(/* webpackChunkName: "login" */ "./handlers/login")
    .then(module => module.default(req, res, next))
}

const sendUserToApp = function (req, res, next) {
  import(/* webpackChunkName: "app" */ "./handlers/app")
    .then(module => module.default(req, res, next))
}

// enable router for data calls
server.use("/data", function(req, res, next) {
  return dataRouter(req, res, next);
})

// specific route for logout
server.get("/logout", (req, res, next) => {
  req.session = null
  res.redirect("/login")
})

// catch all for routes
server.use("*", authCheck(sendUserToLogin, sendUserToApp))

if (process.env.NODE_ENV === "development") {
  server.listen(serverPort, () => console.log(`Listening at http://${host}:${serverPort}`))
}

if (process.env.NODE_ENV === "production") {

  // start the server
  var httpsServer = https.createServer(options, server).listen(serverPort, function () {
    console.log("Express server listening on port " + serverPort);
  });

  // Redirect from http port 80 to https
  http.createServer(function (req, res) {
    let reqUrl = req.url;
    if (reqUrl === "/") {
      reqUrl = "/index.html";
    }
    var url = "https://" + req.headers['host'] + reqUrl;
    console.log("Redirecting to " + url);
    res.writeHead(301, { "Location": url });
    res.end();
  }).listen(80);
}
