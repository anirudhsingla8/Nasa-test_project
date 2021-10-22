const express = require('express');
const launchesRouter = require('./launches/launches.routes');
const planetRouter = require('./planets/planets.routes');
const api = express.Router();

api.use('/launches',launchesRouter);
api.use('/planets',planetRouter);

module.exports = api;