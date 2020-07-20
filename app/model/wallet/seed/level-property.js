const KYC = require('app/model/wallet').kycs;
const Model = require('app/model/wallet').kyc_properties;
const KycDataType = require('../value-object/kyc-data-type');

module.exports = async () => {
  let count = await Model.count();
  if (count == 0) {
    let kyc0 = await KYC.findOne({
      where: {
        key: "LEVEL_0"
      }
    });
    await Model.bulkCreate([{
      kyc_id: kyc0.id,
      field_name: "Email",
      field_key: "email",
      description: "Your Email",
      data_type: KycDataType.EMAIL,
      member_field: "email",
      require_flg: true,
      check_data_type_flg: true,
      order_index: 0,
      enabled_flg: true,
      group_name: "",
    }, {
      kyc_id: kyc0.id,
      field_name: "Password",
      field_key: "password",
      description: "Your Password",
      data_type: KycDataType.PASSWORD,
      member_field: "password_hash",
      require_flg: true,
      check_data_type_flg: false,
      order_index: 1,
      enabled_flg: true,
      group_name: "",
    }], {
        returning: true
      });

    let kyc1 = await KYC.findOne({
      where: {
        key: "LEVEL_1"
      }
    });
    await Model.bulkCreate([{
      kyc_id: kyc1.id,
      field_name: "First Name",
      field_key: "first_name",
      description: "Your First Name",
      data_type: KycDataType.TEXT,
      member_field: "first_name",
      require_flg: true,
      check_data_type_flg: false,
      order_index: 2,
      enabled_flg: true,
      group_name: "",
    },
    {
      kyc_id: kyc1.id,
      field_name: "Last Name",
      field_key: "last_name",
      description: "Your Last Name",
      data_type: KycDataType.TEXT,
      member_field: "last_name",
      require_flg: true,
      check_data_type_flg: false,
      order_index: 2,
      enabled_flg: true,
      group_name: "",
    },
    {
      kyc_id: kyc1.id,
      field_name: "Country",
      field_key: "country",
      description: "Your Country",
      data_type: KycDataType.TEXT,
      member_field: "country",
      require_flg: true,
      check_data_type_flg: false,
      order_index: 3,
      enabled_flg: true,
      group_name: "Country & City of residence",
    },
    {
      kyc_id: kyc1.id,
      field_name: "City",
      field_key: "city",
      description: "Your City",
      data_type: KycDataType.TEXT,
      member_field: "city",
      require_flg: true,
      check_data_type_flg: false,
      order_index: 4,
      enabled_flg: true,
      group_name: "Country & City of residence",
    },
    {
      kyc_id: kyc1.id,
      field_name: "Date of birth",
      field_key: "date_of_birth",
      description: "Your BOD",
      data_type: KycDataType.DATETIME,
      member_field: "date_of_birth",
      require_flg: true,
      check_data_type_flg: false,
      order_index: 5,
      enabled_flg: true,
      group_name: "",
    }], {
        returning: true
      });

    let kyc2 = await KYC.findOne({
      where: {
        key: "LEVEL_2"
      }
    });
    await Model.bulkCreate([{
      kyc_id: kyc2.id,
      field_name: "Phone",
      field_key: "phone",
      description: "Your Phone",
      data_type: KycDataType.TEXT,
      member_field: "phone",
      require_flg: true,
      check_data_type_flg: false,
      order_index: 0,
      enabled_flg: true,
      group_name: "",
    },
    {
      kyc_id: kyc2.id,
      field_name: "Country Phone Code",
      field_key: "country_phone_code",
      description: "Your Country Phone Code",
      data_type: KycDataType.TEXT,
      member_field: "country_phone_code",
      require_flg: true,
      check_data_type_flg: false,
      order_index: 0,
      enabled_flg: true,
      group_name: "",
    }, {
      kyc_id: kyc2.id,
      field_name: "Address",
      field_key: "address",
      description: "Your Address",
      data_type: KycDataType.TEXT,
      member_field: "address",
      require_flg: true,
      check_data_type_flg: false,
      order_index: 1,
      enabled_flg: true,
      group_name: "",
    }], {
        returning: true
      });
  }
};