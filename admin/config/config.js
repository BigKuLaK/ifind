module.exports = {
  //
  graphql: {
    endpoint: '/admin/api',
    shadowCRUD: true,
    playgroundAlways: true,
    // depthLimit: 7,
    // amountLimit: 100,
    apolloServer: {
      tracing: false,
    },
  },
};
