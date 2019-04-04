export const environment = {

  production: false,
  currentSchedulerLoaderInterval: 30000,
  defaultTarget: "local",
  targets: {
    local: {
      url: "http://localhost:8082",
      apiPath: "/api/",
      schemaPath: 'config/schema',
      limits: {
        authors: 40,
        quotes: 20,
        schedule: 6
      },
      color: "dodgerblue",
      title: "Author Quotes Database Manager"
    },
    staging: {
      url: "http://localhost:8083",
      apiPath: "/api/",
      schemaPath: 'config/schema',
      limits: {
        categories: 40,
        questions: 25,
        schedule: 5
      },
      color: "green",
      title: "Trivia Bank Database Manager"
    },
    production: {
      url: "http://localhost:8084",
      apiPath: "/api/",
      schemaPath: 'config/schema',
      limits: {
        categories: 40,
        questions: 15,
        schedule: 5
      },
      color: "maroon",
      title: "Trivia Bank Database Manager"
    },
  }


};
