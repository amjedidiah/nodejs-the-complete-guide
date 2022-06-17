// Module imports
const express = require('express');

const router = new express.Router();

// Controller imports
const homeController = require('../controllers/home.controller');

router.use('/', homeController);

module.exports = router;
