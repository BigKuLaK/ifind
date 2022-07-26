module.exports = {
  apps: [
    {
      name: "ifind_admin",
      script: "npm",
      args: "run develop",
      watch: false,
      max_memory_restart: "200M",
      env: {
        ...process.env,
        "NODE_TLS_REJECT_UNAUTHORIZED": "0",
      }
    },
    // {
    //   name: "amazon-page-errors",
    //   script: "npm",
    //   args: "run serve:amazon-page-errors",
    //   watch: false,
    // },
  ],
};
