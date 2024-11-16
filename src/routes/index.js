const express = require('express');
const dappRoute = require('./dapp.route');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/api',
    route: dappRoute, //User Route
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
