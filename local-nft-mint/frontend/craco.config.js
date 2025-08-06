// craco.config.js
module.exports = {
  webpack: {
    configure: (config) => {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...(config.resolve.fallback || {}),
          buffer: require.resolve('buffer/')
        }
      };
      return config;
    },
  },
};
