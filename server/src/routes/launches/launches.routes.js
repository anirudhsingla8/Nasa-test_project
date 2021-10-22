const express = require('express');
const app = require('../../app');
const {httpGetAllLaunches,httpAddNewLaunch,httpAbortLaunch} = require('./launches.controller');
const router = express.Router();

router.get('/',httpGetAllLaunches);
router.post('/',httpAddNewLaunch);
router.delete('/:id',httpAbortLaunch);

module.exports = router;