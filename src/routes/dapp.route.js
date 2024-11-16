const express = require('express');
const dappController = require('../controllers/dapp.controller');
const router = express.Router();

router.post('/submit-form', dappController.addProjectForm);
router.post('/update-contract/:chainID', dappController.updateDappForm);
router.get('/list-projects', dappController.listDapps);
router.post('/update-status/:chainID', dappController.changeStatus);

module.exports = router;
