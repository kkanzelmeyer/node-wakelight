
module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: 'Lillian Wakelight',
      script: 'dist/index.js',
      interpreter: './node_modules/.bin/babel-node',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'kevin',
      host: '192.168.1.78',
      ref: 'origin/master',
      repo: 'git@github.com:kkanzelmeyer/node-wakelight.git',
      path: '/home/kevin/deploy/wakelight',
      'post-deploy': 'yarn --ignore-engines && pm2 reload ecosystem.config.js --env production',
    },
  },
};
