# SAGE Assessment Server

## Dependencies
- [MongoDB](#mongodb)
- [Node](#node)

## Installation
Installation instructions are currently only available for Macs.

### MongoDB
1. Install [Homebrew](http://brew.sh/).
2. Use Homebrew to install MongoDB: `brew install mongodb`.

### Node
1. Install [Homebrew](http://brew.sh/).
2. Use Homebrew to install Node: `brew install node`.

## Importing Mock Data
You can run this command to get mock data in your database:

`npm run mocks`.

## Starting the Server
1. Start the MongoDB server. You'll need to leave the terminal window running.

  `mongod --config /usr/local/etc/mongod.conf`
  
2. Install the dependencies.

  `npm install`

3. Start the server.

  `npm run gulp`
  
