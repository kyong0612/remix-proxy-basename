const { flatRoutes } = require("remix-flat-routes");
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  publicPath: "/__remix__/build/",
  serverModuleFormat: "cjs",
  routes: async (defineRoutes) => {
    return flatRoutes("routes", defineRoutes);
  },
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
};
