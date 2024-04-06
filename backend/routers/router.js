const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.js')


router.get('/', controller.connection)

// ********* Post Requests *********
router.post('/register', controller.register)

router.post('/login', controller.login);

router.post('/updateProfile/:id/:reciever', controller.updateProfile)

router.post('/addContact/:id', controller.addContact)

router.post('/sendMessage/:id/:reciever',controller.sendMessage)

router.post('/verifyHome', controller.verifyAuth, controller.verifyHome)

router.post('/verifyAddContacts', controller.verifyAuth, controller.verifyAddContacts)


// ********* Get Requests *********
router.get('/getAllUsers',controller.getAllUsers)

router.get('/getContacts/:id/:reciever', controller.getContacts)

router.get('/getUserDetails/:id/:reciever', controller.getUserDetails)

router.get('/getMessages', controller.getMessages)

module.exports = router;
