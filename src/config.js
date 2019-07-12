export default {
    MAX_ATTACHMENT_SIZE: 5000000,
    s3: {
      REGION: "sa-east-1",
      BUCKET: "teste-upload-app"
    },
    apiGateway: {
      REGION: "sa-east-1",
      URL: "https://c8s8u5w3hg.execute-api.sa-east-1.amazonaws.com/dev"
    },
    cognito: {
      REGION: "us-east-2",
      USER_POOL_ID: "us-east-2_08JGHU0I3",
      APP_CLIENT_ID: "3pk7m80ks86kk2knofu4b7t2ch",
      IDENTITY_POOL_ID: "us-east-2:5c5cf614-4282-42bc-95ed-817a2973c56a"
    }
  };
  