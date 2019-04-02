export const environment = {

  production: false,

  defaultTarget: "local",
  targets: {
    local: {
      url: "http://localhost:8082",
      apiPath: "/api/",
      schemaPath: 'config/schema',
      limits: {
        authors: 40,
        quotes: 20
      }
    },
    staging: {
      url: "http://localhost:8083",
      apiPath: "/api/",
      schemaPath: 'config/schema',
      limits: {
        categories: 40,
        questions: 25
      }
    },
    production: {
      url: "http://localhost:8084",
      apiPath: "/api/",
      schemaPath: 'config/schema',
      limits: {
        categories: 40,
        questions: 15
      }
    },
  }


};
