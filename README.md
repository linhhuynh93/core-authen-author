# Node Typescript API

## How to run the project

1. Install Docker, follow this instruction: https://docs.docker.com/docker-for-mac/install/
2. (Optional if you want to generate sample data) Install NodeJs (to install dependencies we need NodeJs): https://github.com/creationix/nvm#install-script
3. Pull `node-typescript-api` project, `cd` to `node-typescript-api` folder
4. (Optional if you want to generate sample data) Install dependencies with command: `npm i`
5. To start server with development environment: `make run.dev`. Wait until this message is shown: `api_1 | {"level":"info","message":"The server is starting at port 3000"}`. Now, the server is running successfully on your local machine.
6. (Optional) To generate data for development. Please type and run this command on your command line tool: `make migrate.dev`

> Note: Currently in development environment, `mount volume` is commenting out to make sure the project can run successfully on any machine. To use `mount volumne` while developing, please config your `Docker` to run with non-root user. Follow this instruction: https://docs.docker.com/v17.09/engine/installation/linux/linux-postinstall/
