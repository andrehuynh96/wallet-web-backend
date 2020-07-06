const Model = require('app/model/wallet').kycs;

module.exports = async () => {
  let count = await Model.count();
  if (count == 0) {
    let result0 = await Model.create({
      name: "Level 0",
      key: "LEVEL_0",
      description: "",
      order_index: 0,
      prev_level: 0,
      have_to_pass_prev_level_flg: false,
      auto_approve_flg: true
    });

    let result1 = await Model.create({
      name: "Level 1",
      key: "LEVEL_1",
      description: "",
      order_index: 0,
      prev_level: result0.id,
      have_to_pass_prev_level_flg: true,
      auto_approve_flg: true
    });
    await Model.create({
      name: "Level 2",
      key: "LEVEL_2",
      description: "",
      order_index: 0,
      prev_level: result1.id,
      have_to_pass_prev_level_flg: true,
      auto_approve_flg: true
    });
  }
};