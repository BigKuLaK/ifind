const processUserData = async (data) => {
  if ( data.first_name || data.last_name ) {
    data.full_name_preview = [ data.first_name, data.last_name ].join(' ');
  }
}

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      await processUserData(data);
    },
    async beforeUpdate(params, data) {
      await processUserData(data);
    },
  }
}
