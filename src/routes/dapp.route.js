const express = require('express');

const router = express.Router();

if (process.env.SERVER == "testnet") {
    router.post('/submit-form');
}

module.exports = router;