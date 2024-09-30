const { createProxyMiddleware } = require('http-proxy-middleware');


const baseUrl = process.env.BASE_URL;
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `${baseUrl}`,
      changeOrigin: true,
    })
  );
};