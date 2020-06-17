const config = require("app/config");

if (config.enableSeed) {
  try {
    require("./member");
    require("./currency");
    require("./membership-type");
    require("./setting");
  }
  catch (err) {
    console.log(err);
  }
}
