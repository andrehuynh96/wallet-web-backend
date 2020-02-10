const config = require("app/config");
if (config.enableSeed) {
  try {
    require("./member");
  }
  catch (err) {
    console.log(err)
  }
}