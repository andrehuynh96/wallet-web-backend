const logger = require('app/lib/logger');

module.exports = {
  getPropertyValue(settings, propertyName, defaultValue) {
    const setting = settings.find(item => item.property === propertyName);
    if (!setting) {
      return defaultValue;
    }

    try {
      const { value, type } = setting;
      switch (type) {
        case 'string':
          return value;

        case 'number':
          return Number(value);

        case 'boolean':
          return value === 'true';
      }

      return value;
    } catch (error) {
      logger.info(error);
      return defaultValue;
    }
  },

};
