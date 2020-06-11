const config = require("app/config");

if (config.enableSeed) {
  try {
    require("./member");
    require("./currency");
    require("./setting");
    require("./membership-type");
  }
  catch (err) {
    console.log(err);
  }
}
