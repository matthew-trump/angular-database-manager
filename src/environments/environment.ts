export const environment = {

  production: false,

  defaultTarget: "authorQuotes",
  targets: {
    authorQuotes: {
      url: "http://localhost:8082",
      currentSchedulerLoaderInterval: 0,
      loginPath: "/login",
      apiPath: "/api/",
      schemaPath: 'config/schema',
      limits: {
        authors: 40,
        works: 15
      },
      color: "maroon",
      title: "Author Quotes"
    },
    quizzes: {
      url: "http://localhost:8083",
      currentSchedulerLoaderInterval: 30000,
      loginPath: "/login",
      apiPath: "/api/",
      schemaPath: 'config/schema',
      limits: {
        categories: 40,
        questions: 25,
        schedule: 5
      },
      color: "green",
      title: "Quizzes Database Manager"
    },
    quizzesDeluxe: {
      url: "http://localhost:8085",
      currentSchedulerLoaderInterval: 0,
      loginPath: "/login",
      apiPath: "/api/",
      schemaPath: 'config/schema',
      limits: {
        categories: 40,
        questions: 5
      },
      color: "dodgerblue",
      title: "Quizzes Deluxe"
    }

  }


};
