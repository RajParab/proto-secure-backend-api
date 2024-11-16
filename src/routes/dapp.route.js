const express = require('express');
const dappController = require("../controllers/dapp.controller")
const router = express.Router();

if (process.env.SERVER == "testnet") {
    router.post('/submit-form', dappController.addProjectForm);
    router.post('/update-contract', dappController.updateDappForm);
    router.get('/list-projects', dappController.listDapps);
    router.get('/update-status', dappController.changeStatus);
}

module.exports = router;