const config = require("app/config");

(async () => {
  try {
    if (config.enableSeed) {
      await Promise.all([require("./member")(),
      require("./currency")(),
      require("./membership-type")(),
      require("./setting")()]);
      await require("./level")();
      await require("./level-property")();
    }
  }
  catch (err) {
    console.log(err)
  }
}
)()