// LOCAL ENVIRONMENT CONFIGS (see security warning below)
export const environment = {

  production: false,

  /** provide env name so we can display it in the UI to keep track of which database we are connected to */
  name: "local",
  /** the app engine url, the same url that the Dialogflow uses for its webhook */
  backendUrl: "http://localhost:8080",
  apiPath: "/api/",


  /**
   * SECURITY WARNING!
   * This is the same secret key that Dialogflow uses to connect to the webhook
   * You should provide the secret key here ONLY if deploying the admin client within a secure environment.
   * as this will expose the Dialogflow authentication key to the world via the Angular source code.
   */
  dialogflowSecretKey: "abc1234cde",
  /** same path that Dialogflow uses (not necessary unless using dialogflowSecretKey) */
  dialogflowPath: "/dialogflow/",

};
