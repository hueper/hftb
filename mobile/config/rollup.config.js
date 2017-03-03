// thank you @RodolfoSilva for your example:
// https://github.com/driftyco/ionic-app-scripts/issues/760#issuecomment-282618654
const rollupConfig = require('@ionic/app-scripts/config/rollup.config');
const replace = require('rollup-plugin-replace');

const isProd = (process.env.IONIC_ENV === 'prod');
const rollupConfigReplaceEnviroment = replace({
  exclude: 'node_modules/**',
  '/environments/environment.dev' : ( isProd ? '/environments/environment.prod' : '/environments/environment.dev'),
});

rollupConfig.plugins = rollupConfig.plugins || [];
rollupConfig.plugins.splice(0, 0, rollupConfigReplaceEnviroment);

module.exports = rollupConfig;
