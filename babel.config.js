module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["@babel/plugin-proposal-pipeline-operator", { "proposal": "smart" }],
      ["@babel/plugin-proposal-nullish-coalescing-operator"],
      ["@babel/plugin-proposal-do-expressions"],
      ["@babel/plugin-proposal-optional-chaining"],
      ["@babel/plugin-proposal-partial-application"]
    ]
  };
};
