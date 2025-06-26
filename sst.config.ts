/// <reference path="./.sst/platform/config.d.ts" />

export default {
  app: (input) => ({
    name: "auth-lab",
    removal: input.stage === "production" ? "retain" : "remove",
    protect: input.stage === "production",
    home: "aws",
  }),

  async run() {
    const vpc = new sst.aws.Vpc("AuthVpc");
    const cluster = new sst.aws.Cluster("AuthCluster", { vpc });

    new sst.aws.Service("AuthService", {
      cluster,
      image: "Dockerfile",
      loadBalancer: {
        rules: [
          { listen: "80/http" },
          { listen: "3000/http", forward: "80/http" }
        ],
      },
      dev: {
        command: "npm run dev",
      },
    });
  }
};
