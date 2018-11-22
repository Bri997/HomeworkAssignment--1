let environments = {};

environments.staging = {
  httpPort: 8080,
  envName: "staging"
};

environments.production = {
  httpPort: 5000,
  envName: "production"
};

let currentEnv =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

let envToExport =
  typeof environments[currentEnv] == "object"
    ? environments[currentEnv]
    : environments.staging;

module.exports = envToExport;
