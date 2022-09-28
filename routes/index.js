const express = require('express');
const controllers = require('../controllers');
const router = express.Router();

router.post('/find-user', controllers.findByEmail);
router.post('/create', controllers.create);
router.put('/update-password', controllers.updatePassword);
router.delete('/delete', controllers.delete);

module.exports = router

