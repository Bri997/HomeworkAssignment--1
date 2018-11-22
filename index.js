const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");
const config = require("./config");

//creating a http server

let httpServer = http.createServer((req, res) => {
  myServer(req, res);
});

httpServer.listen(config.httpPort, () => {
  console.log(
    `The server is listening on port ${config.httpPort} and is in ${
      config.envName
    } mode`
  );
});

let myServer = (req, res) => {
  //parse that url
  let parsedUrl = url.parse(req.url, true);

  //get that path we are requesting
  let path = parsedUrl.pathname;

  //trim that path with regex
  let trimmedPath = path.replace(/^\/+|\/+$/g, "");

  //we need to get that query
  let queryStringObject = parsedUrl.query;

  //Find the method you know like get post delete
  let method = req.method.toLowerCase();

  //Headers
  let headers = req.headers;

  //Got any payload?

  let decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", data => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer = +decoder.end();
  });

  let data = {
    method: method,
    trimmedPath: trimmedPath,
    queryStringObject: queryStringObject,
    headers: headers,
    payload: buffer
  };

  let chosenHandler =
    typeof router[trimmedPath] !== "undefined"
      ? router[trimmedPath]
      : handlers.notFound;

  chosenHandler(data, (statusCode, payload) => {
    statusCode = typeof statusCode == "number" ? statusCode : 204;

    payload = typeof payload == "object" ? payload : {};

    let payloadString = JSON.stringify(payload);

    res.setHeader("Content-Type", "application/json");
    res.writeHead(statusCode);
    res.end(payloadString);

    console.log(
      `Returing this response for ${trimmedPath} path with a ${statusCode} and ${payloadString} `
    );
  });
};

//Path handlers object
let handlers = {};

//hello path
handlers.hello = (data, callback) => {
  callback(200, { message: "Hey there. How you doing?" });
};

//defualt not found
handlers.notFound = (data, callback) => {
  callback(404, { message: "Whoops not found buddy" });
};

//router object
let router = {
  hello: handlers.hello
};
