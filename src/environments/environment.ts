export const environment = {

  production: false,

  defaultTarget: "local",
  targets: {
    local: {
      url: "http://localhost:8082",
      apiPath: "/api/"
    },
    staging: {
      url: "http://localhost:8083",
      apiPath: "/api/"
    },
    production: {
      url: "http://localhost:8084",
      apiPath: "/api/"
    },
  }

};
