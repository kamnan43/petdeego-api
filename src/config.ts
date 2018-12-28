const env = process.env.NODE_ENV || 'localhost';

console.log('====> Environment: ', env);

import localhost from './config/config.localhost';
import develop from './config/config.develop';
import production from './config/config.production';

const setupConfig = (env) => {
  switch (env) {
    case 'production':
      return production;
    case 'develop':
      return develop;
    default:
      return localhost;
  }
};

export const config = setupConfig(env);
