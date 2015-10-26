Simulator
==========
Simulate ORS, Gateway, Exchang, Priceboard, Business securities company

## Installation

Make sure you have latest version of [NodeJS](https://nodejs.org/) and [npm](https://docs.npmjs.com/cli/update) running.

cd to project folder and install the Node packages required.

```
npm install
```
(may need to install as root/administrator if encountering errors)

Then install the bower packages used in the project.

```
npm install -g bower
bower install
```
If bower cannot work with git protocol:
```
git config --global url."https://".insteadOf git://
```
To start working on the build, run:

```
npm install -g grunt-cli
grunt serve
```

Easy peasy!

## Deployment on production

Make sure your server has the latest version of [NodeJS](https://nodejs.org/) and [npm](https://docs.npmjs.com/cli/update) running (see *Installation* above).

To generate production version of the build, run:

```
grunt build
```

The "binary" version of the build will be generated to /dist. If /dist is previously generated, it will be cleaned and generated again.