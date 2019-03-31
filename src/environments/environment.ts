export const environment = {

  production: false,

  defaultTarget: "local",
  targets: {
    local: {
      url: "http://localhost:8082",
      apiPath: "/api/",
      schemaPath: 'config/schema'
    },
    staging: {
      url: "http://localhost:8083",
      apiPath: "/api/",
      schemaPath: 'config/schema'
    },
    production: {
      url: "http://localhost:8084",
      apiPath: "/api/"
    },
  }

};
