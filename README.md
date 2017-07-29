# WakeLight

A simple wake up light built with Chip and Johnny Five

## Contributing
To install and develop on a regular computer, install dependencies with
```
yarn install --production
```

## Deployment
Deployment is handled by PM2. In order to deploy the application, PM2 should be installed globally on your local machine and on your deployment server. See [PM2 deployment](http://pm2.keymetrics.io/docs/usage/deployment/) for more information on deploying an application with PM2.

##### Configuration
Copy the example file `keys.example.json` to your file system and update the credentials. Then copy the file to your deployment server and updated the location of the file in `index.js`.

In `ecosystem.config.js` update the production object according to your deloyment server.

## Troubleshooting
##### Environment
Be sure yarn, npm, node, and pm2 are available globally on the deployment server. To confirm, try running `which npm`, `which node`, `which pm2`, and `which yarn`. Then switch users and try running the same commands. If there is no output, you need to make the programs available for all users. One simple way to do this is to add a symlink for the programs that link it to an entry in `/usr/bin`. For example:
```
sudo ln -s `which nodejs` /usr/bin/node
```
