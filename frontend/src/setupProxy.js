const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://ai-saas-5z18.onrender.com',
      changeOrigin: true,
    })
  );
};