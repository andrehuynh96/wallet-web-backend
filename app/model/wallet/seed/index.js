const config = require("app/config");
if (config.enableSeed) {
  try {
    require("./member");
    require("./currency");
  }
  catch (err) {
    console.log(err)
  }
}