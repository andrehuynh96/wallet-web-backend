const Model = require("app/model/wallet").settings;

(async () => {
  let count = await Model.count();
  if (count == 0) {
    await Model.bulkCreate([{
      key: "SEND_EMAIL",
      value: "0"
    },
    {
        key: "ADMIN_EMAIL_ADDRESS",
        value:""
    }], {
        returning: true
      });
  } 
})();