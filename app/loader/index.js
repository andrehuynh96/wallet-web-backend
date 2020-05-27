module.exports = {
  init: (app) => {
    require("./axios");

    setTimeout(() => {
      const migrationMembers = require('app/worker/jobs/migration-members');
      migrationMembers();
    }, 15 * 1000);
  }
};
