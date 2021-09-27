const Database = require('./Database');
const { models } = require('../config');

class Model {
  constructor() {
    this.class = this.__proto__.constructor;
  }

  update(data) {
    // Filter data to ensure only model properties are present
    const sanitizedData = {};

    const modelData = models[this.class.model];

    console.log('got model', {models});

    // Ensure that this task the model defined
    if ( !modelData ) {
      return;
    }

    const fields = modelData.fields || [];

    fields.forEach(({ name: fieldName }) => {
      if ( fieldName in data ) {
        sanitizedData[fieldName] = data[fieldName];
        this[fieldName] = data[fieldName];
      }
    });

    console.log({ sanitizedData });

    // Save to DB
    Database.update( this.class.model, this.id, sanitizedData);
  }
}

// Child class should define Model.model
// e.g., Task.model = 'task'

/**
 * Static methods
 */
 Model.getAll = function() {
  return (
    // Get alll database entries
    Database.getAll( this.model )
    // Instantiate as Task instances
    .map(rawData => new this(rawData))
  );
};

module.exports = Model;
