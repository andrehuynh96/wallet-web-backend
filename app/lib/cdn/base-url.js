let baseUrl;
module.exports = {
  setBaseUrl: (url) => {
    baseUrl = url;
  },
  getBaseUrl: () => {
    return baseUrl;
  }
}