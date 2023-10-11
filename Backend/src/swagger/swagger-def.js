const swaggerDef = {
  openapi: "3.0.0",
  info: {
    title: "E-Com API Documentation",
    version: "1.0.0",
    license: {
      name: "MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api/v1",
    },
  ],
};

export default swaggerDef;
