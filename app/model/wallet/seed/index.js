const config = require("app/config");
if (config.enableSeed) {
  try {
    require("./member");
    require("./currency");
    require("./setting");
  }
  catch (err) {
    console.log(err)
  }
}