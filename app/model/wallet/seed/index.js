const config = require("app/config");

(async () => {
  try {
    // if (config.enableSeed) {
    await Promise.all([require("./member")(),
    require("./currency")(),
    require("./membership-type")(),
    require("./setting")(),
    require("./fiat-currency")(),
    require("./fiat-cryptocurrency")()]);
    await require("./level")();
    await require("./level-property")();
    await require("./email-template")();
    //  }
    await require("./migration-member-kyc")();
    await require("./exchange-currency")();
  }
  catch (err) {
    console.log(err)
  }
}
)()