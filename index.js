const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");

let httpServer = http.createServer((req, res) => {
  myServer(req, res);
});

let myServer = (req, res) => {
  //parse that url
  let parsedUrl = url.parse(req.url, true);

  //get that path we are requesting
  let path = parsedUrl.pathname;

  //trim that SOB with regex
  let trimmedPath = path.replace(/^\/+|\/+$/g, "");

  //we need to get that query
  let queryStringObject = parsedUrl.queryStringObject;

  //Gotta get the method you know like get post delete
  let method = req.method.toLowerCase();

  //Headers baby
  let header = req.headers;

  //Got any payload?

  let decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", () => {
    buffer += decoder.end();
  });

  let chosenHandler =
    typeof router.trimmedPath !== "undefined"
      ? router.trimmedPath
      : handler.notFound;

  let data = {
    trimmedPath,
    queryStringObject,
    method,
    header,
    payload: "buffer"
  };

  chosenHandler(data, (statusCode, payload) => {
    statusCode = typeof statusCode == "number" ? statusCode : 204;

    payload = typeof payload == "object" ? payload : {};

    let payloadString = JSON.stringify(payload);

    res.writeHead(statusCode);
    res.end(payloadString);
  });
};

let handler = {};

handler.hello = (data, callback) => {
  callback(200, { name: "sample handler" });
};

handler.notFound = (data, callback) => {
  callback(404);
};
let router = {
  hello: handler.hello
};
