/// <reference path="./.sst/platform/config.d.ts" />

export default {
  app: (input) => ({
    name: "auth-labV2",
    removal: input.stage === "production" ? "retain" : "remove",
    protect: input.stage === "production",
    home: "aws",
  }),

  async run() {
    const vpc = new sst.aws.Vpc("AuthApiVpc");
    const cluster = new sst.aws.Cluster("AuthApiCluster", { vpc });

    new sst.aws.Service("AuthApiService", {
      cluster,
      image: "Dockerfile",
      loadBalancer: {
        rules: [
          { listen: "80/http" },
          { listen: "3000/http", forward: "80/http" }
        ],
        healthCheck: {
          port: 3000,
          path: "/",
        },
      },
      dev: {
        command: "npm run dev",
      },
    });
  }
};
